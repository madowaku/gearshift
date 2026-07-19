# Codex Gearshift

Codex Gearshift is a local-first, deterministic production navigator for solo developers building games with Godot 4.x. It turns a task description into a game-specific risk profile, an internal routing recommendation, and a verification plan.

**Live demo:** [madowaku.github.io/gearshift](https://madowaku.github.io/gearshift/)

The app runs in the browser without an API key, backend, database, or network request for task analysis. The current submission candidate is **v0.3.0-m2.1**.

## What is Codex Gearshift?

Gearshift helps a creator decide how carefully to approach a Godot task:

- **Move fast** for a small, display-only change.
- **Move with checks** for a change with a concrete Godot integration risk.
- **Move carefully** when save compatibility or shared game state could be lost.

The core sequence is:

`task → Godot-specific risk → internal model/reasoning route → verification plan`

The model profile is an internal routing detail. The creator sees the next useful action, risks, blockers, checks, and safe Codex prompt instead of having to choose a model manually.

## Who it is for

Gearshift is for solo Godot 4.x developers, game-jam participants, and beginner or non-engineering creators who can describe what feels wrong but may not know the Godot term for it.

## The problem

Beginners often say “the button does nothing,” “it happens twice,” or “the coins disappeared after changing scenes.” Those descriptions are meaningful, but they do not directly name signals such as signal connections, collision masks, scene state, or save compatibility.

Gearshift translates that language into an explainable next step without pretending that one recommendation is objectively optimal.

## How it works

1. Enter a task in plain language or choose a fixture.
2. A deterministic Analyzer matches categories, risk signals, beginner-language signals, and verification requirements.
3. The Blocker Guide ranks Godot-specific failure modes and limits duplicate blocker families.
4. The UI presents the recommended action, first step, stop conditions, checks, and a safe prompt for Codex.

The repository contains 31 reproducible task fixtures, 16 Godot-specific blockers, and regression tests for the M2.1 beginner-language calibration.

## Three demo tasks

| Input | Expected guidance | Godot-specific route |
| --- | --- | --- |
| `Change only the dice result label from "3" to "TRIPLE".` | Proceed directly | Display-only change; UI text/visual verification |
| `The button moves to the wrong position when the screen size changes.` | Proceed with checks | UI anchors and containers |
| `The coin count resets to zero after changing scenes.` | Create a restore point and proceed carefully | State loss during scene changes; preserve and verify shared state |

These three inputs show the intended change in gear: low-risk wording, a common Godot UI integration problem, and a potentially destructive state problem.

## Installation

Requirements: Node.js 22 or later and npm 10 or later.

```bash
git clone https://github.com/madowaku/gearshift.git
cd gearshift
npm ci
npm run dev
```

Open the local URL printed by Vite. Local development uses the root path and remains available at the usual Vite development URL.

## Supported platforms

- Modern desktop browsers with ES2022 support.
- Modern mobile browsers, including a 390px-wide viewport check.
- Node.js 22+ for local installation and validation.
- Godot 4.x task language and project concepts.

Godot itself is not required to run the web demo. Gearshift does not currently support Godot 3.x, Unity, Unreal, or a Godot Editor plugin.

## How to test

From the repository root:

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run dev
npm run preview
```

For the production preview, use the `/gearshift/` project path shown by Vite. Manual checks should cover the three demo tasks, desktop layout, a 390px viewport, Copy prompt interaction, and browser console errors or warnings.

## Privacy and local-first behavior

Task analysis runs in the browser. The app does not send task text to an external AI API, does not require an API key, and does not include a backend, database, account system, or cloud save.

## How Codex was used

Codex was used to implement and verify:

- the Vite + TypeScript application;
- the deterministic Analyzer;
- the Godot Blocker Guide;
- beginner-language signals;
- fixtures and regression tests;
- browser validation; and
- responsive desktop and mobile checks.

## How GPT-5.6 Thinking was used

GPT-5.6 Thinking was used for product direction and design review, including:

- the shift from a model router to a creator-first navigator;
- defining beginners and non-engineers as the primary audience;
- designing Godot-specific risks and stop conditions;
- reviewing evaluation inputs and correction criteria for Beginner Language Calibration; and
- planning Feature Freeze and the submission phase.

GPT-5.6 was not integrated into the application or called through an API. The runtime path is deterministic and local-first. No unverified model ID, reasoning level, or credit count is claimed here.

## What Codex accelerated

Codex accelerated repository scaffolding, rule and data-contract implementation, fixture creation, regression coverage, browser smoke checks, responsive inspection, and the preparation of reproducible submission documentation.

## Key human decisions

The human decisions were to focus on Godot 4.x, keep the MVP local-first and explainable, make creator action more prominent than model names, add beginner-language calibration, freeze Analyzer and Blocker behavior at M2.1, choose the three demo inputs, and reserve the remaining work for submission readiness.

## Known limitations

- Rules are deterministic and explainable, not a claim of objective optimality.
- The app does not edit Godot projects or execute Codex tasks.
- There is no Godot Editor integration, backend, authentication, database, or external AI API.
- The public demo UI is English-first and currently presents one language without a language toggle.
- Platform export advice is guidance; the app does not build or run an Android or desktop Godot export.
- Beginner phrasing coverage is intentionally bounded by explicit signals and fixtures.

## Build Week development scope

The Build Week MVP covers task input, game-specific risk analysis, internal routing profiles, Godot blocker guidance, verification planning, and safe prompt generation. It intentionally excludes a backend, accounts, payments, a Godot plugin, automatic code edits, and autonomous agent execution.

## License

MIT. See [LICENSE](./LICENSE).
