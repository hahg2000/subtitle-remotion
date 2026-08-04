import type { CSSProperties } from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";
import type {
  DramaSubtitlePosition,
  DramaSubtitleTextStyle,
} from "../parseDramaAss";
import { getTextStyle, toCssLength } from "./style";
import type {
  ChatConversationEffectAssignment,
  ChatConversationParticipant,
  ChatConversationSide,
  ConversationSubtitleEffectDefinition,
  ConversationSubtitleMessage,
} from "./types";

const CONVERSATION_EFFECT_DEFAULT_STYLE: DramaSubtitleTextStyle = {
  color: "#ffffff",
  fontSize: 34,
  fontFamily:
    "Noto Sans SC, Microsoft YaHei, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  fontWeight: 700,
  lineHeight: 1.35,
  outlineWidth: 0,
  textAlign: "left",
  whiteSpace: "normal",
  overflowWrap: "break-word",
  wordBreak: "normal",
};

const DEFAULT_MAX_VISIBLE_MESSAGES = 5;
const DEFAULT_ENTRY_DURATION_MS = 180;
const DEFAULT_AVATAR_SIZE = 64;
const DEFAULT_MESSAGE_GAP = 10;
const DEFAULT_GROUP_GAP = 22;

type ResolvedConversationMessage = {
  message: ConversationSubtitleMessage;
  assignment: ChatConversationEffectAssignment;
  participant: ChatConversationParticipant;
  speakerKey: string;
  showAvatar: boolean;
};

const getPositionStyle = (
  position: DramaSubtitlePosition,
  side: ChatConversationSide,
): CSSProperties => ({
  position: "absolute",
  top: toCssLength(position.top),
  bottom: toCssLength(position.bottom),
  left: toCssLength(position.left),
  right: toCssLength(position.right),
  width: toCssLength(position.width),
  height: toCssLength(position.height),
  maxWidth: toCssLength(position.maxWidth),
  transform: position.transform,
  display: "flex",
  flexDirection: "column",
  alignItems: side === "left" ? "flex-start" : "flex-end",
  justifyContent: position.justifyContent ?? "flex-start",
  pointerEvents: "none",
  ...position.css,
});

const getSpeakerKey = (message: ConversationSubtitleMessage): string => {
  const speakerKey = message.line.speakerKey ?? message.line.speaker;

  if (!speakerKey) {
    throw new Error(
      `Chat subtitle "${message.line.text}" does not have a speaker.`,
    );
  }

  return speakerKey;
};

const resolveMessages = (
  messages: ConversationSubtitleMessage[],
  sceneId: string,
  participants: Record<string, ChatConversationParticipant>,
): ResolvedConversationMessage[] => {
  const sortedMessages = [...messages].sort(
    (left, right) =>
      left.line.startFrame - right.line.startFrame ||
      left.line.id.localeCompare(right.line.id),
  );

  return sortedMessages.map((message, index) => {
    if (message.assignment.effectId !== "chatConversation") {
      throw new Error(
        `Conversation scene "${sceneId}" received incompatible effect "${message.assignment.effectId}".`,
      );
    }

    if (message.assignment.sceneId !== sceneId) {
      throw new Error(
        `Conversation scene "${sceneId}" received a message for "${message.assignment.sceneId}".`,
      );
    }

    const speakerKey = getSpeakerKey(message);
    const participant = participants[speakerKey];

    if (!participant) {
      throw new Error(
        `Missing chat participant "${speakerKey}" in scene "${sceneId}".`,
      );
    }

    const previousMessage = sortedMessages[index - 1];
    const previousSpeakerKey = previousMessage
      ? getSpeakerKey(previousMessage)
      : undefined;

    return {
      message,
      assignment: message.assignment,
      participant,
      speakerKey,
      showAvatar: previousSpeakerKey !== speakerKey,
    };
  });
};

const Avatar: React.FC<{
  participant: ChatConversationParticipant;
  speakerKey: string;
  size: string;
  visible: boolean;
}> = ({ participant, speakerKey, size, visible }) => {
  const commonStyle: CSSProperties = {
    width: size,
    height: size,
    flex: `0 0 ${size}`,
    borderRadius: "50%",
  };

  if (!visible) {
    return <div style={commonStyle} />;
  }

  if (participant.avatarSrc) {
    return (
      <Img
        src={staticFile(participant.avatarSrc)}
        style={{
          ...commonStyle,
          objectFit: "cover",
          border: "3px solid rgba(255, 255, 255, 0.92)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.24)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        ...commonStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        color: participant.textColor,
        backgroundColor: participant.bubbleColor,
        border: "3px solid rgba(255, 255, 255, 0.92)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.24)",
        fontSize: 24,
        fontWeight: 800,
        lineHeight: 1,
      }}
    >
      {participant.avatarFallback ?? speakerKey.slice(0, 1).toUpperCase()}
    </div>
  );
};

const ConversationMessage: React.FC<{
  item: ResolvedConversationMessage;
  frame: number;
  fps: number;
  entryDurationMs: number;
  avatarSize: string;
  marginTop: string;
}> = ({ item, frame, fps, entryDurationMs, avatarSize, marginTop }) => {
  const { line } = item.message;
  const side = item.participant.side;
  const relativeFrame = frame - line.startFrame;
  const entryDurationFrames = Math.max(
    1,
    Math.round((entryDurationMs / 1000) * fps),
  );
  const progress = interpolate(
    relativeFrame,
    [0, entryDurationFrames],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const translateX = interpolate(
    progress,
    [0, 1],
    [side === "left" ? -18 : 18, 0],
  );
  const scale = interpolate(progress, [0, 1], [0.96, 1]);
  const bubbleStyle = item.assignment.bubbleStyle;
  const textStyle: DramaSubtitleTextStyle = {
    ...item.message.textStyle,
    color: item.participant.textColor,
    ...item.assignment.style,
  };
  const borderWidth = toCssLength(bubbleStyle?.borderWidth ?? 2);
  const borderColor =
    bubbleStyle?.borderColor ??
    item.participant.borderColor ??
    "rgba(23, 33, 38, 0.86)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: side === "left" ? "row" : "row-reverse",
        alignItems: "flex-start",
        gap: 14,
        width: "100%",
        marginTop,
        opacity: progress,
        transform: `translate3d(${translateX}px, 0, 0) scale(${scale})`,
        transformOrigin: side === "left" ? "left center" : "right center",
      }}
    >
      <Avatar
        participant={item.participant}
        speakerKey={item.speakerKey}
        size={avatarSize}
        visible={item.showAvatar}
      />
      <div
        style={{
          ...getTextStyle(textStyle),
          boxSizing: "border-box",
          width: "fit-content",
          maxWidth: toCssLength(bubbleStyle?.maxWidth) ?? "78%",
          padding: toCssLength(bubbleStyle?.padding) ?? "12px 18px",
          color: textStyle.color,
          backgroundColor:
            bubbleStyle?.backgroundColor ?? item.participant.bubbleColor,
          border: `${borderWidth} solid ${borderColor}`,
          borderRadius: toCssLength(bubbleStyle?.borderRadius) ?? "14px",
          boxShadow: bubbleStyle?.boxShadow ?? "0 3px 10px rgba(0, 0, 0, 0.22)",
        }}
      >
        {line.text}
      </div>
    </div>
  );
};

export const chatConversationEffect = {
  effectId: "chatConversation",
  kind: "conversation",
  defaultPosition: undefined,
  defaultStyle: CONVERSATION_EFFECT_DEFAULT_STYLE,
  render: (context) => {
    const { sceneId, sceneConfig, frame, fps, messages } = context;
    const maxVisibleMessages =
      sceneConfig.maxVisibleMessagesPerSide ?? DEFAULT_MAX_VISIBLE_MESSAGES;
    const entryDurationMs =
      sceneConfig.entryDurationMs ?? DEFAULT_ENTRY_DURATION_MS;

    if (!Number.isInteger(maxVisibleMessages) || maxVisibleMessages <= 0) {
      throw new Error(
        `Invalid maxVisibleMessagesPerSide for chat scene "${sceneId}": ${maxVisibleMessages}.`,
      );
    }

    if (!Number.isFinite(entryDurationMs) || entryDurationMs <= 0) {
      throw new Error(
        `Invalid entryDurationMs for chat scene "${sceneId}": ${entryDurationMs}.`,
      );
    }

    const avatarSize = toCssLength(
      sceneConfig.avatarSize ?? DEFAULT_AVATAR_SIZE,
    ) as string;
    const messageGap = toCssLength(
      sceneConfig.messageGap ?? DEFAULT_MESSAGE_GAP,
    ) as string;
    const groupGap = toCssLength(
      sceneConfig.groupGap ?? DEFAULT_GROUP_GAP,
    ) as string;
    const resolvedMessages = resolveMessages(
      messages,
      sceneId,
      sceneConfig.participants,
    );

    return (
      <>
        {(["left", "right"] as const).map((side) => {
          const visibleMessages = resolvedMessages
            .filter((item) => item.participant.side === side)
            .slice(-maxVisibleMessages)
            .map((item, index) => ({
              ...item,
              showAvatar: index === 0 ? true : item.showAvatar,
            }));

          return (
            <div
              key={`${sceneId}-${side}`}
              style={getPositionStyle(sceneConfig.lanes[side], side)}
            >
              {visibleMessages.map((item, index) => (
                <ConversationMessage
                  key={item.message.line.id}
                  item={item}
                  frame={frame}
                  fps={fps}
                  entryDurationMs={entryDurationMs}
                  avatarSize={avatarSize}
                  marginTop={
                    index === 0
                      ? "0px"
                      : item.showAvatar
                        ? groupGap
                        : messageGap
                  }
                />
              ))}
            </div>
          );
        })}
      </>
    );
  },
} satisfies ConversationSubtitleEffectDefinition;
