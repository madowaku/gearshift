import "./style.css";
import { sampleInput, sampleRecommendation } from "./sample";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("#app was not found");
}

const label = (value: string) => value.replaceAll("-", " ");

app.innerHTML = `
  <main class="shell">
    <header class="hero">
      <p class="eyebrow">OPENAI BUILD WEEK · M0</p>
      <h1>Codex <span>Gearshift</span></h1>
      <p class="lead">Godot 4.xの実装タスクに合うモデル、推論レベル、検証手順を選ぶためのナビゲーター。</p>
    </header>

    <section class="workspace" aria-label="M0 preview">
      <article class="panel input-panel">
        <div class="panel-heading">
          <p class="step">01 · TASK</p>
          <span class="status">M0 SAMPLE</span>
        </div>
        <h2>実装タスク</h2>
        <p class="task">${sampleInput.description}</p>
        <dl class="facts">
          <div><dt>Engine</dt><dd>Godot ${sampleInput.godotVersion}</dd></div>
          <div><dt>Category</dt><dd>${sampleRecommendation.category}</dd></div>
        </dl>
      </article>

      <article class="panel result-panel">
        <p class="step">02 · ROUTE</p>
        <h2>推奨ギア</h2>
        <div class="gear">${sampleRecommendation.modelProfile.toUpperCase()}</div>
        <p class="reasoning">Reasoning · ${label(sampleRecommendation.reasoningLevel)}</p>
        <div class="risk-grid">
          <div><span>Complexity</span><strong>${label(sampleRecommendation.complexity)}</strong></div>
          <div><span>State risk</span><strong>${label(sampleRecommendation.stateRisk)}</strong></div>
          <div><span>Save impact</span><strong>${label(sampleRecommendation.saveCompatibilityImpact)}</strong></div>
        </div>
      </article>

      <article class="panel verify-panel">
        <p class="step">03 · VERIFY</p>
        <h2>検証シーケンス</h2>
        <ol>
          ${sampleRecommendation.verificationSteps.map((step) => `<li>${step}</li>`).join("")}
        </ol>
        <p class="notice">判定エンジンと入力UIはM1で実装予定です。</p>
      </article>
    </section>
  </main>
`;

