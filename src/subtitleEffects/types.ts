import type { ReactNode } from "react";
import type {
  CssLength,
  DramaSubtitleLine,
  DramaSubtitlePosition,
  DramaSubtitleTextStyle,
} from "../parseDramaAss";

export type SubtitleEffectMatch = {
  text?: string;
  speaker?: string;
  startMs?: number;
  endMs?: number;
};

export type SubtitleEffectKind = "horizontal" | "vertical" | "conversation";

export type SubtitleMoveDirection = "top" | "right" | "bottom" | "left";

export type SubtitleHiddenFrameWindow = {
  startFrame: number;
  durationInFrames: number;
};

export type VerticalFlickerMoveOptions = {
  animationDurationInFrames: number;
  hiddenWindows: SubtitleHiddenFrameWindow[];
  moveDistance: number;
  moveDirection: SubtitleMoveDirection;
  columnGap: CssLength;
};

export type VerticalFlickerMoveCharacterCue = {
  text: string;
  atFrame: number;
  animationDurationInFrames?: number;
  hiddenWindows?: SubtitleHiddenFrameWindow[];
  moveDistance?: number;
  moveDirection?: SubtitleMoveDirection;
  spacingBefore?: CssLength;
  spacingAfter?: CssLength;
};

export type VerticalFlickerMoveCueInput = Omit<
  VerticalFlickerMoveCharacterCue,
  "text"
>;

export type VerticalFlickerMoveCueDefaults = Partial<
  Omit<VerticalFlickerMoveCharacterCue, "text" | "atFrame">
>;

export type VerticalFlickerMovePresetColumn = {
  defaults?: VerticalFlickerMoveCueDefaults;
  cues: VerticalFlickerMoveCueInput[];
};

export type VerticalFlickerMovePreset = {
  columns: VerticalFlickerMovePresetColumn[];
};

export type VerticalFlickerMoveColumn = {
  cues: VerticalFlickerMoveCharacterCue[];
};

export type VerticalFlickerMoveTimeline = {
  type: "verticalFlickerMove";
  columns: VerticalFlickerMoveColumn[];
};

export type SubtitleEffectTimeline = VerticalFlickerMoveTimeline;
export type SubtitleEffectTimelineRegistry = Record<
  string,
  SubtitleEffectTimeline
>;

export type ChatConversationSide = "left" | "right";

export type ChatConversationBubbleStyle = {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: CssLength;
  borderRadius?: CssLength;
  maxWidth?: CssLength;
  padding?: CssLength;
  boxShadow?: string;
};

export type ChatConversationParticipant = {
  side: ChatConversationSide;
  avatarSrc?: string;
  avatarFallback?: string;
  bubbleColor: string;
  textColor: string;
  borderColor?: string;
};

export type ChatConversationSceneConfig = {
  maxVisibleMessagesPerSide?: number;
  entryDurationMs?: number;
  avatarSize?: CssLength;
  messageGap?: CssLength;
  groupGap?: CssLength;
  lanes: Record<ChatConversationSide, DramaSubtitlePosition>;
  participants: Record<string, ChatConversationParticipant>;
};

export type SubtitleConversationSceneRegistry = Record<
  string,
  ChatConversationSceneConfig
>;

type BaseSubtitleEffectAssignment<
  TStyle extends DramaSubtitleTextStyle = DramaSubtitleTextStyle,
> = {
  match: SubtitleEffectMatch;
  style?: TStyle;
};

export type PlainHorizontalEffectAssignment = BaseSubtitleEffectAssignment & {
  effectId: "plainHorizontal";
  position?: DramaSubtitlePosition;
};

export type VerticalFlickerMoveEffectAssignment =
  BaseSubtitleEffectAssignment & {
    effectId: "verticalFlickerMove";
    timelineId: string;
    effectOptions?: Partial<VerticalFlickerMoveOptions>;
    position?: DramaSubtitlePosition;
  };

export type ChatConversationEffectAssignment = BaseSubtitleEffectAssignment & {
  effectId: "chatConversation";
  sceneId: string;
  bubbleStyle?: ChatConversationBubbleStyle;
};

export type SubtitleEffectAssignment =
  | PlainHorizontalEffectAssignment
  | VerticalFlickerMoveEffectAssignment
  | ChatConversationEffectAssignment;

export type SubtitleEffectId = SubtitleEffectAssignment["effectId"];

export type HorizontalSubtitleEffectRenderContext = {
  line: DramaSubtitleLine;
  frame: number;
  fps: number;
  showSpeaker: boolean;
  textStyle: DramaSubtitleTextStyle;
};

export type VerticalSubtitleEffectRenderContext = {
  line: DramaSubtitleLine;
  frame: number;
  fps: number;
  showSpeaker: boolean;
  textStyle: DramaSubtitleTextStyle;
};

export type ConversationSubtitleMessage = {
  line: DramaSubtitleLine;
  assignment: SubtitleEffectAssignment;
  textStyle: DramaSubtitleTextStyle;
};

export type ConversationSubtitleEffectRenderContext = {
  sceneId: string;
  frame: number;
  fps: number;
  messages: ConversationSubtitleMessage[];
  sceneConfig: ChatConversationSceneConfig;
};

type BaseSubtitleEffectDefinition = {
  effectId: SubtitleEffectId;
  kind: SubtitleEffectKind;
  defaultPosition?: DramaSubtitlePosition;
  defaultStyle?: DramaSubtitleTextStyle;
};

export type HorizontalSubtitleEffectDefinition =
  BaseSubtitleEffectDefinition & {
    kind: "horizontal";
    render: (
      context: HorizontalSubtitleEffectRenderContext,
      assignment: SubtitleEffectAssignment,
      timelines: SubtitleEffectTimelineRegistry,
    ) => ReactNode;
  };

export type VerticalSubtitleEffectDefinition = BaseSubtitleEffectDefinition & {
  kind: "vertical";
  render: (
    context: VerticalSubtitleEffectRenderContext,
    assignment: SubtitleEffectAssignment,
    timelines: SubtitleEffectTimelineRegistry,
  ) => ReactNode;
};

export type ConversationSubtitleEffectDefinition =
  BaseSubtitleEffectDefinition & {
    kind: "conversation";
    render: (context: ConversationSubtitleEffectRenderContext) => ReactNode;
  };

export type SubtitleEffectDefinition =
  | HorizontalSubtitleEffectDefinition
  | VerticalSubtitleEffectDefinition
  | ConversationSubtitleEffectDefinition;

export type SubtitleEffectRegistry = Record<
  SubtitleEffectId,
  SubtitleEffectDefinition
>;
