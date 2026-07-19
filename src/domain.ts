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
export type CreatorSignalId =
  | "unresponsive_input"
  | "double_trigger"
  | "collision_pass_through"
  | "scene_state_lost"
  | "old_save_unreadable"
  | "responsive_ui_shift"
  | "delayed_turn_action"
  | "intermittent_spawn"
  | "display_only_change"
  | "exported_asset_missing";

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

export interface CreatorSignalMatch {
  id: CreatorSignalId;
  phrases: string[];
  matchedPhrases: string[];
  relatedCategories: TaskCategory[];
  riskImpact: Partial<RiskAssessment>;
  profileImpact: ModelProfile;
  preferredBlockerIds: string[];
  matchedReason: string;
  verification: Partial<Omit<VerificationRequirements, "steps">>;
  steps: string[];
}

export interface GearshiftRecommendation {
  categories: TaskCategory[];
  risks: RiskAssessment;
  verification: VerificationRequirements;
  recommendedProfile: ModelProfile;
  reasoningLevel: ReasoningLevel;
  guidance: WorkflowGuidance;
  matchedSignals: MatchedSignal[];
  creatorSignals: CreatorSignalMatch[];
  reasons: string[];
  confidence: number;
  escalationConditions: string[];
}
