import type { GodotBlocker } from "./blockers";
import type {
  GearshiftRecommendation,
  MatchedSignal,
  TaskCategory,
  WorkflowGuidance,
} from "./domain";

interface FixtureDisplayCopy {
  label: string;
  description: string;
}

export interface BlockerDisplayCopy {
  title: string;
  summary: string;
  firstSteps: string[];
  commonPitfalls: string[];
  verificationSteps: string[];
  stopConditions: string[];
  safeCodexPrompt: string;
}

export const fixtureDisplayCopy: Record<string, FixtureDisplayCopy> = {
  "ui-copy": {
    label: "Change button text",
    description: "Change the menu button label from Start to Continue.",
  },
  "audio-add": {
    label: "Add a new sound effect",
    description: "Add a new sound effect when the chest opens.",
  },
  "ui-color": {
    label: "Change a warning color",
    description: "Change the warning label color in the settings screen.",
  },
  "bamboo-animation": {
    label: "Add a bamboo growth animation",
    description: "Add a three-stage growth animation for the bamboo.",
  },
  "scene-addition": {
    label: "Add a result scene",
    description: "Add a new scene shown after the stage ends.",
  },
  "dash-input": {
    label: "Add player dashing",
    description: "Add dash input and a cooldown for the player.",
  },
  "physics-collision": {
    label: "Fix slope collision",
    description: "Fix the collision behavior that lets fast movement pass through slopes.",
  },
  "performance-profile": {
    label: "Investigate slowdowns with many enemies",
    description: "Investigate why a scene with 100 enemies stutters using the profiler.",
  },
  "android-export": {
    label: "Fix an Android export failure",
    description: "Fix the Android export failure during the signing step.",
  },
  "turn-progression": {
    label: "Change turn progression",
    description: "Change turn progression with queued actions and interruptions.",
  },
  "save-migration": {
    label: "Change the save data format",
    description: "Migrate the save data format to v2 while keeping existing players working.",
  },
  "cross-layer-win": {
    label: "Fix a cross-layer win condition",
    description: "Fix a win-condition bug that spans the underground and surface layers.",
  },
  "intermittent-softlock": {
    label: "Investigate a rare softlock",
    description: "Investigate a rare, hard-to-reproduce softlock after a scene transition.",
  },
  "signal-twice": {
    label: "A signal fires twice",
    description: "The button signal fires twice when the screen is reopened.",
  },
  "button-no-response": {
    label: "A button does not respond",
    description: "The button on the game screen does not respond when pressed.",
  },
  "score-lost-on-scene-change": {
    label: "Score disappears after a scene change",
    description: "The player's score disappears after changing scenes.",
  },
  "legacy-save-load": {
    label: "An old save cannot be loaded",
    description: "An old save cannot be loaded after an update.",
  },
  "responsive-ui-break": {
    label: "UI breaks at different screen sizes",
    description: "The UI breaks at different screen sizes; check the anchors and containers.",
  },
  "android-file-missing": {
    label: "A file is missing only on Android",
    description: "The game works in the editor, but Android cannot find the JSON file.",
  },
  "wall-tunneling": {
    label: "A character passes through walls",
    description: "The character passes through walls when moving quickly.",
  },
  "input-once": {
    label: "Input responds only once",
    description: "An action added to the Input Map responds only once.",
  },
  "beginner-button-no-response": {
    label: "The button does nothing",
    description: "The button does nothing when I press it.",
  },
  "beginner-double-trigger": {
    label: "Something runs twice",
    description: "It feels like the same thing runs twice every time.",
  },
  "beginner-collision-pass-through": {
    label: "The character sometimes passes through a wall",
    description: "The character sometimes passes through a wall.",
  },
  "beginner-scene-state-lost": {
    label: "Coins disappear after changing scenes",
    description: "The coin count resets to zero after changing scenes.",
  },
  "beginner-old-save-unreadable": {
    label: "A previous save cannot be opened",
    description: "A save from an earlier play session can no longer be opened.",
  },
  "beginner-exported-asset-missing": {
    label: "An Android image is missing",
    description: "The image works on PC but does not appear on Android.",
  },
  "beginner-responsive-ui-shift": {
    label: "A button moves when the screen size changes",
    description: "The button moves to the wrong position when the screen size changes.",
  },
  "beginner-delayed-turn-action": {
    label: "Grow bamboo after several turns",
    description: "After bamboo grows underground, grow bamboo above ground several turns later.",
  },
  "beginner-intermittent-spawn": {
    label: "Sometimes show a cat after cleaning a window",
    description: "After the window is cleaned, sometimes show a cat appearing as a small event.",
  },
  "beginner-display-only-change": {
    label: "Change only the dice result label",
    description: "Change only the dice result label from \"3\" to \"TRIPLE\".",
  },
};

const blockerDisplayCopy: Record<string, BlockerDisplayCopy> = {
  "scene-node-roles": {
    title: "Scene and Node responsibilities",
    summary: "Separate reusable units from the Nodes that own responsibilities in the scene tree.",
    firstSteps: ["Run the target scene on its own and write down the roles of the root Node and its children."],
    commonPitfalls: ["Putting the whole game state on a temporary Node.", "Packing reusable behavior into a scene-specific script."],
    verificationSteps: ["Check the initial state both when the scene runs alone and through the normal game flow."],
    stopConditions: ["You cannot explain which Node creates and destroys each object."],
    safeCodexPrompt: "Read the scene tree first and propose the smallest implementation that preserves Node responsibilities.",
  },
  "node-path-breakage": {
    title: "Broken Node paths",
    summary: "Prevent renamed or moved Nodes from making references point to nowhere.",
    firstSteps: ["Compare the failing NodePath with the scene tree that exists at runtime."],
    commonPitfalls: ["Keeping a fixed path after moving or renaming a Node.", "Relying on a parent hierarchy that exists only when the scene is run alone."],
    verificationSteps: ["Run the target scene alone and confirm that the reference never becomes null."],
    stopConditions: ["You do not know when the referenced Node is created.", "A broad Node rename would be required."],
    safeCodexPrompt: "Do not guess the NodePath. Inspect the scene tree and the caller, then make a local fix.",
  },
  "signal-connection": {
    title: "Missing signal connection",
    summary: "Check the emitter, connection point, and receiving method in that order.",
    firstSteps: ["Find where the signal is emitted and confirm the `_ready()` or editor connection."],
    commonPitfalls: ["Leaving an old connection after renaming the receiving method.", "Connecting to a different Node than the instance that is running."],
    verificationSteps: ["Confirm the connection and record that one action calls the receiving method once."],
    stopConditions: ["You cannot identify the instance that emits the signal."],
    safeCodexPrompt: "Confirm the signal emitter and connection method, then make the smallest fix without breaking existing connections.",
  },
  "signal-duplicate": {
    title: "Duplicate signal connection or firing",
    summary: "Separate duplicate connections from duplicate input-event handling.",
    firstSteps: ["Search code and editor connections, then temporarily count how many times the signal fires."],
    commonPitfalls: ["Using both an editor connection and a code connection.", "Connecting again every time a scene is recreated.", "Transitioning from both a button signal and an input event."],
    verificationSteps: ["Check the receive count for a single press, a long press, and repeated presses."],
    stopConditions: ["The owner of the connection or the time it should be removed is not decided."],
    safeCodexPrompt: "Inspect the existing signal connections and firing count, then isolate one duplicate cause at a time.",
  },
  "input-map-registration": {
    title: "Missing Input Map action",
    summary: "Make sure the action name, Project Settings, and input-reading code agree.",
    firstSteps: ["Confirm that the action name exists in Project Settings > Input Map."],
    commonPitfalls: ["Using different capitalization in code and settings.", "Confusing a one-shot check with a check that runs while a key is held."],
    verificationSteps: ["Test press, hold, and release with the keyboard and the intended controller."],
    stopConditions: ["The supported input devices are not defined."],
    safeCodexPrompt: "Check the Input Map and existing action names first. Do not add new input settings without evidence.",
  },
  "process-physics": {
    title: "`_process` versus `_physics_process`",
    summary: "Separate drawing updates from work that belongs on the fixed physics tick.",
    firstSteps: ["Classify each piece of code as movement, collision, or visual updating."],
    commonPitfalls: ["Moving collision bodies only from frame updates.", "Ignoring delta and getting different speeds on different devices."],
    verificationSteps: ["Vary the physics tick and render FPS, then compare movement and collision behavior."],
    stopConditions: ["Speed units and update responsibilities are mixed together."],
    safeCodexPrompt: "Inspect the existing update loop and movement API. Propose changes by responsibility instead of replacing all physics code.",
  },
  "ui-anchor-container": {
    title: "UI anchors and containers",
    summary: "Check Control placement through its parent container and anchors instead of fixed coordinates alone.",
    firstSteps: ["Check whether the broken Control is under a Container and how its anchors and offsets are set."],
    commonPitfalls: ["Moving a child under a Container with offsets only.", "Tuning fixed coordinates against one resolution."],
    verificationSteps: ["Check overlap, clipping, and the touch area at small, standard, and wide resolutions."],
    stopConditions: ["The target viewport and stretch settings are not decided."],
    safeCodexPrompt: "Inspect the existing Control hierarchy, Container, anchors, and stretch settings before making the smallest adjustment.",
  },
  "autoload-state": {
    title: "Autoload and state ownership",
    summary: "Keep only cross-scene state alive, with an explicit lifetime and initialization rule.",
    firstSteps: ["Separate values that survive a scene change from values that reset for each scene."],
    commonPitfalls: ["Making everything global and forgetting to initialize it.", "Assuming an Autoload is a true singleton and missing duplicate instances."],
    verificationSteps: ["Compare state after scene movement, game resume, and starting a new game."],
    stopConditions: ["The state owner and reset condition are not decided."],
    safeCodexPrompt: "Inspect the current state owner. Do not assume an Autoload is required; show options and their impact.",
  },
  "scene-transition-state": {
    title: "State loss during scene changes",
    summary: "Explicitly pass values forward before the current scene is destroyed.",
    firstSteps: ["List what must survive and what may be discarded before and after the scene change."],
    commonPitfalls: ["Keeping score or inventory only on the scene being left.", "Destroying a scene inside a signal callback and losing code that is still running."],
    verificationSteps: ["Compare state after moving, going back, repeated transitions, and resuming."],
    stopConditions: ["The state storage location and scene-destruction timing are not decided."],
    safeCodexPrompt: "Inspect the scene-change API, state owner, and signal callback. Make the order before and after destruction explicit.",
  },
  "save-compatibility": {
    title: "Save data compatibility",
    summary: "Use an old-schema fixture to verify migration and the boundaries of reading and writing.",
    firstSteps: ["Duplicate a pre-change save and record its schema version and required fields."],
    commonPitfalls: ["Reading a missing field from an old save directly.", "Changing a type without a migration.", "Overwriting the original data after a failed migration."],
    verificationSteps: ["Check old-save loading, a new save, restart after saving, and migration failure."],
    stopConditions: ["The old-data migration path is not decided.", "A backup has not been created."],
    safeCodexPrompt: "Read the existing save fixture and schema first. Propose a backward-compatible migration that starts from a backup.",
  },
  "resource-file-path": {
    title: "Resources and file paths",
    summary: "Distinguish `res://`, `user://`, ResourceLoader, and which files are included in an export.",
    firstSteps: ["Confirm whether the target is a Godot resource or a raw file, and which path is read at runtime."],
    commonPitfalls: ["Using an operating-system relative path.", "Assuming the source file of an imported resource is also in the export.", "Forgetting to include a non-resource extension in the export."],
    verificationSteps: ["Check the load result in both the editor and a real exported build."],
    stopConditions: ["You cannot explain why the file is included in the package."],
    safeCodexPrompt: "Confirm the resource type, `res://` or `user://`, and export filter. Do not replace the path with an absolute path.",
  },
  "platform-export": {
    title: "Android or Web export",
    summary: "Check the export preset, templates, signing, and platform-specific settings separately.",
    firstSteps: ["Record the failing preset, Godot version, and the first error line."],
    commonPitfalls: ["Looking only at the last of several errors.", "Changing a different preset's settings.", "Changing code before checking export templates or signing settings."],
    verificationSteps: ["Export again with the same preset and launch the result in the target environment."],
    stopConditions: ["The full error and reproduction preset are not saved."],
    safeCodexPrompt: "Identify the first cause in the export log and the preset. Do not change gameplay code first.",
  },
  "type-null-reference": {
    title: "Type mismatch or null reference",
    summary: "Trace when the value is created, what type is expected, and which paths can produce null.",
    firstSteps: ["Follow the first error stack and the assignment that produced the null or wrong type."],
    commonPitfalls: ["Hiding an initialization-order problem behind a null check.", "Forcing a cast to the expected type."],
    verificationSteps: ["Check a normal instance, a missing instance, and a recreated scene."],
    stopConditions: ["The responsibility for creating and using the value is unclear."],
    safeCodexPrompt: "Inspect the first stack trace and assignment path. Do not hide the symptom with a null check alone.",
  },
  "timer-async": {
    title: "Timer and asynchronous work",
    summary: "Check how a scene or Node can be destroyed while work is waiting, and whether it starts more than once.",
    firstSteps: ["Inspect the Timer owner, start points, timeout connection, and scene-destruction timing."],
    commonPitfalls: ["Starting the same Timer multiple times.", "Destroying the target Node during `await`.", "Losing the reference to a temporary Timer."],
    verificationSteps: ["Check callback counts during repeated input, scene changes, pause, and resume."],
    stopConditions: ["The cancellation rule for asynchronous work is not decided."],
    safeCodexPrompt: "Confirm Timer ownership and cancellation rules. Isolate duplicate starts before adding more waiting logic.",
  },
  "collision-layer-mask": {
    title: "Collision layer and mask",
    summary: "Check both the layer an object belongs to and the mask that detects it.",
    firstSteps: ["Make a table of the Player and wall collision layers and masks, then compare both sides."],
    commonPitfalls: ["Checking only one object's mask.", "Leaving CollisionShape disabled or empty.", "Moving quickly by changing position directly."],
    verificationSteps: ["Check wall collision at low speed, high speed, and diagonal movement."],
    stopConditions: ["The project's layer meanings are not shared or documented."],
    safeCodexPrompt: "Inspect both objects' layers, masks, CollisionShape, and movement API. Do not change numbers by guesswork.",
  },
  "exported-build-only": {
    title: "Works locally but breaks after export",
    summary: "Compare the editor and exported build environments, paths, and included files.",
    firstSteps: ["Compare the platform, path, and first error from the successful editor run and failed export."],
    commonPitfalls: ["Missing a case difference in a path.", "Assuming non-resource files are included automatically.", "Depending on editor-only paths or settings."],
    verificationSteps: ["Create a clean export and reproduce the issue from launch to the failing step on the target device."],
    stopConditions: ["There is no target-platform reproduction procedure or log."],
    safeCodexPrompt: "List editor/export differences first. Do not make a broad code change without platform-specific evidence.",
  },
};

const categoryLabels: Record<TaskCategory, string> = {
  Gameplay: "Gameplay",
  UI: "UI",
  Scene: "Scene",
  SaveLoad: "Save & load",
  Input: "Input",
  Physics: "Physics",
  Audio: "Audio",
  AI: "AI",
  Performance: "Performance",
  Export: "Export",
  VisualPolish: "Visual polish",
  Tooling: "Tooling",
};

const signalLabels: Record<string, string> = {
  "save-schema-change": "Persistent save schema change",
  "cross-system-state": "Cross-system game state",
  "state-transition-change": "Core state transition",
  "intermittent-blocker": "Intermittent progression blocker",
  "signal-wiring": "Signal wiring or input callback",
  "scene-state-loss": "State lost across scene transition",
  "save-read-compatibility": "Legacy save load failure",
  "responsive-ui-layout": "Responsive Control layout",
  "exported-file-path": "Exported file path mismatch",
  "export-pipeline": "Platform export pipeline",
  "physics-behavior": "Physics behavior",
  "input-gameplay": "Player input behavior",
  "ai-behavior": "AI behavior",
  "performance-investigation": "Performance investigation",
  "scene-structure": "Scene structure change",
  "visual-motion": "Visual motion change",
  "isolated-ui-copy": "Isolated UI copy",
  "isolated-visual-style": "Isolated visual style",
  "isolated-audio": "Isolated audio asset",
  "tooling-change": "Developer tooling",
  "ordinary-feature": "Ordinary isolated feature",
  unresponsive_input: "The input signal or Input Map may not be connected",
  double_trigger: "The same action may be running more than once",
  collision_pass_through: "A collision or physics-tick boundary may allow the pass-through",
  scene_state_lost: "Game state may be lost when the scene is destroyed",
  old_save_unreadable: "Existing save compatibility or migration may be broken",
  responsive_ui_shift: "Control anchors, containers, or viewport settings may shift at another resolution",
  delayed_turn_action: "Multi-turn state and delayed work may run in the wrong order",
  intermittent_spawn: "A low-frequency trigger or asynchronous event may be hard to reproduce",
  display_only_change: "A local display change does not alter internal values or game logic",
  exported_asset_missing: "The asset may be missing from the export or loaded from the wrong runtime path",
};

const textCopy: Record<string, string> = {
  "永続データの構造が変わり、既存セーブの互換性を壊す可能性がある": "Changing persistent data structure may break compatibility with existing saves.",
  "既存セーブを複製し、旧形式からの移行をテストする": "Duplicate an existing save and test migration from the old format.",
  "新規保存→読込のround tripと欠損フィールドをテストする": "Test a new save/load round trip and missing fields.",
  "複数のゲーム状態を横断する判定は、局所修正でも失敗範囲が広い": "A decision spanning multiple game states can fail across a wide area, even after a local change.",
  "各状態の組み合わせと境界ターンで勝敗判定を再生する": "Replay the win condition across state combinations and boundary turns.",
  "中核の状態遷移を変更し、複数のゲーム進行経路へ波及する": "Changing a core state transition can affect several gameplay paths.",
  "正常系・中断・再開を含む状態遷移表をテストする": "Test a state-transition table covering the normal path, interruption, and resume.",
  "再現条件が不明な進行不能は観測点と複数仮説を必要とする": "A softlock with unknown reproduction conditions needs observation points and multiple hypotheses.",
  "状態・入力・scene遷移を記録する再現ログを追加する": "Add a reproduction log for state, input, and scene transitions.",
  "修正前の再現手順で反復playtestする": "Repeat the playtest using the pre-fix reproduction steps.",
  "入力event、Signal接続、受信callbackのどこで止まるかを切り分ける必要がある": "Find whether the failure is in the input event, signal connection, or receiving callback.",
  "発火元、接続状態、受信回数を順に記録する": "Record the emitter, connection state, and receive count in that order.",
  "発火元、接続状態、Input Mapのaction名を順に確認する": "Check the emitter, connection state, and Input Map action name in that order.",
  "sceneの破棄と同時に、保持すべきゲーム状態が失われている可能性がある": "Game state that should survive may be lost when the scene is destroyed.",
  "scene切り替え前後で保持する値と所有Nodeを記録する": "Record the values that survive and their owning Nodes before and after the scene change.",
  "既存saveの後方互換性またはmigration経路が壊れている可能性がある": "Backward compatibility or the migration path for existing saves may be broken.",
  "失敗する旧saveを複製し、上書きせず読込経路を再現する": "Duplicate the failing old save and reproduce the load path without overwriting it.",
  "変更前のセーブを複製し、上書きせず旧データの読込経路を再現する": "Duplicate a pre-change save and reproduce the old-data load path without overwriting it.",
  "ControlのAnchor、Container、viewport設定を複数解像度で確認する必要がある": "Check Control anchors, containers, and viewport settings at multiple resolutions.",
  "小・標準・横長の3解像度でControl配置を比較する": "Compare Control placement at small, standard, and wide resolutions.",
  "Playerと壁の衝突設定を照合し、低速・高速・斜め方向で再現する": "Compare the Player and wall collision settings, then reproduce at low speed, high speed, and diagonally.",
  "Editorとexport packageでfileのpathまたは含有条件が異なる可能性がある": "The editor and export package may use a different file path or inclusion rule.",
  "resource種別、使用path、export filterを確認して実buildで再現する": "Check the resource type, runtime path, and export filter, then reproduce it in a real build.",
  "Editor内の動作だけでは対象プラットフォームの成功を確認できない": "An editor run alone cannot confirm success on the target platform.",
  "対象presetで実exportし、生成物を端末または同等環境で起動する": "Export with the target preset and launch the result on the device or an equivalent environment.",
  "物理挙動はframe rateや境界条件で結果が変わりやすい": "Physics behavior can change with frame rate and boundary conditions.",
  "固定physics tickと衝突境界で挙動を確認する": "Check behavior on the fixed physics tick and at collision boundaries.",
  "入力とゲーム状態の組み合わせは操作感と状態境界の両方に影響する": "The combination of input and game state affects both feel and state boundaries.",
  "単発・長押し・同時入力と状態境界をplaytestする": "Playtest single presses, holds, simultaneous input, and state boundaries.",
  "AI挙動は環境と状態の組み合わせによる回帰が起きやすい": "AI behavior is prone to regressions caused by environment and state combinations.",
  "代表sceneと障害物配置でAIの決定を反復確認する": "Repeat checks of AI decisions in representative scenes and obstacle layouts.",
  "性能問題は推測ではなく同一条件での計測比較が必要になる": "Performance issues need measurements under the same conditions, not guesses.",
  "代表sceneをprofilerで計測し、変更前後のframe timeを比較する": "Profile a representative scene and compare frame time before and after the change.",
  "scene追加は接続、初期化、表示の確認を必要とする通常機能変更である": "Adding a scene is a normal feature change that still needs connection, initialization, and display checks.",
  "scene遷移、初期状態、戻り経路を実行確認する": "Run through scene transitions, the initial state, and the return path.",
  "時間を伴う視覚変更は静的テストだけでは品質を確認できない": "A visual change over time cannot be verified with static tests alone.",
  "開始・loop・終了状態を実画面で確認する": "Check the start, loop, and end states on screen.",
  "局所的な表示文言の変更で、ゲーム状態への影響がない": "This is a local display-text change with no game-state impact.",
  "対象画面で折返し、欠け、翻訳キーを目視確認する": "Visually check wrapping, clipping, and the translation key on the target screen.",
  "状態やデータへ触れない局所的な見た目の変更である": "This is a local visual change that does not touch state or data.",
  "代表解像度で対象画面を比較する": "Compare the target screen at representative resolutions.",
  "単一の音声asset変更で、状態ロジックへの影響が限定される": "A single audio asset change has limited impact on state logic.",
  "発火タイミング、音量、重複再生を実機で確認する": "Check trigger timing, volume, and duplicate playback in the running game.",
  "制作パイプラインの変更は複数assetや開発環境へ波及しうる": "A production-pipeline change can affect multiple assets and the development environment.",
  "空projectと代表projectの両方でtooling flowを実行する": "Run the tooling flow in both an empty project and a representative project.",
  "ターン数、状態の所有者、遅延callbackの発火条件を表にする": "Make a table of the turn count, state owner, and delayed-callback trigger.",
  "完了イベント、出現判定、Timerの開始条件をログで追えるようにする": "Add logs so you can trace the completion event, spawn check, and Timer start condition.",
  "scene切り替え前後で残す値、破棄する値、状態の所有者を一覧にする": "List the values that survive, the values that reset, and their owner before and after the scene change.",
  "画像のresource種別、res:// path、export filterを確認して実buildで再現する": "Check the image resource type, res:// path, and export filter, then reproduce it in a real build.",
  "対象画面で文字の折返し、欠け、表示崩れだけを目視確認する": "Visually check only text wrapping, clipping, and layout breakage on the target screen.",
  "既知の強い危険信号はないが、通常のゲーム機能変更として扱う": "No strong known risk signal was found; treat this as a normal gameplay change.",
  "代表的な正常系と境界値をテストし、対象sceneをplaytestする": "Test a representative happy path and boundary values, then playtest the target scene.",
  "入力を受け取るSignalまたはInput Mapがつながっていない可能性": "The input signal or Input Map may not be connected.",
  "同じ処理が複数回走る可能性": "The same action may be running more than once.",
  "衝突判定またはphysics tickの境界で通過が起きる可能性": "A collision or physics-tick boundary may allow the pass-through.",
  "sceneの破棄時に保持すべきゲーム状態が失われる可能性": "Game state may be lost when the scene is destroyed.",
  "既存データの後方互換性またはmigration経路が壊れている可能性": "Existing save compatibility or migration may be broken.",
  "ControlのAnchor、Container、viewport設定が解像度でずれる可能性": "Control anchors, containers, or viewport settings may shift at another resolution.",
  "複数ターンをまたぐ状態と遅延処理の順序が影響する可能性": "Multi-turn state and delayed work may run in the wrong order.",
  "低頻度の発火条件と非同期処理が再現性に影響する可能性": "A low-frequency trigger and asynchronous work may make the issue hard to reproduce.",
  "内部値やゲームロジックを変えない局所的な表示変更": "A local display change that does not alter internal values or game logic.",
  "export packageにassetが含まれないか、実行時pathが一致しない可能性": "The asset may be missing from the export or loaded from the wrong runtime path.",
  "変更が複数sceneまたは複数systemへ広がったら、作業を小さく分けて再分析する": "If the change spreads across scenes or systems, split it into smaller tasks and re-analyze.",
  "ゲーム状態や入力処理へ触れる場合は、実装前に正常系と戻し方を決める": "If the change touches game state or input, decide the happy path and rollback before implementation.",
  "既存セーブ互換性へ触れる場合は、セーブを退避して互換性確認を追加する": "If the change touches save compatibility, back up the saves and add a compatibility check.",
  "セーブ形式・migrationを含む場合は、既存セーブを退避して移行検証を追加する": "If the task includes save format or migration, back up existing saves and add migration checks.",
  "状態遷移や勝敗判定を複数systemで共有する場合は、組み合わせ表を先に作る": "If state transitions or win conditions span systems, make a combination table first.",
  "再現条件が不明な進行不能が見つかった場合は、観測ログを先に追加する": "If you find a softlock with unknown reproduction conditions, add observation logs first.",
  "影響する状態と再現手順が確定できない場合は実装前に観測点を追加する": "If the affected state and reproduction steps are unclear, add observation points before implementation.",
  "既存セーブの退避やrollback手段がない場合は変更を開始しない": "Do not start until existing saves are backed up and a rollback path exists.",
  "一度に検証できない範囲ならタスクを分割して再分析する": "If the scope cannot be verified at once, split the task and re-analyze it.",
  "変更対象を小さく分け、正常系を1つ決める": "Keep the change small and define one happy path.",
};

const guidanceCopy: Record<string, WorkflowGuidance> = {
  "そのまま進める": {
    title: "Proceed directly",
    summary: "The impact is local. Check only the affected areas after implementation, then continue creating.",
    firstAction: "",
  },
  "確認しながら進める": {
    title: "Proceed with checks",
    summary: "This touches game behavior. Keep the change small and verify it as you go.",
    firstAction: "",
  },
  "退避して慎重に進める": {
    title: "Create a restore point and proceed carefully",
    summary: "This can affect game state or compatibility. Prepare a reversible state and reproduction steps first.",
    firstAction: "",
  },
};

const creatorReasonPrefixes: Record<string, string> = {
  "入力を受け取るSignalまたはInput Mapがつながっていない可能性": "The input signal or Input Map may not be connected.",
  "同じ処理が複数回走る可能性": "The same action may be running more than once.",
  "衝突判定またはphysics tickの境界で通過が起きる可能性": "A collision or physics-tick boundary may allow the pass-through.",
  "sceneの破棄時に保持すべきゲーム状態が失われる可能性": "Game state may be lost when the scene is destroyed.",
  "既存データの後方互換性またはmigration経路が壊れている可能性": "Existing save compatibility or migration may be broken.",
  "ControlのAnchor、Container、viewport設定が解像度でずれる可能性": "Control anchors, containers, or viewport settings may shift at another resolution.",
  "複数ターンをまたぐ状態と遅延処理の順序が影響する可能性": "Multi-turn state and delayed work may run in the wrong order.",
  "低頻度の発火条件と非同期処理が再現性に影響する可能性": "A low-frequency trigger and asynchronous work may make the issue hard to reproduce.",
  "内部値やゲームロジックを変えない局所的な表示変更": "A local display change that does not alter internal values or game logic.",
  "export packageにassetが含まれないか、実行時pathが一致しない可能性": "The asset may be missing from the export or loaded from the wrong runtime path.",
};

const escalationCopy: Record<string, string> = {
  "変更が複数sceneまたは複数systemへ広がったら、作業を小さく分けて再分析する": "If the change spreads across scenes or systems, split it into smaller tasks and re-analyze.",
  "ゲーム状態や入力処理へ触れる場合は、実装前に正常系と戻し方を決める": "If the change touches game state or input, decide the happy path and rollback before implementation.",
  "既存セーブ互換性へ触れる場合は、セーブを退避して互換性確認を追加する": "If the change touches save compatibility, back up the saves and add a compatibility check.",
  "セーブ形式・migrationを含む場合は、既存セーブを退避して移行検証を追加する": "If the task includes save format or migration, back up existing saves and add migration checks.",
  "状態遷移や勝敗判定を複数systemで共有する場合は、組み合わせ表を先に作る": "If state transitions or win conditions span systems, make a combination table first.",
  "再現条件が不明な進行不能が見つかった場合は、観測ログを先に追加する": "If you find a softlock with unknown reproduction conditions, add observation logs first.",
  "影響する状態と再現手順が確定できない場合は実装前に観測点を追加する": "If the affected state and reproduction steps are unclear, add observation points before implementation.",
  "既存セーブの退避やrollback手段がない場合は変更を開始しない": "Do not start until existing saves are backed up and a rollback path exists.",
  "一度に検証できない範囲ならタスクを分割して再分析する": "If the scope cannot be verified at once, split the task and re-analyze it.",
};

export const getFixtureDisplayCopy = (fixtureId: string, fallback: FixtureDisplayCopy): FixtureDisplayCopy =>
  fixtureDisplayCopy[fixtureId] ?? fallback;

export const getBlockerDisplayCopy = (blocker: GodotBlocker): BlockerDisplayCopy =>
  blockerDisplayCopy[blocker.id] ?? {
    title: blocker.id,
    summary: "Review the related Godot structure before changing it.",
    firstSteps: ["Inspect the existing scene, Node, script, and settings involved."],
    commonPitfalls: ["Changing a wider area than the task requires."],
    verificationSteps: ["Verify the affected flow in a representative scene."],
    stopConditions: ["The scope or rollback path is unclear."],
    safeCodexPrompt: "Inspect the existing structure first and propose the smallest safe change.",
  };

export const getCategoryLabel = (category: TaskCategory) => categoryLabels[category];

export const getSignalLabel = (signal: MatchedSignal) => signalLabels[signal.id] ?? "Related Godot signal";

export const translateText = (text: string) => {
  if (textCopy[text]) return textCopy[text];
  const creatorPrefix = Object.entries(creatorReasonPrefixes).find(([prefix]) => text.startsWith(prefix));
  if (creatorPrefix) return creatorPrefix[1];
  return text;
};

export const translateGuidance = (guidance: GearshiftRecommendation["guidance"]): WorkflowGuidance => {
  const copy = guidanceCopy[guidance.title];
  return {
    title: copy?.title ?? guidance.title,
    summary: copy?.summary ?? guidance.summary,
    firstAction: translateText(guidance.firstAction),
  };
};

export const translateReason = (reason: string) => translateText(reason);
export const translateEscalation = (condition: string) => escalationCopy[condition] ?? translateText(condition);

export const translateBlockerReason = (reason: string) => {
  if (reason === "初心者シグナルから優先") return "Prioritized by beginner-language signal";
  const phraseMatch = reason.match(/^タスク文の「(.+)」に一致$/);
  if (phraseMatch) {
    const phrase = phraseMatch[1];
    return /[ぁ-んァ-ン一-龯]/.test(phrase)
      ? "Matches a relevant task phrase"
      : `Matches “${phrase}” in the task`;
  }
  const signalMatch = reason.match(/^分析信号「(.+)」に関連$/);
  if (signalMatch) return `Related to analysis signal “${signalLabels[signalMatch[1]] ?? signalMatch[1]}”`;
  const categoryMatch = reason.match(/^(.+)カテゴリに関連$/);
  if (categoryMatch) return `Related to the ${categoryLabels[categoryMatch[1] as TaskCategory] ?? categoryMatch[1]} category`;
  return translateText(reason);
};

export const buildDisplayPrompt = (
  blocker: GodotBlocker,
  taskDescription: string,
  analysis: GearshiftRecommendation,
) => {
  const copy = getBlockerDisplayCopy(blocker);
  const firstSteps = copy.firstSteps.map((step) => `- ${step}`).join("\n");
  const verification = copy.verificationSteps.map((step) => `- ${step}`).join("\n");

  return `For a Godot 4.x project, help me move this task forward safely.

## Task
${taskDescription}

## Current signals
- Related categories: ${analysis.categories.map(getCategoryLabel).join(", ")}
- Main blocker: ${copy.title}
- ${copy.summary}

## Safe scope
- Work only in directly related scenes, Nodes, scripts, and Project Settings.
- Inspect the existing structure and connections before proposing a change.
- ${copy.safeCodexPrompt}

## First checks
${firstSteps}

## Verification after implementation
${verification}

## Safety boundary
- State unknowns clearly; do not make destructive changes based on guesses.
- Do not push to GitHub, delete files, or make a broad refactor.
- If the scope expands, stop and report why and how to split the work.`;
};
