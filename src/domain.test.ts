import { describe, expect, it } from "vitest";
import { taskCategories } from "./domain";
import { sampleRecommendation } from "./sample";

describe("M0 domain contract", () => {
  it("defines all eleven Godot task categories", () => {
    expect(taskCategories).toHaveLength(11);
    expect(new Set(taskCategories).size).toBe(taskCategories.length);
  });

  it("keeps verification guidance attached to a recommendation", () => {
    expect(sampleRecommendation.verificationSteps.length).toBeGreaterThan(0);
    expect(sampleRecommendation.rationale.length).toBeGreaterThan(0);
  });
});

