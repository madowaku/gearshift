import "./style.css";
import { analyzeTask } from "./analyzer";
import { selectBlockers } from "./blockers";
import type { BlockerMatch } from "./blockers";
import type { GearshiftRecommendation, RiskAssessment, VerificationRequirements } from "./domain";
import { taskFixtures } from "./fixtures";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) throw new Error("#app was not found");

app.innerHTML = `
  <main class="shell">
    <header class="hero">
      <div>
        <p class="eyebrow">OPENAI BUILD WEEK · M2 BLOCKER GUIDE</p>
        <h1>Codex <span>Gearshift</span></h1>
      </div>
      <p class="lead">Godotの実装タスクから危険信号を拾い、次の進め方と確認手順へ変速します。</p>
    </header>

    <section class="analyzer-layout" aria-label="Gearshift analyzer">
      <form id="task-form" class="panel task-panel">
        <div class="section-heading">
          <div>
            <p class="step">01 · TASK</p>
            <h2>何を変えますか？</h2>
          </div>
          <span class="status">LOCAL · DETERMINISTIC</span>
        </div>

        <label for="fixture-select">サンプルタスク <span id="fixture-count"></span></label>
        <select id="fixture-select"></select>

        <label for="task-input">実装タスク</label>
        <textarea id="task-input" rows="6" required placeholder="例：既存セーブを維持したまま、ターン進行を変更する"></textarea>

        <button type="submit">Analyze task <span aria-hidden="true">→</span></button>
        <p class="privacy-note">入力はブラウザ内だけで分析され、外部へ送信されません。</p>
      </form>

      <section id="result" class="result-stack" aria-live="polite">
        <article class="panel route-panel">
          <div class="section-heading">
            <div>
              <p class="step">02 · NEXT MOVE</p>
              <h2>おすすめの進め方</h2>
            </div>
          </div>
          <div class="guidance-banner">
            <strong id="guidance-title" class="guidance-title"></strong>
            <p id="guidance-summary"></p>
          </div>
          <div class="first-action">
            <span>最初にやること</span>
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
          <h2>詰まりやすいところ</h2>
          <ul id="reasons" class="plain-list"></ul>
          <details>
            <summary>一致した危険信号</summary>
            <ul id="signals" class="signal-list"></ul>
          </details>
        </article>

        <article class="panel verification-panel">
          <p class="step">04 · CHECK</p>
          <h2>次に確認すること</h2>
          <div id="checks" class="check-grid"></div>
          <ol id="steps" class="verification-steps"></ol>
        </article>

        <article class="panel escalation-panel">
          <p class="step">05 · STOP SIGNALS</p>
          <h2>立ち止まって見直す条件</h2>
          <ul id="escalations" class="plain-list"></ul>
        </article>

        <article class="panel blocker-guide-panel">
          <div class="section-heading">
            <div>
              <p class="step">06 · BLOCKER GUIDE</p>
              <h2>この作業で詰まりやすいところ</h2>
            </div>
            <span id="blocker-count" class="status"></span>
          </div>
          <p class="blocker-intro">入力したタスクに強く関係する注意点だけを、最大3件表示します。</p>
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
customOption.textContent = "CUSTOM · 自由入力";
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

const makeBlockerCard = (match: BlockerMatch, index: number) => {
  const details = document.createElement("details");
  details.className = "blocker-card";
  details.open = index === 0;

  const summary = document.createElement("summary");
  const summaryText = document.createElement("span");
  const title = document.createElement("strong");
  title.textContent = match.blocker.title;
  const why = document.createElement("small");
  why.textContent = match.reasons.join(" · ");
  summaryText.append(title, why);
  const relevance = document.createElement("span");
  relevance.className = "relevance";
  relevance.textContent = `関連度 ${match.relevance}`;
  summary.append(summaryText, relevance);

  const body = document.createElement("div");
  body.className = "blocker-body";
  const overview = document.createElement("p");
  overview.className = "blocker-summary";
  overview.textContent = match.blocker.summary;
  const grid = document.createElement("div");
  grid.className = "blocker-grid";
  grid.append(
    makeBlockerSection("最初にやること", match.blocker.firstSteps),
    makeBlockerSection("詰まりやすいところ", match.blocker.commonPitfalls),
    makeBlockerSection("次に確認すること", match.blocker.verificationSteps),
    makeBlockerSection("立ち止まる条件", match.blocker.stopConditions),
  );

  const promptHeading = document.createElement("h3");
  promptHeading.textContent = "Codexへ渡す依頼文";
  const prompt = document.createElement("pre");
  prompt.className = "prompt-box";
  prompt.textContent = match.safeCodexPrompt;
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "copy-button";
  copyButton.textContent = "Copy prompt";
  copyButton.addEventListener("click", async () => {
    try {
      await copyPrompt(match.safeCodexPrompt);
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Copy failed";
    }
  });

  body.append(overview, grid, promptHeading, prompt, copyButton);
  details.append(summary, body);
  return details;
};

const renderResult = (result: GearshiftRecommendation, description: string) => {
  app.dataset.profile = result.recommendedProfile;
  get("guidance-title").textContent = result.guidance.title;
  get("guidance-summary").textContent = result.guidance.summary;
  get("first-action").textContent = result.guidance.firstAction;
  get("profile").textContent = `Internal gear · ${result.recommendedProfile}`;
  get("reasoning").textContent = `Reasoning · ${result.reasoningLevel}`;
  get("confidence").textContent = `Signal confidence · ${Math.round(result.confidence * 100)}%`;

  get("categories").replaceChildren(
    ...result.categories.map((category) => {
      const span = document.createElement("span");
      span.textContent = category;
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

  renderTextList(get("reasons"), result.reasons);
  get("signals").replaceChildren(
    ...result.matchedSignals.map((signal) => {
      const li = document.createElement("li");
      const code = document.createElement("code");
      code.textContent = signal.id;
      const span = document.createElement("span");
      span.textContent = signal.label;
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

  renderTextList(get("steps"), result.verification.steps);
  renderTextList(get("escalations"), result.escalationConditions);

  const blockers = selectBlockers({ description, godotVersion: "4.x" }, result);
  get("blocker-count").textContent = `${blockers.length} / 3`;
  const blockerCards = get("blocker-cards");
  if (blockers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "blocker-empty";
    empty.textContent = "このタスクに強く関連するBlockerはありません。現在の確認手順から進めます。";
    blockerCards.replaceChildren(empty);
  } else {
    blockerCards.replaceChildren(...blockers.map(makeBlockerCard));
  }
};

for (const fixture of taskFixtures) {
  const option = document.createElement("option");
  option.value = fixture.id;
  option.textContent = `${fixture.difficulty.toUpperCase()} · ${fixture.label}`;
  fixtureSelect.append(option);
}

get("fixture-count").textContent = `(${taskFixtures.length})`;

const selectFixture = (id: string) => {
  const fixture = taskFixtures.find((candidate) => candidate.id === id) ?? taskFixtures[0];
  fixtureSelect.value = fixture.id;
  taskInput.value = fixture.input.description;
  renderResult(analyzeTask(fixture.input), fixture.input.description);
};

fixtureSelect.addEventListener("change", () => {
  if (fixtureSelect.value !== "custom") selectFixture(fixtureSelect.value);
});
taskInput.addEventListener("input", () => {
  const selectedFixture = taskFixtures.find((candidate) => candidate.id === fixtureSelect.value);
  if (!selectedFixture || taskInput.value !== selectedFixture.input.description) {
    fixtureSelect.value = "custom";
  }
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const description = taskInput.value;
  renderResult(analyzeTask({ description, godotVersion: "4.x" }), description);
});

selectFixture(taskFixtures[0].id);
