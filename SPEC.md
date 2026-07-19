# Codex Gearshift — MVP Specification

## 1. Problem

個人ゲーム開発では、同じ「コード変更」でもUIの文言修正とセーブ形式の変更では必要な推論量も検証も違います。モデル選択を単なる難易度で決めると、ゲーム状態、物理挙動、入力感、視覚品質といった失敗モードを見落とします。

Codex Gearshiftはタスクをゲーム開発固有の軸で分解し、制作者には次の行動と検証シーケンスを提示します。モデルプロファイルと推論レベルは、その支援を成立させる内部ルーティングとして扱います。

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
| Task categories | Gameplay, UI, Scene, SaveLoad, Input, Physics, Audio, AI, Performance, Export, VisualPolish, Tooling（複数可） |
| Risks | implementation / game state / save compatibility / regression を Low / Medium / High で評価 |
| Verification flags | automated tests / playtest / visual / save migration / export |
| Model profile | fast / balanced / deep |
| Reasoning level | low / medium / high |
| Explainability | matched signals / reasons / confidence / escalation conditions |
| Verification | 順序付きの具体的手順 |
| Workflow guidance | 制作者向けの進め方、短い説明、最初の具体的行動 |
| Blocker guide | 関連度順の最大3件、表示理由、最初の行動、落とし穴、確認、停止条件、安全なCodex依頼文 |

### Presentation policy

- 表側の主役は「そのまま進める / 確認しながら進める / 退避して慎重に進める」とする
- 最初に行う具体的な一手を、リスク説明より先に表示する
- `fast / balanced / deep`、reasoning、confidenceは観測可能な内部情報として小さく残す
- profileを選ぶこと自体をユーザーへ要求しない
- deepでは恐怖を煽らず、退避・再現・分割という戻れる手順を示す

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

### M1 rule table

| Signal / combination | Route | Main checks |
| --- | --- | --- |
| 局所的な文言、色、音声asset | fast | visualまたはplaytest |
| scene追加、入力機能、physics、AI、performance、export | balanced | 対象別のtests/playtest/export |
| セーブ形式、schema、migration、互換性 | deepへ強制昇格 | migration、旧save読込、round trip |
| 中核のターン/phase/state遷移 | deepへ強制昇格 | 状態遷移表、境界、再開 |
| 複数層/systemをまたぐ勝敗判定 | deepへ強制昇格 | 組み合わせ、境界ターン |
| 再現性の低い進行不能 | deepへ強制昇格 | 観測ログ、反復playtest |

ルールは安定した順序で評価し、同じ入力と設定から同じ結果を返します。複数カテゴリに一致しただけでは昇格せず、Medium以上のリスクまたは明示的な安全ゲートがある場合にギアを上げます。これにより、たとえばUI色変更が `UI + VisualPolish` に一致しても `fast` を維持できます。

各結果には発火したrule IDを `matchedSignals` として残します。confidenceは一致した明示ルールの量と安全ゲートの有無から決定論的に算出する説明補助であり、統計的な正解確率ではありません。

### M2 Blocker selection

BlockerはGodot固有の詰まり方を表す静的データで、`id`、関連カテゴリ、対応signal、明示phrase、難易度、最初の行動、落とし穴、確認、停止条件、安全な依頼文、関連Blocker IDを持ちます。

選択はタスク文の明示phrase一致、M1のsignal一致、カテゴリ一致をこの順に強く評価します。phraseまたはsignalの強い一致がない候補は表示せず、score降順、同点時はデータ定義順で最大3件に固定します。同じ入力と分析結果から、同じ候補・順序・依頼文を返します。関連度は統計的な正解確率ではなく、ルール一致の強さです。

安全なCodex依頼文には目的、既知の状態、変更範囲、既存構造を先に確認する指示、実装後の検証を含めます。不明点を推測した破壊的変更、GitHubへのpush、file削除、大規模refactorは禁止し、範囲が広がる場合は停止して報告させます。

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

- タスク文を入力すると12カテゴリから1つ以上を返す
- 4リスク、5検証flag、profile、reasoning、rule ID付き根拠、confidence、escalation条件を表示する
- SaveLoad/Physics/UI/Exportを含む13 fixtureで期待判定をテストする

### M2 — Godot Blocker Guide

- 12件以上のGodot固有Blockerから、入力に強く関連する最大3件を選ぶ
- 表示理由、最初の行動、落とし穴、確認、停止条件を展開カードで示す
- 検証条件と安全境界を含むCodex依頼文をコピーできる
- 同じ入力と分析結果から同じBlockerと順序を再現できる

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

## 9. Open decisions after M2

- Blockerの関連度と文言を初心者の実タスクで校正する手順
- モデルプロファイル設定の初期対応（利用可能なCodexモデルを実験開始時に確認）
- 安全な依頼文を次のM3デモ導線でどう再利用するか
