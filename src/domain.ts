export const taskCategories = [
  "Gameplay",
  "UI",
  "Scene",
  "SaveLoad",
  "Input",
  "Physics",
  "Audio",
  "AI",
  "Performance",
  "Export",
  "VisualPolish",
  "Tooling",
] as const;

export type TaskCategory = (typeof taskCategories)[number];
export type RiskRating = "Low" | "Medium" | "High";
export type ModelProfile = "fast" | "balanced" | "deep";
export type ReasoningLevel = "low" | "medium" | "high";

export interface TaskInput {
  description: string;
  godotVersion?: string;
  projectContext?: string;
}

export interface RiskAssessment {
  implementationRisk: RiskRating;
  gameStateRisk: RiskRating;
  saveCompatibilityRisk: RiskRating;
  regressionRisk: RiskRating;
}

export interface VerificationRequirements {
  automatedTestsRequired: boolean;
  playtestRequired: boolean;
  visualVerificationRequired: boolean;
  saveMigrationCheckRequired: boolean;
  exportCheckRequired: boolean;
  steps: string[];
}

export interface MatchedSignal {
  id: string;
  label: string;
}

export interface WorkflowGuidance {
  title: string;
  summary: string;
  firstAction: string;
}

export interface GearshiftRecommendation {
  categories: TaskCategory[];
  risks: RiskAssessment;
  verification: VerificationRequirements;
  recommendedProfile: ModelProfile;
  reasoningLevel: ReasoningLevel;
  guidance: WorkflowGuidance;
  matchedSignals: MatchedSignal[];
  reasons: string[];
  confidence: number;
  escalationConditions: string[];
}
