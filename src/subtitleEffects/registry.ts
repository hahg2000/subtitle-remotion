import { chatConversationEffect } from "./chatConversation";
import { plainHorizontalEffect } from "./plainHorizontal";
import type {
  PlainHorizontalEffectAssignment,
  SubtitleEffectRegistry,
} from "./types";
import { verticalFlickerMoveEffect } from "./verticalFlickerMove";

export const subtitleEffectRegistry = {
  plainHorizontal: plainHorizontalEffect,
  verticalFlickerMove: verticalFlickerMoveEffect,
  chatConversation: chatConversationEffect,
} satisfies SubtitleEffectRegistry;

export const defaultSubtitleEffectAssignment: PlainHorizontalEffectAssignment =
  {
    effectId: "plainHorizontal",
    match: {},
  };
