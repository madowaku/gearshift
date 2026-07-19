# Codex Gearshift — Devpost Draft

## Project overview

Codex Gearshift is a local-first, deterministic production navigator for solo Godot 4.x developers. It translates plain-language task descriptions into Godot-specific risks, an internal reasoning route, verification steps, and a safe prompt for Codex.

## Inspiration

Beginner creators often know what feels wrong before they know the Godot term for it. “The button does nothing,” “it triggers twice,” or “my coins became zero after changing scenes” can point to very different levels of risk. We wanted a tool that respects that language and guides the creator toward the right first check.

## What it does

Gearshift analyzes a task locally in the browser and presents:

- a creator-first action: move fast, move with checks, or move carefully;
- risk across implementation, game state, save compatibility, and regression;
- matched categories and explainable signals;
- Godot-specific blockers with first steps, pitfalls, verification, and stop conditions; and
- a safe Codex prompt that can be copied without hiding the verification boundary.

## How it works

The pipeline is deterministic:

`task → beginner language and Godot signals → risk/profile → blocker selection → verification plan`

Explicit phrases, phrase groups, categories, fixtures, and blocker families keep the result reproducible. Save compatibility, shared state, and multi-layer turn changes are escalated to a careful route. Display-only changes remain a fast route.

## How it was built

The app uses Vite, TypeScript, and Vitest. The Analyzer, beginner-language signal definitions, Blocker Guide, fixtures, and UI all run locally. GitHub Actions builds and deploys the static bundle to GitHub Pages after tests and typechecking pass.

Codex was used to implement the Vite + TypeScript application, deterministic Analyzer, Godot Blocker Guide, beginner-language signals, fixtures and tests, browser validation, and responsive checks. GPT-5.6 Thinking was used for product direction and review: the creator-first navigator definition, beginner audience, Godot risk and stop-condition design, Beginner Language Calibration criteria, Feature Freeze, and submission planning. GPT-5.6 was not integrated into the app or called through an API.

## Challenges

- Mapping vague beginner language to specific Godot risks without adding opaque machine learning.
- Preventing generic Export warnings or duplicate blocker families from drowning out the most useful result.
- Making save and shared-state changes appropriately cautious while keeping display-only work fast.
- Preserving a small, explainable, offline-capable MVP under a short Build Week schedule.

## Accomplishments

- 21 reproducible fixtures and 16 Godot-specific blockers.
- M2.1 calibration for ten beginner-language inputs.
- Save and scene-state loss correctly route to careful guidance.
- Display-only wording changes route to fast guidance.
- Safe Codex prompts include scope, verification, and stop boundaries.
- 96 automated tests, typecheck, production build, desktop/mobile browser checks, and zero console errors or warnings in the recorded validation.

## What was learned

The most valuable routing improvement was not adding more generic categories. It was collecting a small set of meaningful phrase combinations and connecting each to a concrete creator action. A good demo also needs to show the change in behavior: the same tool should move quickly for a harmless presentation change and slow down for a possible state-loss problem.

## What's next

The next work is submission readiness: verify the public Pages deployment, finalize README and legal attribution, capture screenshots, record a short demo, complete Devpost fields, and perform the final browser and regression checks. Analyzer and Blocker behavior remain frozen after M2.1 unless a demo, submission requirement, or first-view meaning is broken.

## Built with

- Vite
- TypeScript
- Vitest
- GitHub Actions
- GitHub Pages
- Codex
- GPT-5.6 Thinking for product direction and review, not as an application API

## Testing instructions

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run dev
npm run preview
```

Open the Vite development URL for local development. For the production preview and Pages deployment, use the `/gearshift/` project path. Manually try the three demo inputs, the Copy prompt action, desktop layout, 390px layout, and the browser console.

## Links

- Live demo: https://madowaku.github.io/gearshift/
- Repository: https://github.com/madowaku/gearshift
- License: MIT

## Submission screenshots

- `docs/screenshots/gearshift-build-week-thumbnail-english.png` — 1280×720 English project thumbnail for the hackathon page.
- `docs/screenshots/public-responsive-ui-english-desktop.png` — the balanced route for a responsive UI problem.
- `docs/screenshots/public-scene-state-loss-english-desktop.png` — the deep route for scene state loss, with the top Blocker expanded and the Copy control showing `Copied`.
- `docs/screenshots/public-scene-state-loss-english-mobile-390.png` — the same careful route at a 390px viewport, also showing `Copied`.

## Public demo verification

The deployed URL was checked with the three frozen demo inputs. Each produced the expected guidance and top Blocker, the top Blocker expanded correctly, and Copy changed to `Copied`. The 390px check had no horizontal, Blocker-card, or prompt overflow. Reloading returned a visible initial fixture and result. The browser console reported 0 errors and 0 warnings. The selected submission set is the responsive UI desktop view, the scene state loss desktop view, and the scene state loss mobile view.
