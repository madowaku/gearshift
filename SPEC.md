# Codex Gearshift — MVP Specification

## 1. Problem

個人ゲーム開発では、同じ「コード変更」でもUIの文言修正とセーブ形式の変更では必要な推論量も検証も違います。モデル選択を単なる難易度で決めると、ゲーム状態、物理挙動、入力感、視覚品質といった失敗モードを見落とします。

Codex Gearshiftはタスクをゲーム開発固有の軸で分解し、十分だが過剰ではないモデルプロファイル、推論レベル、検証シーケンスを推薦します。

## 2. Target user and primary flow

対象はGodot 4.xで小〜中規模ゲームを一人で開発するユーザーです。

1. ユーザーが実装タスクを1〜5文で入力する。
2. 必要に応じてGodotバージョン、変更対象、既存セーブ有無を選ぶ。
3. Gearshiftが分類、リスク、推奨ギア、検証を一画面に表示する。
4. ユーザーが結果をCodexへの作業依頼や開発ログへコピーする。

## 3. Functional requirements

### Input

- 必須: タスク説明、Godot 4.xであること
- 任意: 関連ファイル/シーン、既存セーブ有無、補足コンテキスト
- Build Week版ではリポジトリ内容の自動送信やGodot Editor連携を行わない

### Analysis output

| Field | Values / shape |
| --- | --- |
| Task category | Gameplay, UI, Scene, Save, Input, Physics, Audio, AI, Performance, Export, Visual Polish |
| Complexity | low / medium / high |
| Change scope | low / medium / high |
| State risk | low / medium / high |
| Save compatibility impact | low / medium / high |
| Visual check | yes / no |
| Playtest | yes / no |
| Model profile | fast / balanced / deep |
| Reasoning level | low / medium / high |
| Verification | 順序付きの具体的手順 |
| Rationale | 判定根拠の短い箇条書き |

### Routing policy

- `fast`: 局所的、低リスク、挙動境界が明確な変更
- `balanced`: 複数ファイルまたはゲーム挙動に触れるが、状態移行が限定的な変更
- `deep`: セーブ、共有状態、物理/AIの相互作用、性能ボトルネック、輸出設定など失敗範囲が広い変更
- いずれかの重要リスクが高い場合は、平均値で薄めず最低ギアを引き上げる
- モデルプロファイルから実際のモデルIDへの対応は設定として分離し、実験時に記録する

### Verification policy

- Save: 既存セーブ複製、移行、欠損フィールド、ロールバック
- Input/Gameplay: 境界値、同時入力、状態遷移、実プレイ
- Physics: 固定FPS差、衝突境界、極端値、実プレイ
- UI/Visual Polish: 複数解像度、テーマ/フォント、スクリーンショット比較
- Performance: profiler、代表シーン、変更前後比較
- Export: 対象プラットフォームの実ビルドと起動

## 4. Decision engine

MVPは説明可能な決定論的ルールを主系とします。カテゴリキーワード、明示コンテキスト、リスクフラグから各軸を算出し、ルールIDを推薦理由へ残します。AIによる自由文補助はM2以降の任意実験であり、APIキーやネットワークなしでもデモ可能にします。

判定の優先順:

1. セーブ互換性、共有ゲーム状態、破壊的変更の安全ゲート
2. 変更範囲と相互作用
3. 視覚確認/プレイテストの必要性
4. 複雑度
5. コストを抑える方向へのギア調整

## 5. Technical architecture

- Vite + TypeScriptの単一ページWebアプリ
- `domain`: 入出力型、分類、ルール、スコア
- `fixtures`: 再現可能なGodotタスクと期待結果
- `ui`: 入力、リスクカード、推薦、検証シーケンス
- `adapters`: モデルプロファイル設定、JSON/Markdown export（M2）
- Vitestによるルールと契約の回帰テスト
- バックエンド、DB、認証なし。静的ホスティング可能

この構成は締切までの一人開発、オフラインデモ、判定根拠の説明、実験結果の再現性を優先します。

## 6. Non-goals

- Godot Editorプラグイン、LSP、コード自動編集
- Codex実行の自動化、APIキー管理、課金機能
- Godot 3.x、Unity、Unrealへの対応
- 大規模リポジトリ索引、クラウド保存、マルチユーザー機能
- 「最適モデル」を証明すること。推薦は明示ルールとローカル実験に基づく支援情報

## 7. Milestones and acceptance criteria

### M0 — Foundation

- 仕様・運用・セッションログがリポジトリにある
- 入出力のTypeScript契約と静的プレビューがビルドできる
- テスト、型検査、production buildが成功する

### M1 — Analyzer

- タスク文を入力すると11カテゴリのいずれかを返す
- 全分析フィールドとルールID付き根拠を表示する
- Save/Physics/UIを含む最低12 fixtureで期待判定をテストする

### M2 — Routing Lab

- fast/balanced/deepの対応を設定で切り替えられる
- 代表タスクを一括評価し、JSON/Markdownへ出力できる
- 同じ入力と設定から同じ結果を再現できる

### M3 — Demo Polish

- 60秒以内に入力から結果コピーまで説明できる
- モバイル幅とデスクトップ幅で主要情報が読める
- リスク、ギア、検証の関係が一画面で理解できる

### M4 — Submission

- 回帰テスト、型検査、production build、ブラウザsmoke testが成功する
- README、Devpost本文、3分動画台本にBUILD_LOGの証拠を反映する
- 実測したモデル/推論/クレジットと、推測を区別して記載する

## 8. Risks and mitigations

- 判定が主観的: ルールID、fixture、期待結果を公開して比較可能にする
- モデル名の変更: 安定したプロファイルと可変のモデル対応を分離する
- UI作り込み超過: 入力→推薦→検証の1画面以外は作らない
- API/通信トラブル: 決定論的ローカル判定をデモの主系にする
- 提出証拠不足: 各セッションでBUILD_LOGを更新する

## 9. Open decisions for M1

- ルールの重みと、安全ゲートの閾値
- モデルプロファイル設定の初期対応（利用可能なCodexモデルを実験開始時に確認）
- fixtureの正解ラベルを一人で校正する手順

