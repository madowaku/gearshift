import type { GearshiftRecommendation, TaskCategory, TaskInput } from "./domain";

export type BlockerDifficulty = "starter" | "careful" | "high-risk";

export interface GodotBlocker {
  id: string;
  title: string;
  summary: string;
  relatedCategories: TaskCategory[];
  matchedSignals: string[];
  difficulty: BlockerDifficulty;
  firstSteps: string[];
  commonPitfalls: string[];
  verificationSteps: string[];
  stopConditions: string[];
  safeCodexPrompt: string;
  relatedBlockerIds: string[];
  matchPhrases: string[];
}

export interface BlockerMatch {
  blocker: GodotBlocker;
  relevance: number;
  reasons: string[];
  safeCodexPrompt: string;
}

export const godotBlockers: GodotBlocker[] = [
  {
    id: "scene-node-roles",
    title: "SceneとNodeの役割",
    summary: "再利用する単位と、scene tree内で責務を持つNodeを先に分けます。",
    relatedCategories: ["Scene", "Gameplay"],
    matchedSignals: ["scene-structure"],
    difficulty: "starter",
    firstSteps: ["対象sceneを単独で起動し、root Nodeと子Nodeの役割を書き出す"],
    commonPitfalls: ["一時的なNodeへゲーム全体の状態を持たせる", "再利用したい処理をscene固有scriptへ詰め込む"],
    verificationSteps: ["scene単独起動と通常導線の両方で初期状態を確認する"],
    stopConditions: ["どのNodeが生成・破棄を担当するか説明できない"],
    safeCodexPrompt: "scene treeを先に読み、Nodeの責務を変えずに最小の実装案を提示してください。",
    relatedBlockerIds: ["node-path-breakage", "scene-transition-state"],
    matchPhrases: ["sceneとnode", "シーンとnode", "nodeの役割", "scene tree", "新しいシーン", "シーンを追加"],
  },
  {
    id: "node-path-breakage",
    title: "Node pathの破損",
    summary: "Node名や階層の変更で参照先が見つからなくなる問題を防ぎます。",
    relatedCategories: ["Scene", "UI", "Tooling"],
    matchedSignals: ["scene-structure"],
    difficulty: "careful",
    firstSteps: ["失敗しているNodePathと実行時scene treeを並べて確認する"],
    commonPitfalls: ["Nodeの移動・改名後も固定pathを使う", "sceneを単独起動したときだけ親階層が変わる"],
    verificationSteps: ["対象sceneを単独起動し、参照がnullにならないことを確認する"],
    stopConditions: ["参照先Nodeの生成時点が分からない", "広範囲なNode改名が必要になる"],
    safeCodexPrompt: "NodePathを推測せず、scene treeと参照元を確認してから局所的に修正してください。",
    relatedBlockerIds: ["scene-node-roles", "type-null-reference"],
    matchPhrases: ["node path", "nodepath", "nodeが見つからない", "get_node", "階層を変更", "nodeを移動", "nodeを改名"],
  },
  {
    id: "signal-connection",
    title: "Signalの未接続",
    summary: "発火元、接続箇所、受信methodの3点を順に確認します。",
    relatedCategories: ["UI", "Input", "Gameplay"],
    matchedSignals: ["input-gameplay", "signal-wiring"],
    difficulty: "starter",
    firstSteps: ["Signalがemitされる箇所と、接続される`_ready()`またはEditor接続を確認する"],
    commonPitfalls: ["受信method名を変更した後に接続が残る", "実行中のinstanceとは別のNodeへ接続している"],
    verificationSteps: ["接続状態を確認し、1回の操作で受信methodが1回呼ばれることを記録する"],
    stopConditions: ["Signalの発火元instanceを特定できない"],
    safeCodexPrompt: "Signalの発火元と接続方法を確認し、既存接続を壊さず最小修正してください。",
    relatedBlockerIds: ["signal-duplicate", "node-path-breakage"],
    matchPhrases: ["signal", "シグナル", "反応しない", "未接続", "connectされない", "ボタンを押しても反応しない"],
  },
  {
    id: "signal-duplicate",
    title: "Signalの二重接続・二重発火",
    summary: "同じCallableへの接続箇所と、入力eventの重複処理を切り分けます。",
    relatedCategories: ["UI", "Input", "Gameplay"],
    matchedSignals: ["input-gameplay", "signal-wiring"],
    difficulty: "careful",
    firstSteps: ["接続コードとEditor接続を検索し、発火回数を一時ログで数える"],
    commonPitfalls: ["Editor接続とcode接続を両方使う", "scene再生成のたびに同じ接続処理を行う", "button signalとInput eventの両方で遷移する"],
    verificationSteps: ["単発、長押し、連打で受信回数が意図どおりか確認する"],
    stopConditions: ["接続の所有者や解除時点が決まっていない"],
    safeCodexPrompt: "既存のSignal接続一覧と発火回数を確認し、重複原因を1つずつ切り分けてください。",
    relatedBlockerIds: ["signal-connection", "timer-async"],
    matchPhrases: ["signalが二回", "signalが2回", "二重発火", "二重接続", "二回呼ばれる", "2回呼ばれる", "連打で二重"],
  },
  {
    id: "input-map-registration",
    title: "Input Mapの未登録",
    summary: "action名、Project Settings、入力を読む場所が一致しているか確認します。",
    relatedCategories: ["Input", "Gameplay"],
    matchedSignals: ["input-gameplay"],
    difficulty: "starter",
    firstSteps: ["Project SettingsのInput Mapにaction名が存在するか確認する"],
    commonPitfalls: ["codeと設定でaction名の大文字小文字が違う", "一度だけ判定するmethodと押下中判定を混同する"],
    verificationSteps: ["keyboardと想定controllerで押下・長押し・離した瞬間を確認する"],
    stopConditions: ["どの入力deviceを対応範囲にするか決まっていない"],
    safeCodexPrompt: "Input Mapと既存action名を先に確認し、新しい入力設定を勝手に増やさないでください。",
    relatedBlockerIds: ["signal-connection", "process-physics"],
    matchPhrases: ["input map", "入力が反応しない", "入力が一度しか反応しない", "actionがない", "is_action", "ボタンを押しても"],
  },
  {
    id: "process-physics",
    title: "_processと_physics_process",
    summary: "描画更新と固定physics tickで行う処理を分けます。",
    relatedCategories: ["Physics", "Gameplay", "Input"],
    matchedSignals: ["physics-behavior", "input-gameplay"],
    difficulty: "careful",
    firstSteps: ["移動、衝突、見た目更新のどれを扱う処理か分類する"],
    commonPitfalls: ["衝突を伴う移動をframe更新だけで進める", "deltaを考慮せず端末ごとに速度が変わる"],
    verificationSteps: ["physics tickや描画FPSを変えて移動・衝突の差を確認する"],
    stopConditions: ["速度の単位と更新責務が混在している"],
    safeCodexPrompt: "既存の更新loopと移動APIを確認し、physics処理を一括置換せず責務ごとに提案してください。",
    relatedBlockerIds: ["collision-layer-mask", "timer-async"],
    matchPhrases: ["_process", "_physics_process", "physics process", "delta", "fpsで速度", "フレームで速度"],
  },
  {
    id: "ui-anchor-container",
    title: "UI AnchorとContainer",
    summary: "Controlの配置を固定座標ではなく親ContainerとAnchorの関係から確認します。",
    relatedCategories: ["UI", "VisualPolish"],
    matchedSignals: ["isolated-visual-style"],
    difficulty: "careful",
    firstSteps: ["崩れるControlの親がContainerか、Anchorとoffsetがどう設定されているか確認する"],
    commonPitfalls: ["Container配下の子をoffsetだけで動かす", "1つの解像度だけで固定座標を調整する"],
    verificationSteps: ["小・標準・横長の3解像度で重なり、欠け、操作領域を確認する"],
    stopConditions: ["基準にするviewportとstretch設定が決まっていない"],
    safeCodexPrompt: "既存のControl階層、Container、Anchor、stretch設定を確認してから最小調整してください。",
    relatedBlockerIds: ["node-path-breakage", "scene-node-roles"],
    matchPhrases: ["anchor", "container", "uiが画面サイズ", "画面サイズによって崩れる", "解像度で崩れる", "uiが崩れる"],
  },
  {
    id: "autoload-state",
    title: "Autoloadと状態管理",
    summary: "sceneをまたぐ状態だけを、寿命と初期化方法を決めて保持します。",
    relatedCategories: ["Gameplay", "SaveLoad", "Scene"],
    matchedSignals: ["cross-system-state", "state-transition-change", "scene-state-loss"],
    difficulty: "high-risk",
    firstSteps: ["sceneをまたいで残す値と、sceneごとに初期化する値を分ける"],
    commonPitfalls: ["すべてをglobalにして初期化漏れを起こす", "Autoloadを真のsingletonと思い込み複数instanceを見落とす"],
    verificationSteps: ["scene移動、ゲーム再開、new gameで状態の残り方を比較する"],
    stopConditions: ["状態の所有者とreset条件が決まっていない"],
    safeCodexPrompt: "既存の状態所有者を確認し、Autoload追加を前提にせず複数案と影響範囲を示してください。",
    relatedBlockerIds: ["scene-transition-state", "save-compatibility"],
    matchPhrases: ["autoload", "global状態", "状態を保持", "スコアが消える", "sceneをまたぐ状態", "シーンをまたぐ状態"],
  },
  {
    id: "scene-transition-state",
    title: "Scene切り替え時の状態消失",
    summary: "現在sceneの破棄で失われる値を、切り替え前に明示的に受け渡します。",
    relatedCategories: ["Scene", "Gameplay", "SaveLoad"],
    matchedSignals: ["state-transition-change", "cross-system-state", "intermittent-blocker", "scene-state-loss"],
    difficulty: "high-risk",
    firstSteps: ["scene切り替え前後で残す値と破棄する値を一覧にする"],
    commonPitfalls: ["切り替え元Nodeだけがscoreやinventoryを持つ", "Signal callback中にsceneを破棄して実行中codeを失う"],
    verificationSteps: ["遷移、戻る、連打、再開の各経路で状態を比較する"],
    stopConditions: ["状態を保存する場所とscene破棄の時点が決まっていない"],
    safeCodexPrompt: "scene切り替えAPI、状態所有者、Signal callbackを確認し、破棄前後の順序を明示してください。",
    relatedBlockerIds: ["autoload-state", "signal-duplicate"],
    matchPhrases: ["シーン切り替え後", "scene切り替え後", "scene遷移後", "スコアが消える", "状態が消える", "別シーンへ移動"],
  },
  {
    id: "save-compatibility",
    title: "Saveデータ互換性",
    summary: "旧schemaを残したfixtureでmigrationと読み書きの境界を確認します。",
    relatedCategories: ["SaveLoad", "Gameplay"],
    matchedSignals: ["save-schema-change", "save-read-compatibility"],
    difficulty: "high-risk",
    firstSteps: ["変更前のセーブを複製し、schema versionと必須fieldを記録する"],
    commonPitfalls: ["新fieldがない旧データを直接参照する", "型変更をmigrationなしで読み込む", "失敗時に元データを上書きする"],
    verificationSteps: ["旧save読込、新規save、保存後再起動、migration失敗時の4経路を確認する"],
    stopConditions: ["旧データの移行方法が決まっていない", "backupを作っていない"],
    safeCodexPrompt: "既存save fixtureとschemaを先に読み、backupを前提に後方互換なmigration案を提示してください。",
    relatedBlockerIds: ["autoload-state", "type-null-reference"],
    matchPhrases: ["古いセーブ", "旧セーブ", "セーブデータ形式", "save migration", "セーブ互換", "読み込めない"],
  },
  {
    id: "resource-file-path",
    title: "Resourceとファイルパス",
    summary: "`res://`、`user://`、ResourceLoader、export対象の違いを確認します。",
    relatedCategories: ["Scene", "Export", "Tooling"],
    matchedSignals: ["export-pipeline", "scene-structure", "exported-file-path"],
    difficulty: "careful",
    firstSteps: ["対象がGodot resourceか生fileか、実行時に読むpathを確認する"],
    commonPitfalls: ["OSの相対pathを使う", "import後resourceの元fileがexport先にもあると仮定する", "非resource拡張子をexport対象へ含めない"],
    verificationSteps: ["Editorと実export buildの両方でload結果を確認する"],
    stopConditions: ["対象fileがpackageへ含まれる条件を確認できていない"],
    safeCodexPrompt: "resource種別、res://またはuser://、export filterを確認し、絶対pathへ置換しないでください。",
    relatedBlockerIds: ["platform-export", "exported-build-only"],
    matchPhrases: ["ファイルが見つからない", "resource", "ファイルパス", "res://", "user://", "jsonが読めない", "画像が見つからない"],
  },
  {
    id: "platform-export",
    title: "Android / Web Export",
    summary: "export preset、template、署名、対象platform固有設定を分けて確認します。",
    relatedCategories: ["Export", "Tooling"],
    matchedSignals: ["export-pipeline", "exported-file-path"],
    difficulty: "high-risk",
    firstSteps: ["失敗するpreset、Godot version、最初のerror行を固定して記録する"],
    commonPitfalls: ["複数errorの最後だけを見る", "別presetの設定を修正する", "export templateや署名設定を未確認のままcodeを変える"],
    verificationSteps: ["同じpresetで再exportし、生成物を対象環境で起動する"],
    stopConditions: ["error全文と再現presetが保存されていない"],
    safeCodexPrompt: "export logの最初の原因とpresetを確認し、gameplay codeを先に変更しないでください。",
    relatedBlockerIds: ["resource-file-path", "exported-build-only"],
    matchPhrases: ["android", "web export", "webエクスポート", "エクスポート失敗", "export失敗", "署名工程"],
  },
  {
    id: "type-null-reference",
    title: "型の不一致とnull参照",
    summary: "値の生成時点、期待型、nullになりうる経路を先に確認します。",
    relatedCategories: ["Gameplay", "Tooling", "Scene"],
    matchedSignals: ["intermittent-blocker", "scene-structure"],
    difficulty: "careful",
    firstSteps: ["最初のerror stackと、nullまたは型違いになった変数の代入元を追う"],
    commonPitfalls: ["null checkだけで生成順序の問題を隠す", "期待型へ無理にcastする"],
    verificationSteps: ["正常instance、欠損instance、scene再生成の3経路を確認する"],
    stopConditions: ["値を作る責務と利用する責務が特定できない"],
    safeCodexPrompt: "最初のstack traceと代入経路を確認し、null checkだけで症状を隠さないでください。",
    relatedBlockerIds: ["node-path-breakage", "scene-node-roles"],
    matchPhrases: ["null", "nil", "型が違う", "型の不一致", "invalid get index", "cannot call", "参照エラー"],
  },
  {
    id: "timer-async",
    title: "Timerと非同期処理",
    summary: "待機中にsceneやNodeが破棄される経路と、多重開始を確認します。",
    relatedCategories: ["Gameplay", "AI", "Scene"],
    matchedSignals: ["state-transition-change", "intermittent-blocker"],
    difficulty: "careful",
    firstSteps: ["Timerの所有Node、開始箇所、timeout接続、scene破棄時点を確認する"],
    commonPitfalls: ["同じTimerを複数回開始する", "await中に対象Nodeが破棄される", "一時Timerの参照を失う"],
    verificationSteps: ["連打、scene遷移、pause、再開でcallback回数を確認する"],
    stopConditions: ["非同期処理のcancel条件が決まっていない"],
    safeCodexPrompt: "Timerの所有権とcancel条件を確認し、待機処理を増やす前に多重開始を切り分けてください。",
    relatedBlockerIds: ["signal-duplicate", "scene-transition-state"],
    matchPhrases: ["timer", "timeout", "await", "非同期", "遅延実行", "一定時間後", "一度しか呼ばれない"],
  },
  {
    id: "collision-layer-mask",
    title: "Collision Layer / Mask",
    summary: "物体が属するlayerと、検出するmaskを両側から確認します。",
    relatedCategories: ["Physics", "Gameplay"],
    matchedSignals: ["physics-behavior"],
    difficulty: "careful",
    firstSteps: ["Playerと壁のCollision Layer / Maskを表にして照合する"],
    commonPitfalls: ["片側のmaskだけを見る", "CollisionShapeがdisabledまたは空", "高速移動を位置の直接変更で行う"],
    verificationSteps: ["低速・高速・斜め方向で壁との衝突を確認する"],
    stopConditions: ["project内のlayer用途が共有されていない"],
    safeCodexPrompt: "両objectのLayer、Mask、CollisionShape、移動APIを確認し、数値を推測で変更しないでください。",
    relatedBlockerIds: ["process-physics", "type-null-reference"],
    matchPhrases: ["collision layer", "collision mask", "layer / mask", "壁をすり抜ける", "衝突しない", "当たり判定"],
  },
  {
    id: "exported-build-only",
    title: "ローカルでは動くが書き出し後に壊れる",
    summary: "Editorとexport buildの環境差、path、含まれるfileを比較します。",
    relatedCategories: ["Export", "Tooling", "Scene"],
    matchedSignals: ["export-pipeline", "exported-file-path"],
    difficulty: "high-risk",
    firstSteps: ["Editor成功時とexport失敗時のplatform、path、最初のerrorを並べる"],
    commonPitfalls: ["大文字小文字の違いを見落とす", "非resource fileが自動で含まれると思う", "Editor専用pathや設定へ依存する"],
    verificationSteps: ["clean exportを作り、対象端末で起動から問題箇所まで再現する"],
    stopConditions: ["対象platformでの再現手順とlogがない"],
    safeCodexPrompt: "Editorとexport buildの差分を先に列挙し、platform固有の証拠なしに広範囲なcode変更をしないでください。",
    relatedBlockerIds: ["resource-file-path", "platform-export"],
    matchPhrases: ["ローカルでは動く", "editorでは動く", "書き出し後", "export後", "androidだけ", "webだけ"],
  },
];

const normalize = (value: string) => value.normalize("NFKC").toLowerCase();

const buildSafeCodexPrompt = (
  blocker: GodotBlocker,
  input: TaskInput,
  analysis: GearshiftRecommendation,
) => {
  const firstSteps = blocker.firstSteps.map((step) => `- ${step}`).join("\n");
  const verification = blocker.verificationSteps.map((step) => `- ${step}`).join("\n");

  return `Godot 4.xプロジェクトで、次の制作タスクを安全に進めてください。

## 目的
${input.description}

## 現在わかっている状態
- 関連カテゴリ: ${analysis.categories.join(", ")}
- 注意するBlocker: ${blocker.title}
- ${blocker.summary}

## 変更してよい範囲
- この問題に直接関係するscene、Node、script、Project Settingsだけを対象にする
- 既存の構造と接続方法を最初に確認してから変更案を出す
- ${blocker.safeCodexPrompt}

## 最初に行う確認
${firstSteps}

## 実装後に必要な検証
${verification}

## 安全境界
- 不明な点は明記し、推測で破壊的変更をしない
- GitHubへのpush、fileの削除、大規模なrefactorは行わない
- 変更範囲が広がる場合は実装を止め、理由と分割案を報告する`;
};

export const selectBlockers = (
  input: TaskInput,
  analysis: GearshiftRecommendation,
  limit = 3,
): BlockerMatch[] => {
  const text = normalize(`${input.description} ${input.projectContext ?? ""}`);
  const analysisSignals = new Set(analysis.matchedSignals.map((signal) => signal.id));
  const analysisCategories = new Set(analysis.categories);

  return godotBlockers
    .map((blocker, index) => {
      const phraseMatches = blocker.matchPhrases.filter((phrase) => text.includes(normalize(phrase)));
      const signalMatches = blocker.matchedSignals.filter((signal) => analysisSignals.has(signal));
      const categoryMatches = blocker.relatedCategories.filter((category) => analysisCategories.has(category));
      const score = Math.min(100, phraseMatches.length * 30 + signalMatches.length * 14 + categoryMatches.length * 5);
      const reasons = [
        ...phraseMatches.slice(0, 1).map((phrase) => `タスク文の「${phrase}」に一致`),
        ...signalMatches.slice(0, 1).map((signal) => `分析信号「${signal}」に関連`),
        ...categoryMatches.slice(0, 1).map((category) => `${category}カテゴリに関連`),
      ];

      return { blocker, score, reasons, index, hasStrongMatch: phraseMatches.length > 0 || signalMatches.length > 0 };
    })
    .filter((candidate) => candidate.hasStrongMatch && candidate.score >= 14)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, Math.max(0, Math.min(3, limit)))
    .map(({ blocker, score, reasons }) => ({
      blocker,
      relevance: score,
      reasons,
      safeCodexPrompt: buildSafeCodexPrompt(blocker, input, analysis),
    }));
};
