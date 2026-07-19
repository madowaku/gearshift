# Codex Gearshift — Video Script

Target length: approximately 2 minutes 30 seconds. The timestamp plan below ends at about 2:35; trim pauses and cursor movement during recording to stay under three minutes.

## 0:00 — The problem

**On screen:** Open the public demo.

**Narration:** “When a beginner says ‘the button does nothing’ or ‘my coins disappeared,’ the problem is not just a missing keyword. The next action and the risk are different. Codex Gearshift turns that vague language into a safe production path.”

## 0:20 — What Gearshift does

**On screen:** Show the task input, Next Move, risks, checks, and Blocker Guide.

**Narration:** “Gearshift is a local-first, deterministic navigator for Godot 4.x. It keeps the model route in the background and shows the creator what to do first, what to watch, and when to stop.”

## 0:40 — Display-only change

**Input:** `ダイス結果の表示だけを3からTRIPLEへ変えたい`

**On screen:** Select the fixture and show the fast guidance.

**Narration:** “First, a harmless presentation change: only the displayed dice result changes from 3 to TRIPLE. Gearshift keeps this fast because the internal value and game logic are unchanged.”

## 1:05 — UI layout problem

**Input:** `画面サイズを変えるとボタンが変な場所に行く`

**On screen:** Analyze the task and open the UI Anchor / Container blocker.

**Narration:** “Next, a common Godot UI problem. The wording is vague, but the signal points to responsive layout. Gearshift recommends checking anchors and containers, then verifying more than one viewport.”

## 1:30 — Scene state loss

**Input:** `シーンを変えたらコインが0になった`

**On screen:** Analyze the task and show deep guidance, Scene state loss, stop conditions, and checks.

**Narration:** “Now the dangerous case. A scene change caused the coins to reset. This is shared game state, so Gearshift shifts to careful guidance. It asks us to preserve the current state, inspect the transition boundary, and stop before destructive changes.”

## 1:55 — Safe Codex prompt

**On screen:** Expand the top blocker and click Copy prompt.

**Narration:** “The top blocker includes a safe Codex prompt. It carries the goal, current state, scope, verification steps, and a boundary against guessing or broad refactors. The prompt accelerates implementation without hiding the human verification step.”

## 2:15 — Codex and GPT-5.6

**On screen:** Briefly show the README or repository.

**Narration:** “Codex accelerated the Vite and TypeScript implementation, deterministic Analyzer, Blocker Guide, beginner signals, fixtures, tests, browser validation, and responsive checks. GPT-5.6 Thinking was used for product direction and review: defining the creator-first navigator, the beginner audience, Godot risks, calibration criteria, Feature Freeze, and the submission plan. GPT-5.6 is not an API inside this app.”

## 2:35 — Summary

**On screen:** Return to the three result states or the public demo title.

**Narration:** “Gearshift helps beginners move quickly when it is safe, check the right Godot boundary when they are stuck, and slow down before state or save data is lost. The result is explainable, local-first, and ready to try in the browser.”

