import type {
  SubtitleConversationSceneRegistry,
  SubtitleEffectAssignment,
} from "../subtitleEffects/types";

// 聊天场景配置：控制左右消息栏、头像、气泡颜色和消息累计方式。
export const dramaSubtitleConversationScenes = {
  nicknameChat: {
    // 每侧最多保留的历史消息数量。
    maxVisibleMessagesPerSide: 5,
    // 新消息入场动画时长，单位为毫秒。
    entryDurationMs: 180,
    avatarSize: 64,
    messageGap: 10,
    groupGap: 22,
    lanes: {
      left: {
        left: "4%",
        top: "6%",
        width: "44%",
        height: "88%",
      },
      right: {
        right: "4%",
        top: "24%",
        width: "44%",
        height: "70%",
      },
    },
    participants: {
      speaker00: {
        side: "left",
        avatarFallback: "0",
        bubbleColor: "#55b8c5",
        textColor: "#ffffff",
      },
      speaker01: {
        side: "right",
        avatarFallback: "1",
        bubbleColor: "#e65c9c",
        textColor: "#ffffff",
      },
      speaker02: {
        side: "left",
        avatarFallback: "2",
        bubbleColor: "#f0a53b",
        textColor: "#ffffff",
      },
    },
  },
} satisfies SubtitleConversationSceneRegistry;

// 聊天句子的精确匹配配置放在这里。
// 当前主 ASS 没有启用聊天句子，因此先保持为空数组。
export const conversationSubtitleEffectAssignments: SubtitleEffectAssignment[] =
  [];
