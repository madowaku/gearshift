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
