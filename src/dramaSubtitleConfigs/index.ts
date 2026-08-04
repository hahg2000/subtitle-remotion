import type { SubtitleEffectAssignment } from "../subtitleEffects/types";
import { conversationSubtitleEffectAssignments } from "./conversation";
import { horizontalSubtitleEffectAssignments } from "./horizontal";
import { verticalSubtitleEffectAssignments } from "./vertical";

export * from "./conversation";
export * from "./assLines";
export * from "./horizontal";
export * from "./media";
export * from "./vertical";

// 所有句子特效分配统一在这里汇总。
// 每种特效自己的匹配规则仍保留在对应配置文件中。
export const dramaSubtitleEffectAssignments: SubtitleEffectAssignment[] = [
  ...horizontalSubtitleEffectAssignments,
  ...verticalSubtitleEffectAssignments,
  ...conversationSubtitleEffectAssignments,
];
