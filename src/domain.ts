export const taskCategories = [
  "Gameplay",
  "UI",
  "Scene",
  "Save",
  "Input",
  "Physics",
  "Audio",
  "AI",
  "Performance",
  "Export",
  "Visual Polish",
] as const;

export type TaskCategory = (typeof taskCategories)[number];
export type Rating = "low" | "medium" | "high";
export type ModelProfile = "fast" | "balanced" | "deep";
export type ReasoningLevel = "low" | "medium" | "high";

export interface TaskInput {
  description: string;
  godotVersion: string;
  projectContext?: string;
}

export interface GearshiftRecommendation {
  category: TaskCategory;
  complexity: Rating;
  changeScope: Rating;
  stateRisk: Rating;
  saveCompatibilityImpact: Rating;
  needsVisualCheck: boolean;
  needsPlaytest: boolean;
  modelProfile: ModelProfile;
  reasoningLevel: ReasoningLevel;
  verificationSteps: string[];
  rationale: string[];
}

