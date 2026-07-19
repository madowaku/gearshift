import { describe, expect, it } from "vitest";
import { analyzeTask } from "./analyzer";
import { godotBlockers, selectBlockers } from "./blockers";
import { taskFixtures } from "./fixtures";

const fixture = (id: string) => {
  const value = taskFixtures.find((candidate) => candidate.id === id);
  if (!value) throw new Error(`Missing fixture: ${id}`);
  return value;
};

const blockerIdsFor = (id: string) => {
  const taskFixture = fixture(id);
  return selectBlockers(taskFixture.input, analyzeTask(taskFixture.input)).map((match) => match.blocker.id);
};

describe("Godot Blocker Guide", () => {
  it("defines at least twelve complete blockers", () => {
    expect(godotBlockers.length).toBeGreaterThanOrEqual(12);
    for (const blocker of godotBlockers) {
      expect(blocker.id).not.toBe("");
      expect(blocker.family).not.toBe("");
      expect(blocker.firstSteps.length).toBeGreaterThan(0);
      expect(blocker.commonPitfalls.length).toBeGreaterThan(0);
      expect(blocker.verificationSteps.length).toBeGreaterThan(0);
      expect(blocker.stopConditions.length).toBeGreaterThan(0);
      expect(blocker.safeCodexPrompt).not.toBe("");
    }
  });

  it("shows a Signal blocker for duplicate Signal calls", () => {
    expect(blockerIdsFor("signal-twice")).toContain("signal-duplicate");
  });

  it("shows connection and input guidance when a button does not respond", () => {
    const ids = blockerIdsFor("button-no-response");
    expect(ids).toContain("signal-connection");
    expect(ids).toContain("input-map-registration");
  });

  it("shows state ownership guidance when score disappears across scenes", () => {
    const ids = blockerIdsFor("score-lost-on-scene-change");
    expect(ids.some((id) => id === "autoload-state" || id === "scene-transition-state")).toBe(true);
  });

  it("shows save compatibility guidance for a legacy save failure", () => {
    expect(blockerIdsFor("legacy-save-load")).toContain("save-compatibility");
  });

  it("shows Anchor and Container guidance for responsive UI breakage", () => {
    expect(blockerIdsFor("responsive-ui-break")).toContain("ui-anchor-container");
  });

  it("shows file path or export guidance for an Android-only failure", () => {
    const ids = blockerIdsFor("android-file-missing");
    expect(ids.some((id) => id === "resource-file-path" || id === "exported-build-only")).toBe(true);
  });

  it("shows collision guidance for wall tunneling", () => {
    expect(blockerIdsFor("wall-tunneling")).toContain("collision-layer-mask");
  });

  it("limits results to three relevant blockers", () => {
    const taskFixture = fixture("android-file-missing");
    const matches = selectBlockers(taskFixture.input, analyzeTask(taskFixture.input), 99);
    expect(matches.length).toBeLessThanOrEqual(3);
  });

  it("returns the same ordered blockers for the same input", () => {
    const taskFixture = fixture("signal-twice");
    const analysis = analyzeTask(taskFixture.input);
    expect(selectBlockers(taskFixture.input, analysis)).toEqual(selectBlockers(taskFixture.input, analysis));
  });

  it("builds a non-empty safe prompt with verification and safety boundaries", () => {
    const taskFixture = fixture("legacy-save-load");
    const [match] = selectBlockers(taskFixture.input, analyzeTask(taskFixture.input));
    expect(match.safeCodexPrompt).toContain("実装後に必要な検証");
    expect(match.safeCodexPrompt).toContain("推測で破壊的変更をしない");
    expect(match.safeCodexPrompt).toContain("GitHubへのpush、fileの削除、大規模なrefactorは行わない");
    expect(match.safeCodexPrompt.trim().length).toBeGreaterThan(100);
  });

  it.each(taskFixtures.filter((taskFixture) => taskFixture.expectedBlockerIds))(
    "keeps expected blocker coverage for $id",
    (taskFixture) => {
      const ids = blockerIdsFor(taskFixture.id);
      for (const expectedId of taskFixture.expectedBlockerIds ?? []) {
        expect(ids).toContain(expectedId);
      }
    },
  );

  it.each(taskFixtures.filter((taskFixture) => taskFixture.expectedTopBlocker))(
    "ranks the calibrated Top 1 blocker for $id",
    (taskFixture) => {
      const analysis = analyzeTask(taskFixture.input);
      const matches = selectBlockers(taskFixture.input, analysis);
      expect(matches[0]?.blocker.id).toBe(taskFixture.expectedTopBlocker);
      expect(matches[0]?.safeCodexPrompt.trim().length).toBeGreaterThan(100);
    },
  );

  it("limits beginner-signal results to one blocker per family", () => {
    const taskFixture = fixture("beginner-exported-asset-missing");
    const matches = selectBlockers(taskFixture.input, analyzeTask(taskFixture.input));
    expect(matches.length).toBe(1);
    expect(new Set(matches.map((match) => match.blocker.family)).size).toBe(matches.length);
  });

  it("keeps useful creator guidance when no specific blocker matches", () => {
    const taskFixture = fixture("ui-copy");
    const analysis = analyzeTask(taskFixture.input);
    expect(selectBlockers(taskFixture.input, analysis)).toHaveLength(0);
    expect(analysis.guidance.firstAction).not.toBe("");
    expect(analysis.reasons.length).toBeGreaterThan(0);
  });
});
