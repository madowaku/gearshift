import type {
  CreatorSignalId,
  CreatorSignalMatch,
  ModelProfile,
  RiskAssessment,
  TaskCategory,
  TaskInput,
  VerificationRequirements,
} from "./domain";

type VerificationImpact = Partial<Omit<VerificationRequirements, "steps">>;

export interface BeginnerSignalDefinition {
  id: CreatorSignalId;
  phrases: string[];
  phraseGroups: string[][];
  excludePhrases?: string[];
  relatedCategories: TaskCategory[];
  riskImpact: Partial<RiskAssessment>;
  profileImpact: ModelProfile;
  preferredBlockerIds: string[];
  matchedReason: string;
  verification: VerificationImpact;
  steps: string[];
}

const normalize = (value: string) => value.normalize("NFKC").toLowerCase();

const includesAny = (text: string, phrases: string[]) =>
  phrases.some((phrase) => text.includes(normalize(phrase)));

const matchesGroups = (text: string, groups: string[][]) =>
  groups.every((group) => includesAny(text, group));

const mediumGameplayRisk: Partial<RiskAssessment> = {
  implementationRisk: "Medium",
  gameStateRisk: "Medium",
  regressionRisk: "Medium",
};

const highStateRisk: Partial<RiskAssessment> = {
  implementationRisk: "High",
  gameStateRisk: "High",
  regressionRisk: "High",
};

export const beginnerSignals: BeginnerSignalDefinition[] = [
  {
    id: "unresponsive_input",
    phrases: ["ボタンを押しても何も起きない", "何も起きない", "反応がない", "反応しない"],
    phraseGroups: [["ボタン", "button"], ["何も起きない", "反応がない", "反応しない", "呼ばれない"]],
    relatedCategories: ["UI", "Input", "Gameplay"],
    riskImpact: mediumGameplayRisk,
    profileImpact: "balanced",
    preferredBlockerIds: ["signal-connection", "input-map-registration"],
    matchedReason: "入力を受け取るSignalまたはInput Mapがつながっていない可能性",
    verification: { automatedTestsRequired: true, playtestRequired: true },
    steps: ["発火元、接続状態、Input Mapのaction名を順に確認する"],
  },
  {
    id: "double_trigger",
    phrases: ["二回ずつ処理", "なんか二回", "二重発火", "二重接続", "二回呼ばれる", "2回呼ばれる"],
    phraseGroups: [["二回", "2回", "二重", "重複"], ["処理", "呼ば", "発火", "動作", "反応"]],
    relatedCategories: ["UI", "Input", "Gameplay"],
    riskImpact: mediumGameplayRisk,
    profileImpact: "balanced",
    preferredBlockerIds: ["signal-duplicate", "timer-async"],
    matchedReason: "同じ処理が複数回走る可能性",
    verification: { automatedTestsRequired: true, playtestRequired: true },
    steps: ["発火元、接続状態、受信回数を順に記録する"],
  },
  {
    id: "collision_pass_through",
    phrases: ["壁を抜ける", "壁をすり抜ける", "すり抜ける", "貫通する", "通り抜ける"],
    phraseGroups: [["壁", "地形", "障害物"], ["抜け", "すり抜け", "貫通", "通り抜け"]],
    relatedCategories: ["Physics", "Gameplay"],
    riskImpact: mediumGameplayRisk,
    profileImpact: "balanced",
    preferredBlockerIds: ["collision-layer-mask", "process-physics"],
    matchedReason: "衝突判定またはphysics tickの境界で通過が起きる可能性",
    verification: { automatedTestsRequired: true, playtestRequired: true, visualVerificationRequired: true },
    steps: ["Playerと壁の衝突設定を照合し、低速・高速・斜め方向で再現する"],
  },
  {
    id: "scene_state_lost",
    phrases: ["シーンを変えたら", "シーン切り替え後", "シーン遷移後", "コインが0になった", "スコアが0になった"],
    phraseGroups: [["シーン", "scene"], ["変えたら", "切り替え後", "遷移後", "移動後"], ["0になった", "消えた", "消える", "失われ", "リセット"]],
    relatedCategories: ["Scene", "Gameplay", "SaveLoad"],
    riskImpact: highStateRisk,
    profileImpact: "deep",
    preferredBlockerIds: ["scene-transition-state", "autoload-state"],
    matchedReason: "sceneの破棄時に保持すべきゲーム状態が失われる可能性",
    verification: { automatedTestsRequired: true, playtestRequired: true },
    steps: ["scene切り替え前後で残す値、破棄する値、状態の所有者を一覧にする"],
  },
  {
    id: "old_save_unreadable",
    phrases: ["前に遊んだデータ", "古いセーブ", "旧セーブ", "以前のデータ", "開けなくなった", "読み込めない"],
    phraseGroups: [["前に遊んだデータ", "古いセーブ", "旧セーブ", "以前のデータ", "既存データ"], ["開けなく", "開かない", "読めない", "読み込めない", "load failure"]],
    relatedCategories: ["SaveLoad"],
    riskImpact: { ...highStateRisk, saveCompatibilityRisk: "High" },
    profileImpact: "deep",
    preferredBlockerIds: ["save-compatibility"],
    matchedReason: "既存データの後方互換性またはmigration経路が壊れている可能性",
    verification: { automatedTestsRequired: true, playtestRequired: true, saveMigrationCheckRequired: true },
    steps: ["変更前のセーブを複製し、上書きせず旧データの読込経路を再現する"],
  },
  {
    id: "responsive_ui_shift",
    phrases: ["画面サイズを変える", "画面サイズで", "ボタンが変な場所", "解像度でずれる", "レイアウトが崩れる"],
    phraseGroups: [["画面サイズ", "解像度", "viewport"], ["変な場所", "ずれる", "崩れる", "レイアウト"]],
    relatedCategories: ["UI", "VisualPolish"],
    riskImpact: { implementationRisk: "Medium", regressionRisk: "Medium" },
    profileImpact: "balanced",
    preferredBlockerIds: ["ui-anchor-container"],
    matchedReason: "ControlのAnchor、Container、viewport設定が解像度でずれる可能性",
    verification: { playtestRequired: true, visualVerificationRequired: true },
    steps: ["小・標準・横長の3解像度でControl配置を比較する"],
  },
  {
    id: "delayed_turn_action",
    phrases: ["数ターン後", "ターン後", "数ターン", "次のターン", "地上へ竹を生やす"],
    phraseGroups: [["数ターン後", "ターン後", "数ターン", "次のターン", "ターン"], ["生や", "出現", "行動", "実行", "発生"]],
    relatedCategories: ["Gameplay", "Scene"],
    riskImpact: highStateRisk,
    profileImpact: "deep",
    preferredBlockerIds: ["timer-async", "autoload-state", "scene-transition-state"],
    matchedReason: "複数ターンをまたぐ状態と遅延処理の順序が影響する可能性",
    verification: { automatedTestsRequired: true, playtestRequired: true },
    steps: ["ターン数、状態の所有者、遅延callbackの発火条件を表にする"],
  },
  {
    id: "intermittent_spawn",
    phrases: ["たまに", "時々", "まれに", "ランダム", "猫が現れる", "出現する演出"],
    phraseGroups: [["たまに", "時々", "まれに", "ランダム"], ["現れる", "出る", "出現", "スポーン", "演出"]],
    relatedCategories: ["Gameplay", "VisualPolish"],
    riskImpact: mediumGameplayRisk,
    profileImpact: "balanced",
    preferredBlockerIds: ["timer-async", "signal-connection"],
    matchedReason: "低頻度の発火条件と非同期処理が再現性に影響する可能性",
    verification: { automatedTestsRequired: true, playtestRequired: true, visualVerificationRequired: true },
    steps: ["完了イベント、出現判定、Timerの開始条件をログで追えるようにする"],
  },
  {
    id: "display_only_change",
    phrases: ["表示だけ", "表示のみ", "見た目だけ", "文言だけ", "結果の表示", "3からTRIPLE"],
    phraseGroups: [["表示だけ", "表示のみ", "見た目だけ", "文言だけ", "結果の表示"], ["変えたい", "変更", "変える", "置き換え", "書き換え"]],
    excludePhrases: ["セーブ", "保存", "状態", "スコア", "入力", "physics", "衝突", "シーン", "ターン", "AI"],
    relatedCategories: ["UI", "VisualPolish"],
    riskImpact: { regressionRisk: "Low" },
    profileImpact: "fast",
    preferredBlockerIds: ["ui-anchor-container"],
    matchedReason: "内部値やゲームロジックを変えない局所的な表示変更",
    verification: { visualVerificationRequired: true },
    steps: ["対象画面で文字の折返し、欠け、表示崩れだけを目視確認する"],
  },
  {
    id: "exported_asset_missing",
    phrases: ["Androidでは画像が出ない", "Androidだけ画像が出ない", "画像が見えない", "画像が見つからない", "asset missing"],
    phraseGroups: [["android", "Android", "export"], ["画像", "asset", "リソース"], ["出ない", "見えない", "見つからない", "missing"]],
    relatedCategories: ["Export", "Tooling"],
    riskImpact: { implementationRisk: "Medium", regressionRisk: "Medium" },
    profileImpact: "balanced",
    preferredBlockerIds: ["resource-file-path"],
    matchedReason: "export packageにassetが含まれないか、実行時pathが一致しない可能性",
    verification: { automatedTestsRequired: true, exportCheckRequired: true },
    steps: ["画像のresource種別、res:// path、export filterを確認して実buildで再現する"],
  },
];

export const matchBeginnerSignals = (input: TaskInput): CreatorSignalMatch[] => {
  const text = normalize(`${input.description} ${input.projectContext ?? ""}`);

  return beginnerSignals
    .filter((signal) => !signal.excludePhrases?.some((phrase) => text.includes(normalize(phrase))))
    .filter((signal) => matchesGroups(text, signal.phraseGroups))
    .map((signal) => {
      const matchedPhrases = signal.phrases
        .filter((phrase) => text.includes(normalize(phrase)))
        .slice(0, 3);
      const phraseNote = matchedPhrases.length > 0 ? `（「${matchedPhrases.join("」「")}」）` : "";

      return {
        id: signal.id,
        phrases: signal.phrases,
        matchedPhrases,
        relatedCategories: signal.relatedCategories,
        riskImpact: signal.riskImpact,
        profileImpact: signal.profileImpact,
        preferredBlockerIds: signal.preferredBlockerIds,
        matchedReason: `${signal.matchedReason}${phraseNote}`,
        verification: signal.verification,
        steps: signal.steps,
      };
    });
};
