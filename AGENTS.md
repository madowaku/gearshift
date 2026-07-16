# Codex Gearshift — Repository Guidance

## Product world

Codex Gearshift is a small, explainable routing assistant for solo Godot 4.x developers. Preserve the core sequence: **task → game-specific risk → model/reasoning route → verification plan**. It is not a generic model router or an autonomous coding agent.

## Scope rules

- Keep the Build Week MVP local-first, deterministic, and usable without an API key.
- Prefer explicit rules and fixtures over opaque scoring.
- Keep model profile names separate from changeable provider model IDs.
- Do not add a backend, database, authentication, payment, or Godot editor plugin without an explicit milestone decision.
- Do not claim a recommendation is objectively optimal; report rules and experiment evidence.
- Ask before publishing, charging, deleting user data, or pushing to GitHub.

## Working agreement

- Read README.md, SPEC.md, and BUILD_LOG.md before substantial changes.
- Work on the smallest current milestone; do not pull later milestones forward without a concrete need.
- Preserve unrelated user changes and inspect `git status` before staging.
- Add or update focused fixtures/tests when routing behavior changes.
- Append a BUILD_LOG session entry with observable facts. Use `Not available` instead of guessing model, reasoning, session ID, or credits.

## Commands

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

Before handing off a code change, run at least test, typecheck, and build. For UI changes, also perform a browser smoke check when browser tooling is available.

