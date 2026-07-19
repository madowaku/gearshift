import { describe, expect, it } from "vitest";
import { analyzeTask } from "./analyzer";
import { taskCategories } from "./domain";
import { taskFixtures } from "./fixtures";

const fixture = (id: string) => {
  const value = taskFixtures.find((candidate) => candidate.id === id);
  if (!value) throw new Error(`Missing fixture: ${id}`);
  return value;
};

describe("Gearshift deterministic analyzer", () => {
  it("defines the twelve M1 categories", () => {
    expect(taskCategories).toHaveLength(12);
  });

  it.each(taskFixtures)("routes fixture $id to $expectedProfile", (taskFixture) => {
    const result = analyzeTask(taskFixture.input);
    expect(result.recommendedProfile).toBe(taskFixture.expectedProfile);
    expect(result.categories).toEqual(expect.arrayContaining(taskFixture.expectedCategories));

    for (const [check, expected] of Object.entries(taskFixture.expectedChecks)) {
      expect(result.verification[check as keyof typeof taskFixture.expectedChecks]).toBe(expected);
    }
  });

  it("routes an isolated UI copy change to fast", () => {
    expect(analyzeTask(fixture("ui-copy").input).recommendedProfile).toBe("fast");
  });

  it("routes an ordinary feature to balanced", () => {
    expect(analyzeTask(fixture("dash-input").input).recommendedProfile).toBe("balanced");
  });

  it("forces a save format change to deep", () => {
    const result = analyzeTask(fixture("save-migration").input);
    expect(result.recommendedProfile).toBe("deep");
    expect(result.verification.saveMigrationCheckRequired).toBe(true);
  });

  it("forces a cross-state win condition to deep", () => {
    expect(analyzeTask(fixture("cross-layer-win").input).recommendedProfile).toBe("deep");
  });

  it("requires visual verification for a visual change", () => {
    expect(analyzeTask(fixture("bamboo-animation").input).verification.visualVerificationRequired).toBe(true);
  });

  it("requires an export check for an export issue", () => {
    expect(analyzeTask(fixture("android-export").input).verification.exportCheckRequired).toBe(true);
  });

  it("returns the same result for the same input", () => {
    const input = fixture("intermittent-softlock").input;
    expect(analyzeTask(input)).toEqual(analyzeTask(input));
  });

  it("keeps expected results on every fixture", () => {
    expect(taskFixtures.length).toBeGreaterThanOrEqual(12);
    for (const taskFixture of taskFixtures) {
      expect(taskFixture.expectedProfile).toMatch(/^(fast|balanced|deep)$/);
      expect(taskFixture.expectedCategories.length).toBeGreaterThan(0);
    }
  });

  it("returns explainability fields for every analysis", () => {
    const result = analyzeTask(fixture("turn-progression").input);
    expect(result.matchedSignals.length).toBeGreaterThan(0);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.escalationConditions.length).toBeGreaterThan(0);
  });

  it.each([
    ["ui-copy", "そのまま進める"],
    ["dash-input", "確認しながら進める"],
    ["save-migration", "退避して慎重に進める"],
  ])("turns profile guidance for %s into a creator-facing action", (id, title) => {
    const result = analyzeTask(fixture(id).input);
    expect(result.guidance.title).toBe(title);
    expect(result.guidance.firstAction.length).toBeGreaterThan(0);
  });

  it.each(taskFixtures.filter((taskFixture) => taskFixture.expectedCreatorSignal))(
    "calibrates beginner language for $id",
    (taskFixture) => {
      const result = analyzeTask(taskFixture.input);
      expect(result.guidance.title).toBe(taskFixture.expectedGuidance);
      expect(result.creatorSignals.map((signal) => signal.id)).toContain(taskFixture.expectedCreatorSignal);

      for (const [check, expected] of Object.entries(taskFixture.expectedVerificationFlags ?? {})) {
        expect(result.verification[check as keyof typeof result.verification]).toBe(expected);
      }
    },
  );

  it("keeps beginner signal metadata explainable", () => {
    for (const taskFixture of taskFixtures.filter((candidate) => candidate.expectedCreatorSignal)) {
      const signal = analyzeTask(taskFixture.input).creatorSignals.find(
        (candidate) => candidate.id === taskFixture.expectedCreatorSignal,
      );
      expect(signal?.phrases.length).toBeGreaterThan(0);
      expect(signal?.relatedCategories.length).toBeGreaterThan(0);
      expect(signal?.preferredBlockerIds.length).toBeGreaterThan(0);
      expect(signal?.matchedReason).not.toBe("");
    }
  });
});
