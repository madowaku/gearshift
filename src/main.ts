import "./style.css";
import { analyzeTask } from "./analyzer";
import { selectBlockers } from "./blockers";
import type { BlockerMatch } from "./blockers";
import type { GearshiftRecommendation, RiskAssessment, VerificationRequirements } from "./domain";
import { taskFixtures } from "./fixtures";
import {
  buildDisplayPrompt,
  getBlockerDisplayCopy,
  getCategoryLabel,
  getFixtureDisplayCopy,
  getSignalLabel,
  translateBlockerReason,
  translateEscalation,
  translateGuidance,
  translateReason,
  translateText,
} from "./uiCopy";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("#app was not found");

app.innerHTML = `
  <main class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">OPENAI BUILD WEEK · CREATOR-FIRST GODOT NAVIGATOR</p>
        <h1>Codex <span>Gearshift</span></h1>
      </div>
      <p class="lead">Turn a plain-language Godot task into the safest next move, likely blockers, and a verification plan.</p>
    </header>

    <section class="analyzer-layout" aria-label="Gearshift analyzer">
      <form id="task-form" class="panel task-panel">
        <div class="section-heading">
          <div>
            <p class="step">01 · TASK</p>
            <h2>What are you changing?</h2>
          </div>
          <span class="status">LOCAL · DETERMINISTIC</span>
        </div>

        <label for="fixture-select">Sample tasks <span id="fixture-count"></span></label>
        <select id="fixture-select"></select>

        <label for="task-input">Implementation task</label>
        <textarea id="task-input" rows="6" required placeholder="e.g. Change turn progression while preserving existing saves"></textarea>

        <button type="submit">Analyze task <span aria-hidden="true">→</span></button>
        <p class="privacy-note">Analysis runs in your browser and is never sent externally.</p>
      </form>

      <section id="result" class="result-stack" aria-live="polite">
        <article class="panel route-panel">
          <div class="section-heading">
            <div>
              <p class="step">02 · NEXT MOVE</p>
              <h2>Recommended next move</h2>
            </div>
          </div>
          <div class="guidance-banner">
            <strong id="guidance-title" class="guidance-title"></strong>
            <p id="guidance-summary"></p>
          </div>
          <div class="first-action">
            <span>First action</span>
            <strong id="first-action"></strong>
          </div>
          <div class="technical-route" aria-label="Internal routing details">
            <span id="profile"></span>
            <span id="reasoning"></span>
            <span id="confidence"></span>
          </div>
          <div id="categories" class="chips" aria-label="Matched categories"></div>
          <div id="risks" class="risk-grid"></div>
        </article>

        <article class="panel explanation-panel">
          <p class="step">03 · WATCH</p>
          <h2>What to watch</h2>
          <ul id="reasons" class="plain-list"></ul>
          <details>
            <summary>Matched signals</summary>
            <ul id="signals" class="signal-list"></ul>
          </details>
        </article>

        <article class="panel verification-panel">
          <p class="step">04 · CHECK</p>
          <h2>What to check next</h2>
          <div id="checks" class="check-grid"></div>
          <ol id="steps" class="verification-steps"></ol>
        </article>

        <article class="panel escalation-panel">
          <p class="step">05 · STOP SIGNALS</p>
          <h2>Stop and review when</h2>
          <ul id="escalations" class="plain-list"></ul>
        </article>

        <article class="panel blocker-guide-panel">
          <div class="section-heading">
            <div>
              <p class="step">06 · BLOCKER GUIDE</p>
              <h2>Likely blockers for this task</h2>
            </div>
            <span id="blocker-count" class="status"></span>
          </div>
          <p class="blocker-intro">Only blockers strongly related to your task are shown, up to three.</p>
          <div id="blocker-cards" class="blocker-list"></div>
        </article>
      </section>
    </section>
  </main>
`;

const get = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`#${id} was not found`);
  return element as T;
};

const form = get<HTMLFormElement>("task-form");
const fixtureSelect = get<HTMLSelectElement>("fixture-select");
const taskInput = get<HTMLTextAreaElement>("task-input");

const riskLabels: Record<keyof RiskAssessment, string> = {
  implementationRisk: "Implementation",
  gameStateRisk: "Game state",
  saveCompatibilityRisk: "Save compatibility",
  regressionRisk: "Regression",
};

const checkLabels: Record<Exclude<keyof VerificationRequirements, "steps">, string> = {
  automatedTestsRequired: "Automated tests",
  playtestRequired: "Playtest",
  visualVerificationRequired: "Visual verification",
  saveMigrationCheckRequired: "Save migration",
  exportCheckRequired: "Export build",
};

const customOption = document.createElement("option");
customOption.value = "custom";
customOption.textContent = "CUSTOM · Free input";
fixtureSelect.append(customOption);

const renderTextList = (element: HTMLElement, items: string[]) => {
  element.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }),
  );
};

const copyPrompt = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporary = document.createElement("textarea");
  temporary.value = text;
  temporary.setAttribute("readonly", "");
  temporary.className = "copy-fallback";
  document.body.append(temporary);
  temporary.select();
  const copied = document.execCommand("copy");
  temporary.remove();
  if (!copied) throw new Error("Copy was not available");
};

const makeBlockerSection = (title: string, items: string[]) => {
  const section = document.createElement("section");
  section.className = "blocker-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const list = document.createElement("ul");
  renderTextList(list, items);
  section.append(heading, list);
  return section;
};

const makeBlockerCard = (match: BlockerMatch, index: number, taskDescription: string, analysis: GearshiftRecommendation) => {
  const details = document.createElement("details");
  details.className = "blocker-card";
  details.open = index === 0;
  const copy = getBlockerDisplayCopy(match.blocker);

  const summary = document.createElement("summary");
  const summaryText = document.createElement("span");
  const title = document.createElement("strong");
  title.textContent = copy.title;
  const why = document.createElement("small");
  why.textContent = match.reasons.map(translateBlockerReason).join(" · ");
  summaryText.append(title, why);
  const relevance = document.createElement("span");
  relevance.className = "relevance";
  relevance.textContent = `Relevance ${match.relevance}`;
  summary.append(summaryText, relevance);

  const body = document.createElement("div");
  body.className = "blocker-body";
  const overview = document.createElement("p");
  overview.className = "blocker-summary";
  overview.textContent = copy.summary;
  const grid = document.createElement("div");
  grid.className = "blocker-grid";
  grid.append(
    makeBlockerSection("First steps", copy.firstSteps),
    makeBlockerSection("Common pitfalls", copy.commonPitfalls),
    makeBlockerSection("Verification", copy.verificationSteps),
    makeBlockerSection("Stop conditions", copy.stopConditions),
  );

  const promptHeading = document.createElement("h3");
  promptHeading.textContent = "Safe Codex prompt";
  const prompt = document.createElement("pre");
  prompt.className = "prompt-box";
  const displayPrompt = buildDisplayPrompt(match.blocker, taskDescription, analysis);
  prompt.textContent = displayPrompt;
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "copy-button";
  copyButton.textContent = "Copy prompt";
  copyButton.addEventListener("click", async () => {
    try {
      await copyPrompt(displayPrompt);
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Copy failed";
    }
  });

  body.append(overview, grid, promptHeading, prompt, copyButton);
  details.append(summary, body);
  return details;
};

const renderResult = (result: GearshiftRecommendation, description: string, displayDescription = description) => {
  const guidance = translateGuidance(result.guidance);
  app.dataset.profile = result.recommendedProfile;
  get("guidance-title").textContent = guidance.title;
  get("guidance-summary").textContent = guidance.summary;
  get("first-action").textContent = guidance.firstAction;
  get("profile").textContent = `Internal gear · ${result.recommendedProfile}`;
  get("reasoning").textContent = `Reasoning · ${result.reasoningLevel}`;
  get("confidence").textContent = `Signal confidence · ${Math.round(result.confidence * 100)}%`;

  get("categories").replaceChildren(
    ...result.categories.map((category) => {
      const span = document.createElement("span");
      span.textContent = getCategoryLabel(category);
      return span;
    }),
  );

  get("risks").replaceChildren(
    ...(Object.entries(result.risks) as [keyof RiskAssessment, RiskAssessment[keyof RiskAssessment]][]).map(
      ([key, value]) => {
        const card = document.createElement("div");
        card.className = `risk risk-${value.toLowerCase()}`;
        const label = document.createElement("span");
        label.textContent = riskLabels[key];
        const strong = document.createElement("strong");
        strong.textContent = value;
        card.append(label, strong);
        return card;
      },
    ),
  );

  renderTextList(get("reasons"), result.reasons.map(translateReason));
  get("signals").replaceChildren(
    ...result.matchedSignals.map((signal) => {
      const li = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = signal.id;
      const span = document.createElement("span");
      span.textContent = getSignalLabel(signal);
      li.append(code, span);
      return li;
    }),
  );

  get("checks").replaceChildren(
    ...(Object.entries(checkLabels) as [Exclude<keyof VerificationRequirements, "steps">, string][]).map(
      ([key, label]) => {
        const check = document.createElement("div");
        const required = result.verification[key];
        check.className = `check ${required ? "check-required" : "check-skip"}`;
        check.textContent = `${required ? "✓" : "–"} ${label}`;
        return check;
      },
    ),
  );

  renderTextList(get("steps"), result.verification.steps.map(translateText));
  renderTextList(get("escalations"), result.escalationConditions.map(translateEscalation));

  const blockers = selectBlockers({ description, godotVersion: "4.x" }, result);
  get("blocker-count").textContent = `${blockers.length} / 3`;
  const blockerCards = get("blocker-cards");
  if (blockers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "blocker-empty";
    empty.textContent = "No strongly related blockers were found. Continue with the current verification plan.";
    blockerCards.replaceChildren(empty);
  } else {
    blockerCards.replaceChildren(...blockers.map((match, index) => makeBlockerCard(match, index, displayDescription, result)));
  }
};

for (const fixture of taskFixtures) {
  const display = getFixtureDisplayCopy(fixture.id, {
    label: fixture.label,
    description: fixture.input.description,
  });
  const option = document.createElement("option");
  option.value = fixture.id;
  option.textContent = `${fixture.difficulty.toUpperCase()} · ${display.label}`;
  fixtureSelect.append(option);
}

get("fixture-count").textContent = `(${taskFixtures.length})`;

const selectFixture = (id: string) => {
  const fixture = taskFixtures.find((candidate) => candidate.id === id) ?? taskFixtures[0];
  const display = getFixtureDisplayCopy(fixture.id, {
    label: fixture.label,
    description: fixture.input.description,
  });
  fixtureSelect.value = fixture.id;
  taskInput.value = display.description;
  renderResult(analyzeTask(fixture.input), fixture.input.description, display.description);
};

fixtureSelect.addEventListener("change", () => {
  if (fixtureSelect.value !== "custom") selectFixture(fixtureSelect.value);
});
taskInput.addEventListener("input", () => {
  const selectedFixture = taskFixtures.find((candidate) => candidate.id === fixtureSelect.value);
  const selectedDisplay = selectedFixture
    ? getFixtureDisplayCopy(selectedFixture.id, {
      label: selectedFixture.label,
      description: selectedFixture.input.description,
    })
    : undefined;
  if (!selectedFixture || taskInput.value !== selectedDisplay?.description) {
    fixtureSelect.value = "custom";
  }
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const displayDescription = taskInput.value;
  const fixture = taskFixtures.find((candidate) => {
    const display = getFixtureDisplayCopy(candidate.id, {
      label: candidate.label,
      description: candidate.input.description,
    });
    return display.description === displayDescription;
  });
  const description = fixture?.input.description ?? displayDescription;
  renderResult(analyzeTask(fixture?.input ?? { description, godotVersion: "4.x" }), description, displayDescription);
});

selectFixture(taskFixtures[0].id);
