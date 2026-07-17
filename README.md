# Codex Gearshift

Codex Gearshiftは、Godot 4.xを使う個人ゲーム開発者向けの制作ナビゲーターです。ゲーム実装タスクを分析し、詰まりやすい場所、最初に行うこと、必要な確認を提示します。AIモデルと推論レベルの選択は内部の変速機として扱い、制作者が設定を気にせずゲームへ集中できることを目指します。

現在は **M2: Godot Blocker Guide** です。タスク文または21件のfixtureを選ぶと、決定論的ルールエンジンが危険信号、進め方、検証に加え、その作業に関係するBlockerを最大3件まで一画面に表示します。

## MVPの価値

- Gameplay / UI / SaveLoad / Physics / Toolingなど12種の複数タスク分類
- 複雑度、変更範囲、ゲーム状態、セーブ互換性のリスク判定
- 視覚確認とプレイテストの必要性を明示
- 「そのまま進める / 確認しながら進める / 退避して慎重に進める」の制作ガイダンス
- Fast / Balanced / Deepのモデルプロファイルと推論レベルは内部で選択
- Godot向けの検証手順と、推薦理由を同じ画面に表示
- 16件のGodot固有Blockerから、最初の行動、落とし穴、停止条件を関連順に表示
- 安全境界と検証条件を含むCodex依頼文を、そのままコピー可能

モデルプロファイルと実際のモデルIDは分離します。これにより、利用可能なCodexモデルが変わっても判定ロジックと実験結果を保てます。

## ローカル起動

必要環境: Node.js 22以降、npm 10以降

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。サンプルタスクを選ぶと即座に分析され、任意のタスク文は `Analyze task` で判定できます。分析はブラウザ内で完結し、入力を外部へ送信しません。

結果の読み方:

- **Next move:** おすすめの進め方と、最初に行う具体的な一手
- **Risks:** 実装、ゲーム状態、セーブ互換性、回帰の4軸
- **Watch:** 詰まりやすい場所と、必要なら確認できるルールID
- **Check:** 必須チェックと具体的な順序
- **Stop signals:** 作業を続けず、分割・退避・観測へ戻る条件
- **Blocker Guide:** タスクに強く関係する最大3件の注意点と、安全なCodex依頼文

品質チェック:

```bash
npm test
npm run typecheck
npm run build
```

## MVPスコープ

入力はタスク文と最小限のGodotプロジェクト情報、出力は分類・リスク・ルーティング・検証提案です。Godot Editorプラグイン、コード自動変更、クラウドDB、課金、チーム管理はBuild Week版に含めません。

詳細は [SPEC.md](./SPEC.md)、開発の証跡は [BUILD_LOG.md](./BUILD_LOG.md) を参照してください。

## Milestones

- **M0 — Foundation:** 仕様、データ契約、静的プレビュー、開発記録
- **M1 — Analyzer:** 入力UI、13 fixture、決定論的なルールベース判定（実装済み）
- **M2 — Godot Blocker Guide:** 16 Blocker、21 fixture、関連案内と安全な依頼文（実装済み）
- **M3 — Demo Polish:** リスク可視化、結果コピー、レスポンシブ調整、デモ導線
- **M4 — Submission:** 回帰確認、README/Devpost/3分動画、提出前監査

## Status

M2を `feat/m2-godot-blocker-guide` で開発中です。M1は `v0.2.0-m1` として退避済みです。公開・課金・外部送信を行わず、解析データはブラウザ内で扱います。
