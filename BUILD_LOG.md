# Build Log

実装の結果だけでなく、Codexが短縮した作業、人間が決めたこと、実際に行った検証をセッション単位で残します。不明な値は推測せず `Not available` と記録します。

## Session 001

- Date: 2026-07-16 (Asia/Tokyo)
- Goal: M0 — MVP仕様、技術構成、マイルストーン、最小プロジェクト骨格を作る
- Model: GPT-5-based Codex agent
- Reasoning level: Not exposed to the session
- Codex session ID: Not exposed to the session
- Files changed: README.md, SPEC.md, BUILD_LOG.md, AGENTS.md, package.json, package-lock.json, tsconfig.json, vite.config.ts, index.html, public/favicon.svg, src/*, .gitignore
- What Codex accelerated: 空のリポジトリから仕様の構造化、リスク軸の定義、M0〜M4設計、UIプレビュー、テスト骨格を作成
- Human decisions: Godot 4.x特化、ゲーム固有リスク/検証/可視化を中心にする、M0では本格判定を実装しない、外部公開とpushは確認制にする
- Tests performed: `npm test`, `npm run typecheck`, `npm run build`, Playwright CLI browser snapshot and console smoke check
- Credits before: 2500 (user-provided)
- Credits after: Not available to the session
- Result: M0 completed locally; 2 tests passed, typecheck/build passed, and the preview rendered without console errors
- Next step: M1で決定論的ルールエンジンと入力UIを実装する

### Verification result

- `npm test`: PASS — 1 file, 2 tests
- `npm run typecheck`: PASS
- `npm run build`: PASS — Vite 7.3.6 production bundle generated
- Browser smoke check: PASS — heading, task, route, risks, and verification sequence found; no new console error log after favicon fix
- Git: local `main` repository initialized and `origin` set; initial M0 commit created locally, while push was intentionally not performed

## Session 002

- Date: 2026-07-17 (Asia/Tokyo)
- Goal: M1 — 説明可能な決定論的ルールエンジンと、一画面の分析体験を完成させる
- Model: GPT-5-based Codex agent
- Reasoning level: Not exposed to the session
- Codex session ID: Not exposed to the session
- Files changed: README.md, SPEC.md, BUILD_LOG.md, src/domain.ts, src/analyzer.ts, src/analyzer.test.ts, src/fixtures.ts, src/main.ts, src/style.css; removed obsolete M0 sample/test files
- What Codex accelerated: 強い安全ゲート、12カテゴリ、4リスク、5検証flag、13 fixture、説明可能性フィールド、入力から結果までのUIを実装
- Human decisions: Gearshiftをモデル表ではなくゲーム制作の詰まりを解く道具にする、M1は外部AIなし、カテゴリ数だけでリスクを過大評価しない
- Tests performed: `npm test`, `npm run typecheck`, `npm run build`, Playwright CLIで13 fixture切替・自由入力・console・desktop screenshotを確認
- Credits before: Not available to the session
- Credits after: Not available to the session
- Result: M1 completed locally; 23 tests passed and the full task → signal → route → verification loop works in the browser
- Next step: M1の人間レビュー後にcommitし、M2でprofile mappingと比較実験を設計する

### Verification result

- `npm test`: PASS — 1 file, 23 tests
- `npm run typecheck`: PASS
- `npm run build`: PASS — Vite 7.3.6 production bundle generated
- Fixture browser sweep: PASS — 13/13 displayed; 3 fast, 6 balanced, 4 deep
- Free-form browser flow: PASS — save migration input returned deep / SaveLoad / all High risks / migration checks
- Browser console: PASS — 0 errors, 0 warnings
- Visual inspection: PASS — desktop layout keeps task, route, risks, reasons, checks, and escalation conditions readable
- Git: M0 pushed to `origin/main` and `v0.1.0-m0`; M1 remains local on `feat/m1-rule-engine`

## Session 003

- Date: 2026-07-17 (Asia/Tokyo)
- Goal: M1 UX refinement — AIモデルを意識せず、ゲーム制作の次の一手へ集中できる表示にする
- Model: GPT-5-based Codex agent
- Reasoning level: Not exposed to the session
- Codex session ID: Not exposed to the session
- Files changed: README.md, SPEC.md, BUILD_LOG.md, src/domain.ts, src/analyzer.ts, src/analyzer.test.ts, src/main.ts, src/style.css
- What Codex accelerated: 内部profileから制作者向け進行ガイダンスへの変換、行動優先のUI、回帰テスト、仕様の再定義
- Human decisions: AIモデル選択を表の主役にせず、制作を止めないナビゲーションをGearshiftの中心にする
- Tests performed: `npm test`, `npm run typecheck`, `npm run build`, Playwright CLIで3ガイダンス、sample表示、console、desktop screenshotを確認
- Credits before: Not available to the session
- Credits after: Not available to the session
- Result: Creator-first guidance completed locally; profile selection is now an internal detail and the UI leads with the next production action
- Next step: 人間レビューで言葉の温度と行動の有用性を確認し、M1 commit候補にする

### Verification result

- `npm test`: PASS — 1 file, 26 tests
- `npm run typecheck`: PASS
- `npm run build`: PASS — Vite 7.3.6 production bundle generated
- Guidance mapping: PASS — fast / balanced / deepを3つの制作者向け行動へ変換
- Browser smoke check: PASS — 最初の行動、詰まり、確認、停止条件が順に表示される
- Profile visibility: PASS — sample一覧と主要見出しからprofile名を除き、内部診断行にのみ保持
- Browser console: PASS — 0 errors, 0 warnings
- Visual inspection: PASS — desktopで制作行動が内部ギアより先に読める
- Git: changes remain local on `feat/m1-rule-engine`; no commit or push performed

## Session 004

- Date: 2026-07-17 (Asia/Tokyo)
- Goal: M2 — 入力タスクに関係するGodot Blockerと安全なCodex依頼文を提示する
- Model: GPT-5-based Codex agent
- Reasoning level: Not exposed to the session
- Codex session ID: Not exposed to the session
- Files changed: README.md, SPEC.md, BUILD_LOG.md, src/analyzer.ts, src/fixtures.ts, src/main.ts, src/style.css, src/blockers.ts, src/blockers.test.ts
- What Codex accelerated: 16件のBlockerデータ、決定論的な関連選択、8 fixture、展開カード、安全な依頼文とCopy操作、回帰テストを実装
- Human decisions: 用語集ではなく入力タスクに関係する穴だけを先回り表示し、進めてよい範囲と立ち止まる条件を案内する
- Tests performed: `npm test`, `npm run typecheck`, `npm run build`, Playwright CLIで主要fixture、Copy、console、mobile layoutを確認
- Credits before: Not available to the session
- Credits after: Not available to the session
- Result: M2 completed locally; 53 tests、typecheck、production build、browser validationがすべて成功
- Next step: 人間レビューでBlocker文言と関連度を確認し、M2 commit候補にする

### Verification result

- `npm test`: PASS — 2 files, 53 tests
- `npm run typecheck`: PASS
- `npm run build`: PASS — Vite 7.3.6 production bundle generated
- Fixture browser check: PASS — Save、Signal、Export、UI layoutで期待するBlockerを表示し、最大3件に制限
- Copy interaction: PASS — safeCodexPromptをコピーし、buttonが `Copied` へ変化
- Browser console: PASS — 0 errors, 0 warnings
- Responsive inspection: PASS — 390px幅で展開カード、4案内区分、prompt、Copy buttonが読める
- Git: changes remain local on `feat/m2-godot-blocker-guide`; no commit or push performed

## Session 005

- Date: 2026-07-19 (Asia/Tokyo)
- Goal: M2環境整理と、人間レビュー前の10タスク評価
- Starting state: M2 was committed as `bdcdb54` and pushed to `origin/feat/m2-godot-blocker-guide` after Session 004.
- Model: Not available
- Reasoning level: Not available
- Codex session ID: Not available
- Files changed: BUILD_LOG.md
- What Codex accelerated: package-lock差分の実質変更確認、clean install、M2 10タスクのブラウザ評価と決定性確認
- Human decisions: Session 004の過去記録は変更しない。phraseやscoreの調整は評価結果を確認してから行い、今回はコードを変更しない
- Tests performed: `node -v`、`npm -v`、`npm ci`、`npm test`、`npm run typecheck`、`npm run build`、Playwrightによる10タスク評価と同一入力3回の比較
- Credits before: Not available
- Credits after: Not available
- Result: Node v24.14.0 / npm 11.9.0。package-lock差分はoptional dependencyのplatform別`libc`メタデータのみで、HEADへ戻した後の`npm ci`、53 tests、typecheck、buildはPASS。10タスク中8件でBlockerが0件、Save/状態管理と単純表示変更の自然文入力を取りこぼした
- Next step: 人間レビュー結果を確認し、phrase・normalization・scoreの最小調整候補を決める

### Verification result

- `npm ci`: PASS — 52 packages added, 0 vulnerabilities
- `npm test`: PASS — 2 files, 53 tests
- `npm run typecheck`: PASS
- `npm run build`: PASS — Vite 7.3.6 production bundle generated
- Git checkpoint: PASS — `feat/m2-godot-blocker-guide`とoriginはahead/behind 0/0、package-lock整理後にworking tree cleanを確認
- Browser review: 10件を自由入力で評価。Android exportは3 Blocker、単純表示変更はbalanced / Blocker 0件、同一入力3回のBlockerと順位は一致
- Prompt review: Top 1 promptはタスク文を保持し、目的・状態・変更範囲・確認・検証・安全境界を含む。確認した長さは539〜555文字

## Session 006

- Date: 2026-07-19 (Asia/Tokyo)
- Goal: M2.1 — Beginner Language Calibrationを実装し、Session 005の10入力を回帰可能にする
- Starting state: Session 005で、10入力中8件がBlocker 0件、Save/状態管理と単純表示変更の自然文を取りこぼしていた
- Model: Not available
- Reasoning level: Not available
- Codex session ID: Not available
- Files changed: src/domain.ts, src/beginnerSignals.ts, src/analyzer.ts, src/blockers.ts, src/fixtures.ts, src/analyzer.test.ts, src/blockers.test.ts, BUILD_LOG.md
- What Codex accelerated: 初心者phraseの意味グループ化、Analyzerへの決定論的signal合成、Blocker family優先、10入力のfixture/回帰テスト、ブラウザ確認
- Human decisions: 外部AI・機械学習・大規模UI変更は追加しない。phraseはbeginner signal定義へ集約し、既存Blockerデータを再利用する。commit、push、PR、mergeは行わない
- Tests performed: `npm test`, `npm run typecheck`, `npm run build`, Playwrightで10入力、同一Save入力3回、desktop/390px、console確認
- Credits before: Not available
- Credits after: Not available
- Result: 10初心者signal（要件9件に無反応入力を追加）を実装。10入力すべてで期待Top 1を表示し、Save/scene状態/複数ターンはdeep、表示だけはfast、Android画像欠損はResource pathをTop 1へ校正
- Next step: 人間レビューで10入力のTop 1文言とBlocker familyの納得感を確認し、必要なphrase/score修正を小さく決める

### Verification result

- `npm test`: PASS — 2 files, 96 tests（Analyzer 55、Blocker 41）
- `npm run typecheck`: PASS
- `npm run build`: PASS — Vite 7.3.6 production bundle generated
- Calibration coverage: PASS — 10/10 fixtureがexpectedCreatorSignal、expectedGuidance、expectedTopBlocker、expectedVerificationFlagsを満たす
- Determinism: PASS — `前に遊んだデータが開けなくなった`を3回実行し、deep / old_save_unreadable / Saveデータ互換性が一致
- Prompt: PASS — 10入力のTop 1 safeCodexPromptが100文字超で空でない
- Browser: PASS — 10入力、1440x900、390x844を確認。390pxの水平overflow、Blocker overflow、Prompt overflowなし
- Browser console: PASS — errors 0、warnings 0
- Git: commit、push、PR、mergeは未実施。package-lock.jsonは変更なし。開発サーバーは`http://127.0.0.1:5173`で起動中

## Session 007

- Date: 2026-07-19 (Asia/Tokyo)
- Goal: Submission Readiness Phase 1 — GitHub Pages公開設定と提出用リポジトリ文書を準備する
- Starting state: `main`と`v0.3.0-m2.1`はmerge commit `6bdd2be`で一致。`feat/submission-readiness`を作成し、originへpush済み。working treeはclean
- Model: Not available to the session
- Reasoning level: Not available
- Codex session ID: Not available
- Files changed: vite.config.ts, package.json, README.md, LICENSE, .github/workflows/deploy-pages.yml, docs/DEVPOST_DRAFT.md, docs/VIDEO_SCRIPT.md, docs/SUBMISSION_CHECKLIST.md, BUILD_LOG.md
- What Codex accelerated: GitHub Pages用base pathとActions workflow、英語中心README、MIT License、Devpost下書き、2分30秒前後の動画台本、提出チェックリスト、ローカル/production previewとブラウザ検証
- Human decisions: Analyzer、Beginner Signals、Blocker選択、fixture判定をFeature Freezeで固定。GPT-5.6 Thinkingは製品方向と設計レビューに使用し、アプリへAPI統合しない。公開デモと提出文書だけを今回の対象にする
- Tests performed: `npm test`, `npm run typecheck`, `npm run build`, `npm run dev`, `npm run preview`, production base path asset check、Playwright desktop/mobile/console check、`git diff --check`
- Credits before: Not available
- Credits after: Not available
- Result: 96 tests、typecheck、buildがPASS。dev rootは200、previewの`/gearshift/`は200。JS/CSS/faviconはすべてPages想定パスで200。1440x900と390x844で主要3入力を確認し、390px水平overflowなし、console errors 0 / warnings 0。判定ロジックとpackage-lock.jsonは変更なし
- Next step: GitHub SettingsでPages sourceをGitHub Actionsに設定し、mainへ反映後の公開URLを確認。スクリーンショット、動画、Devpost、最終提出証跡を人間が確定する

## Session template

```markdown
## Session NNN

- Date:
- Goal:
- Model:
- Reasoning level:
- Codex session ID:
- Files changed:
- What Codex accelerated:
- Human decisions:
- Tests performed:
- Credits before:
- Credits after:
- Result:
- Next step:
```
