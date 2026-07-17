import type {
  GearshiftRecommendation,
  MatchedSignal,
  ModelProfile,
  ReasoningLevel,
  RiskAssessment,
  RiskRating,
  TaskCategory,
  TaskInput,
  VerificationRequirements,
} from "./domain";

type RiskKey = keyof RiskAssessment;
type VerificationFlag = Exclude<keyof VerificationRequirements, "steps">;

interface SignalRule {
  id: string;
  label: string;
  categories: TaskCategory[];
  matches: (text: string) => boolean;
  impact: RiskRating;
  risks?: Partial<RiskAssessment>;
  verification?: Partial<Record<VerificationFlag, boolean>>;
  reason: string;
  steps?: string[];
  forceProfile?: ModelProfile;
}

const includesAny = (text: string, terms: string[]) =>
  terms.some((term) => text.includes(term));

const hasAllGroups = (text: string, groups: string[][]) =>
  groups.every((group) => includesAny(text, group));

const signalRules: SignalRule[] = [
  {
    id: "save-schema-change",
    label: "Persistent schema change",
    categories: ["SaveLoad"],
    matches: (text) =>
      hasAllGroups(text, [
        ["セーブ", "save", "persistent"],
        ["形式", "フォーマット", "スキーマ", "移行", "互換", "schema", "format", "migration", "compatibility"],
      ]),
    impact: "High",
    risks: {
      implementationRisk: "High",
      gameStateRisk: "High",
      saveCompatibilityRisk: "High",
      regressionRisk: "High",
    },
    verification: {
      automatedTestsRequired: true,
      playtestRequired: true,
      saveMigrationCheckRequired: true,
    },
    reason: "永続データの構造が変わり、既存セーブの互換性を壊す可能性がある",
    steps: [
      "既存セーブを複製し、旧形式からの移行をテストする",
      "新規保存→読込のround tripと欠損フィールドをテストする",
    ],
    forceProfile: "deep",
  },
  {
    id: "cross-system-state",
    label: "Cross-system game state",
    categories: ["Gameplay", "Scene"],
    matches: (text) =>
      hasAllGroups(text, [
        ["勝敗", "勝利", "敗北", "win condition", "victory", "game over"],
        ["またぐ", "横断", "地下", "地上", "複数", "across", "layer", "system"],
      ]),
    impact: "High",
    risks: {
      implementationRisk: "High",
      gameStateRisk: "High",
      regressionRisk: "High",
    },
    verification: {
      automatedTestsRequired: true,
      playtestRequired: true,
    },
    reason: "複数のゲーム状態を横断する判定は、局所修正でも失敗範囲が広い",
    steps: ["各状態の組み合わせと境界ターンで勝敗判定を再生する"],
    forceProfile: "deep",
  },
  {
    id: "state-transition-change",
    label: "Core state transition",
    categories: ["Gameplay"],
    matches: (text) =>
      includesAny(text, [
        "ターン進行",
        "状態遷移",
        "ゲーム進行",
        "フェーズ遷移",
        "turn progression",
        "state transition",
        "phase transition",
      ]),
    impact: "High",
    risks: {
      implementationRisk: "High",
      gameStateRisk: "High",
      regressionRisk: "High",
    },
    verification: {
      automatedTestsRequired: true,
      playtestRequired: true,
    },
    reason: "中核の状態遷移を変更し、複数のゲーム進行経路へ波及する",
    steps: ["正常系・中断・再開を含む状態遷移表をテストする"],
    forceProfile: "deep",
  },
  {
    id: "intermittent-blocker",
    label: "Intermittent progression blocker",
    categories: ["Gameplay", "Tooling"],
    matches: (text) =>
      includesAny(text, [
        "再現性の低い",
        "再現しにくい",
        "進行不能",
        "まれに止まる",
        "intermittent",
        "softlock",
        "rarely freezes",
      ]),
    impact: "High",
    risks: {
      implementationRisk: "High",
      gameStateRisk: "High",
      regressionRisk: "High",
    },
    verification: {
      automatedTestsRequired: true,
      playtestRequired: true,
    },
    reason: "再現条件が不明な進行不能は観測点と複数仮説を必要とする",
    steps: ["状態・入力・scene遷移を記録する再現ログを追加する", "修正前の再現手順で反復playtestする"],
    forceProfile: "deep",
  },
  {
    id: "signal-wiring",
    label: "Signal wiring or input callback",
    categories: ["UI", "Input", "Gameplay"],
    matches: (text) =>
      includesAny(text, ["signal", "シグナル", "二重発火", "二重接続"])
      || hasAllGroups(text, [["ボタン", "button"], ["反応しない", "呼ばれない", "not respond"]]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", gameStateRisk: "Medium", regressionRisk: "Medium" },
    verification: { automatedTestsRequired: true, playtestRequired: true },
    reason: "入力event、Signal接続、受信callbackのどこで止まるかを切り分ける必要がある",
    steps: ["発火元、接続状態、受信回数を順に記録する"],
  },
  {
    id: "scene-state-loss",
    label: "State lost across scene transition",
    categories: ["Scene", "Gameplay", "SaveLoad"],
    matches: (text) =>
      hasAllGroups(text, [
        ["scene", "シーン"],
        ["切り替え後", "遷移後", "change"],
        ["消える", "失われる", "初期化", "lost", "reset"],
      ]),
    impact: "High",
    risks: { implementationRisk: "High", gameStateRisk: "High", regressionRisk: "High" },
    verification: { automatedTestsRequired: true, playtestRequired: true },
    reason: "sceneの破棄と同時に、保持すべきゲーム状態が失われている可能性がある",
    steps: ["scene切り替え前後で保持する値と所有Nodeを記録する"],
    forceProfile: "deep",
  },
  {
    id: "save-read-compatibility",
    label: "Legacy save load failure",
    categories: ["SaveLoad"],
    matches: (text) =>
      hasAllGroups(text, [
        ["古い", "旧", "legacy"],
        ["セーブ", "save"],
        ["読み込めない", "読めない", "load failure", "fails to load"],
      ]),
    impact: "High",
    risks: {
      implementationRisk: "High",
      gameStateRisk: "High",
      saveCompatibilityRisk: "High",
      regressionRisk: "High",
    },
    verification: { automatedTestsRequired: true, playtestRequired: true, saveMigrationCheckRequired: true },
    reason: "既存saveの後方互換性またはmigration経路が壊れている可能性がある",
    steps: ["失敗する旧saveを複製し、上書きせず読込経路を再現する"],
    forceProfile: "deep",
  },
  {
    id: "responsive-ui-layout",
    label: "Responsive Control layout",
    categories: ["UI", "VisualPolish"],
    matches: (text) =>
      includesAny(text, ["anchor", "container", "画面サイズによって崩れる", "解像度で崩れる", "uiが崩れる"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", regressionRisk: "Medium" },
    verification: { visualVerificationRequired: true, playtestRequired: true },
    reason: "ControlのAnchor、Container、viewport設定を複数解像度で確認する必要がある",
    steps: ["小・標準・横長の3解像度でControl配置を比較する"],
  },
  {
    id: "exported-file-path",
    label: "Exported file path mismatch",
    categories: ["Export", "Tooling"],
    matches: (text) =>
      hasAllGroups(text, [
        ["android", "web", "export", "書き出し後"],
        ["ファイルが見つからない", "file not found", "読めない", "load failure"],
      ]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", regressionRisk: "Medium" },
    verification: { automatedTestsRequired: true, exportCheckRequired: true },
    reason: "Editorとexport packageでfileのpathまたは含有条件が異なる可能性がある",
    steps: ["resource種別、使用path、export filterを確認して実buildで再現する"],
  },
  {
    id: "export-pipeline",
    label: "Platform export pipeline",
    categories: ["Export"],
    matches: (text) =>
      includesAny(text, ["export", "エクスポート", "android", "ios", "web build", "署名", "ビルド失敗"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", regressionRisk: "Medium" },
    verification: { automatedTestsRequired: true, exportCheckRequired: true },
    reason: "Editor内の動作だけでは対象プラットフォームの成功を確認できない",
    steps: ["対象presetで実exportし、生成物を端末または同等環境で起動する"],
  },
  {
    id: "physics-behavior",
    label: "Physics behavior",
    categories: ["Physics", "Gameplay"],
    matches: (text) =>
      includesAny(text, ["physics", "物理", "衝突", "collision", "重力", "velocity", "rigidbody", "すり抜け"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", gameStateRisk: "Medium", regressionRisk: "Medium" },
    verification: { automatedTestsRequired: true, playtestRequired: true, visualVerificationRequired: true },
    reason: "物理挙動はframe rateや境界条件で結果が変わりやすい",
    steps: ["固定physics tickと衝突境界で挙動を確認する"],
  },
  {
    id: "input-gameplay",
    label: "Player input behavior",
    categories: ["Input", "Gameplay"],
    matches: (text) =>
      includesAny(text, ["入力", "キー", "ボタン操作", "ダッシュ", "ジャンプ", "input", "key binding", "dash", "jump"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", gameStateRisk: "Medium", regressionRisk: "Medium" },
    verification: { automatedTestsRequired: true, playtestRequired: true },
    reason: "入力とゲーム状態の組み合わせは操作感と状態境界の両方に影響する",
    steps: ["単発・長押し・同時入力と状態境界をplaytestする"],
  },
  {
    id: "ai-behavior",
    label: "AI behavior",
    categories: ["AI", "Gameplay"],
    matches: (text) =>
      includesAny(text, ["敵ai", "ai挙動", "経路探索", "behavior tree", "pathfinding", "enemy ai"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", gameStateRisk: "Medium", regressionRisk: "Medium" },
    verification: { automatedTestsRequired: true, playtestRequired: true },
    reason: "AI挙動は環境と状態の組み合わせによる回帰が起きやすい",
    steps: ["代表sceneと障害物配置でAIの決定を反復確認する"],
  },
  {
    id: "performance-investigation",
    label: "Performance investigation",
    categories: ["Performance", "Tooling"],
    matches: (text) =>
      includesAny(text, ["重い", "カクつく", "fps", "profiler", "profile", "performance", "メモリリーク"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", regressionRisk: "Medium" },
    verification: { automatedTestsRequired: true, playtestRequired: true },
    reason: "性能問題は推測ではなく同一条件での計測比較が必要になる",
    steps: ["代表sceneをprofilerで計測し、変更前後のframe timeを比較する"],
  },
  {
    id: "scene-structure",
    label: "Scene structure change",
    categories: ["Scene"],
    matches: (text) =>
      includesAny(text, ["新しいシーン", "シーンを追加", "scene追加", "new scene", "add scene", "scene tree"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", regressionRisk: "Medium" },
    verification: { playtestRequired: true, visualVerificationRequired: true },
    reason: "scene追加は接続、初期化、表示の確認を必要とする通常機能変更である",
    steps: ["scene遷移、初期状態、戻り経路を実行確認する"],
  },
  {
    id: "visual-motion",
    label: "Visual motion change",
    categories: ["VisualPolish"],
    matches: (text) =>
      includesAny(text, ["アニメーション", "animation", "tween", "パーティクル", "particle", "sprite"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", regressionRisk: "Low" },
    verification: { playtestRequired: true, visualVerificationRequired: true },
    reason: "時間を伴う視覚変更は静的テストだけでは品質を確認できない",
    steps: ["開始・loop・終了状態を実画面で確認する"],
  },
  {
    id: "isolated-ui-copy",
    label: "Isolated UI copy",
    categories: ["UI"],
    matches: (text) =>
      includesAny(text, ["文言", "ラベル", "テキスト", "copy", "label text", "button text"]),
    impact: "Low",
    risks: { regressionRisk: "Low" },
    verification: { visualVerificationRequired: true },
    reason: "局所的な表示文言の変更で、ゲーム状態への影響がない",
    steps: ["対象画面で折返し、欠け、翻訳キーを目視確認する"],
  },
  {
    id: "isolated-visual-style",
    label: "Isolated visual style",
    categories: ["UI", "VisualPolish"],
    matches: (text) =>
      includesAny(text, ["色を変更", "色変更", "余白", "フォント", "color", "spacing", "font size"]),
    impact: "Low",
    risks: { regressionRisk: "Low" },
    verification: { visualVerificationRequired: true },
    reason: "状態やデータへ触れない局所的な見た目の変更である",
    steps: ["代表解像度で対象画面を比較する"],
  },
  {
    id: "isolated-audio",
    label: "Isolated audio asset",
    categories: ["Audio"],
    matches: (text) =>
      includesAny(text, ["効果音", "bgm", "audio clip", "sound effect", "音声を差し替え", "音を追加"]),
    impact: "Low",
    risks: { regressionRisk: "Low" },
    verification: { playtestRequired: true },
    reason: "単一の音声asset変更で、状態ロジックへの影響が限定される",
    steps: ["発火タイミング、音量、重複再生を実機で確認する"],
  },
  {
    id: "tooling-change",
    label: "Developer tooling",
    categories: ["Tooling"],
    matches: (text) =>
      includesAny(text, ["editor plugin", "importer", "インポータ", "デバッグツール", "ビルドスクリプト"]),
    impact: "Medium",
    risks: { implementationRisk: "Medium", regressionRisk: "Medium" },
    verification: { automatedTestsRequired: true },
    reason: "制作パイプラインの変更は複数assetや開発環境へ波及しうる",
    steps: ["空projectと代表projectの両方でtooling flowを実行する"],
  },
];

const riskRank: Record<RiskRating, number> = { Low: 0, Medium: 1, High: 2 };

const maxRisk = (left: RiskRating, right: RiskRating): RiskRating =>
  riskRank[left] >= riskRank[right] ? left : right;

const unique = <T>(values: T[]): T[] => [...new Set(values)];

const reasoningForProfile: Record<ModelProfile, ReasoningLevel> = {
  fast: "low",
  balanced: "medium",
  deep: "high",
};

const escalationFor = (profile: ModelProfile): string[] => {
  if (profile === "fast") {
    return [
      "変更が複数sceneまたは複数systemへ広がったら、作業を小さく分けて再分析する",
      "ゲーム状態や入力処理へ触れる場合は、実装前に正常系と戻し方を決める",
      "既存セーブ互換性へ触れる場合は、セーブを退避して互換性確認を追加する",
    ];
  }

  if (profile === "balanced") {
    return [
      "セーブ形式・migrationを含む場合は、既存セーブを退避して移行検証を追加する",
      "状態遷移や勝敗判定を複数systemで共有する場合は、組み合わせ表を先に作る",
      "再現条件が不明な進行不能が見つかった場合は、観測ログを先に追加する",
    ];
  }

  return [
    "影響する状態と再現手順が確定できない場合は実装前に観測点を追加する",
    "既存セーブの退避やrollback手段がない場合は変更を開始しない",
    "一度に検証できない範囲ならタスクを分割して再分析する",
  ];
};

const guidanceFor = (profile: ModelProfile, steps: string[]) => {
  const firstAction = steps[0] ?? "変更対象を小さく分け、正常系を1つ決める";

  if (profile === "fast") {
    return {
      title: "そのまま進める",
      summary: "影響は局所的です。実装後に必要な箇所だけ確認して、制作へ戻れます。",
      firstAction,
    };
  }

  if (profile === "balanced") {
    return {
      title: "確認しながら進める",
      summary: "ゲームの挙動に触れます。変更を小さく保ち、途中で動作を確かめながら進めます。",
      firstAction,
    };
  }

  return {
    title: "退避して慎重に進める",
    summary: "ゲーム状態や互換性に影響します。戻せる状態と再現手順を用意してから着手します。",
    firstAction,
  };
};

export const analyzeTask = (input: TaskInput): GearshiftRecommendation => {
  const text = `${input.description} ${input.projectContext ?? ""}`.normalize("NFKC").toLowerCase().trim();
  const matchedRules = signalRules.filter((rule) => rule.matches(text));

  if (matchedRules.length === 0) {
    matchedRules.push({
      id: "ordinary-feature",
      label: "Ordinary isolated feature",
      categories: ["Gameplay"],
      matches: () => true,
      impact: "Medium",
      risks: { implementationRisk: "Medium", gameStateRisk: "Medium", regressionRisk: "Medium" },
      verification: { automatedTestsRequired: true, playtestRequired: true },
      reason: "既知の強い危険信号はないが、通常のゲーム機能変更として扱う",
      steps: ["代表的な正常系と境界値をテストし、対象sceneをplaytestする"],
    });
  }

  const risks: RiskAssessment = {
    implementationRisk: "Low",
    gameStateRisk: "Low",
    saveCompatibilityRisk: "Low",
    regressionRisk: "Low",
  };
  const verification: VerificationRequirements = {
    automatedTestsRequired: false,
    playtestRequired: false,
    visualVerificationRequired: false,
    saveMigrationCheckRequired: false,
    exportCheckRequired: false,
    steps: [],
  };

  for (const rule of matchedRules) {
    risks.implementationRisk = maxRisk(risks.implementationRisk, rule.impact);
    for (const [key, value] of Object.entries(rule.risks ?? {})) {
      const riskKey = key as RiskKey;
      risks[riskKey] = maxRisk(risks[riskKey], value as RiskRating);
    }
    for (const [key, value] of Object.entries(rule.verification ?? {})) {
      verification[key as VerificationFlag] ||= Boolean(value);
    }
    verification.steps.push(...(rule.steps ?? []));
  }

  const categories = unique(matchedRules.flatMap((rule) => rule.categories));
  const forcedProfile = matchedRules.find((rule) => rule.forceProfile)?.forceProfile;
  const hasMediumRisk = (Object.values(risks) as RiskRating[]).some(
    (risk) => riskRank[risk] >= riskRank.Medium,
  );
  const recommendedProfile: ModelProfile = forcedProfile
    ?? (hasMediumRisk ? "balanced" : "fast");

  const matchedSignals: MatchedSignal[] = matchedRules.map(({ id, label }) => ({ id, label }));
  const confidence = Math.min(0.94, 0.54 + matchedRules.length * 0.08 + (forcedProfile ? 0.08 : 0));
  const uniqueSteps = unique(verification.steps);

  return {
    categories,
    risks,
    verification: { ...verification, steps: uniqueSteps },
    recommendedProfile,
    reasoningLevel: reasoningForProfile[recommendedProfile],
    guidance: guidanceFor(recommendedProfile, uniqueSteps),
    matchedSignals,
    reasons: unique(matchedRules.map((rule) => rule.reason)),
    confidence: Number(confidence.toFixed(2)),
    escalationConditions: escalationFor(recommendedProfile),
  };
};
