import type { GearshiftRecommendation, TaskInput } from "./domain";

export const sampleInput: TaskInput = {
  description: "プレイヤーのダッシュを追加し、スタミナ消費をセーブする",
  godotVersion: "4.x",
};

export const sampleRecommendation: GearshiftRecommendation = {
  category: "Gameplay",
  complexity: "medium",
  changeScope: "medium",
  stateRisk: "high",
  saveCompatibilityImpact: "high",
  needsVisualCheck: true,
  needsPlaytest: true,
  modelProfile: "deep",
  reasoningLevel: "high",
  verificationSteps: [
    "既存セーブを複製して移行テストを行う",
    "入力、移動、スタミナ回復の境界値をテストする",
    "実機プレイでアニメーションと操作感を確認する",
  ],
  rationale: [
    "ゲームプレイ状態と入力処理を同時に変更する",
    "新しい永続状態が既存セーブへ影響する",
  ],
};

