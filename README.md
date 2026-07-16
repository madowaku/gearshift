# Codex Gearshift

Codex Gearshiftは、Godot 4.xを使う個人ゲーム開発者向けの、モデル・推論レベル選択支援ツールです。ゲーム実装タスクを分析し、ゲーム固有のリスクと必要な検証から「どのギアで実装するか」を説明付きで提案します。

現在は **M0: Foundation** です。画面は完成形のデータ契約を使った静的プレビューで、判定エンジンと入力操作はM1で実装します。

## MVPの価値

- Gameplay / UI / Save / Physicsなど11種のタスク分類
- 複雑度、変更範囲、ゲーム状態、セーブ互換性のリスク判定
- 視覚確認とプレイテストの必要性を明示
- Fast / Balanced / Deepのモデルプロファイルと推論レベルを推薦
- Godot向けの検証手順と、推薦理由を同じ画面に表示

モデルプロファイルと実際のモデルIDは分離します。これにより、利用可能なCodexモデルが変わっても判定ロジックと実験結果を保てます。

## ローカル起動

必要環境: Node.js 22以降、npm 10以降

```bash
npm install
npm run dev
```

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
- **M1 — Analyzer:** 入力UIと決定論的なルールベース判定
- **M2 — Routing Lab:** 複数のGodotタスク fixture、モデルプロファイル比較、JSON出力
- **M3 — Demo Polish:** リスク可視化、結果コピー、レスポンシブ調整、デモ導線
- **M4 — Submission:** 回帰確認、README/Devpost/3分動画、提出前監査

## Status

M0のローカル作業中です。公開・課金・外部送信を行わず、解析データはブラウザ内で扱う方針です。

