import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import {
  parseDramaAss,
  type DramaSubtitleLine,
  type DramaSubtitlePosition,
  type DramaSubtitleTextStyle,
  type ParseDramaAssOptions,
} from "./parseDramaAss";
import { loadDramaKleeOneFont, loadDramaTitleFont } from "./dramaTitleFont";
import {
  defaultSubtitleEffectAssignment,
  subtitleEffectRegistry,
} from "./subtitleEffects/registry";
import { toCssLength } from "./subtitleEffects/style";
import type {
  ConversationSubtitleEffectDefinition,
  HorizontalSubtitleEffectDefinition,
  SubtitleConversationSceneRegistry,
  SubtitleEffectAssignment,
  SubtitleEffectDefinition,
  SubtitleEffectTimelineRegistry,
  VerticalSubtitleEffectDefinition,
} from "./subtitleEffects/types";

export type DramaSubtitleOverlayProps = {
  assSrc: string;
  rowPositions?: Record<string, DramaSubtitlePosition>;
  rowStyles?: Record<string, DramaSubtitleTextStyle>;
  defaultStyle?: DramaSubtitleTextStyle;
  speakerRows?: ParseDramaAssOptions["speakerRows"];
  speakerStyles?: Record<string, DramaSubtitleTextStyle>;
  effectAssignments?: SubtitleEffectAssignment[];
  effectTimelines?: SubtitleEffectTimelineRegistry;
  conversationScenes?: SubtitleConversationSceneRegistry;
  showSpeaker?: boolean;
};

const OVERLAY_BASE_ROW_POSITIONS: Record<number, DramaSubtitlePosition> = {
  1: { left: 120, top: 388, width: 760 },
  2: { left: 120, top: 516, width: 760 },
  3: { left: 120, top: 672, width: 760 },
};

const OVERLAY_BASE_STYLE: DramaSubtitleTextStyle = {
  color: "#1f2937",
  fontSize: 62,
  fontFamily:
    "Microsoft YaHei, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  fontWeight: 700,
  lineHeight: 1.25,
  outlineColor: "#ffffff",
  outlineWidth: 4,
  textAlign: "left",
  whiteSpace: "normal",
  overflowWrap: "break-word",
  wordBreak: "normal",
};

const EMPTY_TIMELINES: SubtitleEffectTimelineRegistry = {};
const EMPTY_CONVERSATION_SCENES: SubtitleConversationSceneRegistry = {};

type ResolvedSubtitleLine = {
  line: DramaSubtitleLine;
  assignment: SubtitleEffectAssignment;
  definition: SubtitleEffectDefinition;
};

type ResolvedHorizontalSubtitle = ResolvedSubtitleLine & {
  definition: HorizontalSubtitleEffectDefinition;
};

type ResolvedVerticalSubtitle = ResolvedSubtitleLine & {
  definition: VerticalSubtitleEffectDefinition;
};

type ResolvedConversationScene = {
  sceneId: string;
  definition: ConversationSubtitleEffectDefinition;
  lines: ResolvedSubtitleLine[];
  startFrame: number;
  endFrame: number;
};

const matchesAssignment = (
  line: DramaSubtitleLine,
  assignment: SubtitleEffectAssignment,
): boolean => {
  const { match } = assignment;

  if (match.text !== undefined && match.text !== line.text) {
    return false;
  }

  if (match.speaker !== undefined && match.speaker !== line.speaker) {
    return false;
  }

  if (match.startMs !== undefined && match.startMs !== line.startMs) {
    return false;
  }

  if (match.endMs !== undefined && match.endMs !== line.endMs) {
    return false;
  }

  return true;
};

const getEffectAssignment = (
  line: DramaSubtitleLine,
  assignments: SubtitleEffectAssignment[] | undefined,
): SubtitleEffectAssignment => {
  const matches =
    assignments
      ?.map((assignment, index) => ({ assignment, index }))
      .filter(({ assignment }) => matchesAssignment(line, assignment)) ?? [];

  if (matches.length > 1) {
    const descriptions = matches
      .map(({ assignment, index }) => `#${index} ${assignment.effectId}`)
      .join(", ");

    throw new Error(
      `Subtitle "${line.text}" (${line.startMs}-${line.endMs}ms) matched multiple effects: ${descriptions}.`,
    );
  }

  return matches[0]?.assignment ?? defaultSubtitleEffectAssignment;
};

const getPositionStyle = (position: DramaSubtitlePosition): CSSProperties => ({
  position: "absolute",
  top: toCssLength(position.top),
  bottom: toCssLength(position.bottom),
  left: toCssLength(position.left),
  right: toCssLength(position.right),
  width: toCssLength(position.width),
  height: toCssLength(position.height),
  maxWidth: toCssLength(position.maxWidth),
  transform: position.transform,
  display: "block",
  pointerEvents: "none",
  ...position.css,
});

const getResolvedTextStyle = ({
  line,
  definition,
  rowStyles,
  defaultStyle,
  speakerStyles,
  assignmentStyle,
}: {
  line: DramaSubtitleLine;
  definition: SubtitleEffectDefinition;
  rowStyles: DramaSubtitleOverlayProps["rowStyles"];
  defaultStyle: DramaSubtitleOverlayProps["defaultStyle"];
  speakerStyles: DramaSubtitleOverlayProps["speakerStyles"];
  assignmentStyle?: DramaSubtitleTextStyle;
}): DramaSubtitleTextStyle => ({
  ...OVERLAY_BASE_STYLE,
  ...defaultStyle,
  ...(rowStyles?.[String(line.row)] ?? {}),
  ...(speakerStyles?.[line.speakerKey ?? ""] ?? {}),
  ...(definition.defaultStyle ?? {}),
  ...(assignmentStyle ?? {}),
});

const DramaHorizontalSubtitleItem: React.FC<{
  item: ResolvedHorizontalSubtitle;
  frame: number;
  rowPositions: DramaSubtitleOverlayProps["rowPositions"];
  rowStyles: DramaSubtitleOverlayProps["rowStyles"];
  defaultStyle: DramaSubtitleOverlayProps["defaultStyle"];
  speakerStyles: DramaSubtitleOverlayProps["speakerStyles"];
  effectTimelines: SubtitleEffectTimelineRegistry;
  showSpeaker: boolean;
}> = ({
  item,
  frame,
  rowPositions,
  rowStyles,
  defaultStyle,
  speakerStyles,
  effectTimelines,
  showSpeaker,
}) => {
  const { fps } = useVideoConfig();
  const { line, assignment, definition } = item;

  if (definition.kind !== "horizontal") {
    throw new Error(
      `Horizontal subtitle received "${definition.kind}" effect "${definition.effectId}".`,
    );
  }

  const assignmentPosition =
    "position" in assignment ? assignment.position : undefined;
  const position: DramaSubtitlePosition = {
    ...(OVERLAY_BASE_ROW_POSITIONS[line.row] ?? OVERLAY_BASE_ROW_POSITIONS[1]),
    ...(rowPositions?.[String(line.row)] ?? {}),
    ...(definition.defaultPosition ?? {}),
    ...(assignmentPosition ?? {}),
  };
  const textStyle = getResolvedTextStyle({
    line,
    definition,
    rowStyles,
    defaultStyle,
    speakerStyles,
    assignmentStyle: assignment.style,
  });
  const content = definition.render(
    {
      line,
      frame,
      fps,
      showSpeaker,
      textStyle,
    },
    assignment,
    effectTimelines,
  );

  return <div style={getPositionStyle(position)}>{content}</div>;
};

const DramaVerticalSubtitleItem: React.FC<{
  item: ResolvedVerticalSubtitle;
  frame: number;
  rowPositions: DramaSubtitleOverlayProps["rowPositions"];
  rowStyles: DramaSubtitleOverlayProps["rowStyles"];
  defaultStyle: DramaSubtitleOverlayProps["defaultStyle"];
  speakerStyles: DramaSubtitleOverlayProps["speakerStyles"];
  effectTimelines: SubtitleEffectTimelineRegistry;
  showSpeaker: boolean;
}> = ({
  item,
  frame,
  rowPositions,
  rowStyles,
  defaultStyle,
  speakerStyles,
  effectTimelines,
  showSpeaker,
}) => {
  const { fps } = useVideoConfig();
  const { line, assignment, definition } = item;

  if (definition.kind !== "vertical") {
    throw new Error(
      `Vertical subtitle received "${definition.kind}" effect "${definition.effectId}".`,
    );
  }

  const assignmentPosition =
    "position" in assignment ? assignment.position : undefined;
  const position: DramaSubtitlePosition = {
    ...(OVERLAY_BASE_ROW_POSITIONS[line.row] ?? OVERLAY_BASE_ROW_POSITIONS[1]),
    ...(rowPositions?.[String(line.row)] ?? {}),
    ...(definition.defaultPosition ?? {}),
    ...(assignmentPosition ?? {}),
  };
  const textStyle = getResolvedTextStyle({
    line,
    definition,
    rowStyles,
    defaultStyle,
    speakerStyles,
    assignmentStyle: assignment.style,
  });
  const content = definition.render(
    {
      line,
      frame,
      fps,
      showSpeaker,
      textStyle,
    },
    assignment,
    effectTimelines,
  );

  return <div style={getPositionStyle(position)}>{content}</div>;
};

const getConversationScenes = (
  resolvedLines: ResolvedSubtitleLine[],
): ResolvedConversationScene[] => {
  const groups = new Map<
    string,
    {
      definition: ConversationSubtitleEffectDefinition;
      lines: ResolvedSubtitleLine[];
    }
  >();

  for (const item of resolvedLines) {
    if (item.definition.kind !== "conversation") {
      continue;
    }

    if (!("sceneId" in item.assignment) || !item.assignment.sceneId) {
      throw new Error(
        `Conversation effect "${item.definition.effectId}" requires a sceneId for "${item.line.text}".`,
      );
    }

    const existing = groups.get(item.assignment.sceneId);

    if (existing && existing.definition.effectId !== item.definition.effectId) {
      throw new Error(
        `Conversation scene "${item.assignment.sceneId}" mixes effects "${existing.definition.effectId}" and "${item.definition.effectId}".`,
      );
    }

    if (existing) {
      existing.lines.push(item);
    } else {
      groups.set(item.assignment.sceneId, {
        definition: item.definition,
        lines: [item],
      });
    }
  }

  return Array.from(groups, ([sceneId, group]) => {
    const startFrame = Math.min(
      ...group.lines.map(({ line }) => line.startFrame),
    );
    const endFrame = Math.max(
      ...group.lines.map(({ line }) => line.startFrame + line.durationInFrames),
    );

    return {
      sceneId,
      definition: group.definition,
      lines: group.lines,
      startFrame,
      endFrame,
    };
  });
};

export const DramaSubtitleOverlay: React.FC<DramaSubtitleOverlayProps> = ({
  assSrc,
  rowPositions,
  rowStyles,
  defaultStyle,
  speakerRows,
  speakerStyles,
  effectAssignments,
  effectTimelines = EMPTY_TIMELINES,
  conversationScenes = EMPTY_CONVERSATION_SCENES,
  showSpeaker = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [assText, setAssText] = useState<string | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender("Loading drama subtitle ASS"));

  useEffect(() => {
    let isMounted = true;

    const assTextPromise = fetch(staticFile(assSrc)).then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load drama subtitle ASS: ${assSrc}`);
      }

      return response.text();
    });

    Promise.all([assTextPromise, loadDramaTitleFont(), loadDramaKleeOneFont()])
      .then(([text]) => {
        if (isMounted) {
          setAssText(text);
        }

        continueRender(handle);
      })
      .catch((error: unknown) => {
        cancelRender(error instanceof Error ? error : new Error(String(error)));
      });

    return () => {
      isMounted = false;
    };
  }, [assSrc, cancelRender, continueRender, handle]);

  const subtitleLines = useMemo(() => {
    if (!assText) {
      return [];
    }

    return parseDramaAss(assText, {
      fps,
      speakerRows,
    });
  }, [assText, fps, speakerRows]);

  const resolvedLines = useMemo<ResolvedSubtitleLine[]>(
    () =>
      subtitleLines.map((line) => {
        const assignment = getEffectAssignment(line, effectAssignments);
        const definition: SubtitleEffectDefinition =
          subtitleEffectRegistry[assignment.effectId];

        return { line, assignment, definition };
      }),
    [effectAssignments, subtitleLines],
  );

  const activeHorizontalSubtitles = resolvedLines.filter(
    (item): item is ResolvedHorizontalSubtitle =>
      item.definition.kind === "horizontal" &&
      item.line.startFrame <= frame &&
      item.line.startFrame + item.line.durationInFrames > frame,
  );
  const activeVerticalSubtitles = resolvedLines.filter(
    (item): item is ResolvedVerticalSubtitle =>
      item.definition.kind === "vertical" &&
      item.line.startFrame <= frame &&
      item.line.startFrame + item.line.durationInFrames > frame,
  );
  const conversationSceneGroups = useMemo(
    () => getConversationScenes(resolvedLines),
    [resolvedLines],
  );
  const activeConversationScenes = conversationSceneGroups.filter(
    (scene) => scene.startFrame <= frame && scene.endFrame > frame,
  );

  if (
    activeHorizontalSubtitles.length === 0 &&
    activeVerticalSubtitles.length === 0 &&
    activeConversationScenes.length === 0
  ) {
    return null;
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {activeHorizontalSubtitles.map((item) => (
        <DramaHorizontalSubtitleItem
          key={item.line.id}
          item={item}
          frame={frame}
          rowPositions={rowPositions}
          rowStyles={rowStyles}
          defaultStyle={defaultStyle}
          speakerStyles={speakerStyles}
          effectTimelines={effectTimelines}
          showSpeaker={showSpeaker}
        />
      ))}
      {activeVerticalSubtitles.map((item) => (
        <DramaVerticalSubtitleItem
          key={item.line.id}
          item={item}
          frame={frame}
          rowPositions={rowPositions}
          rowStyles={rowStyles}
          defaultStyle={defaultStyle}
          speakerStyles={speakerStyles}
          effectTimelines={effectTimelines}
          showSpeaker={showSpeaker}
        />
      ))}
      {activeConversationScenes.map((scene) => {
        const sceneConfig = conversationScenes[scene.sceneId];

        if (!sceneConfig) {
          throw new Error(
            `Missing chat conversation scene "${scene.sceneId}".`,
          );
        }

        const messages = scene.lines
          .filter(({ line }) => line.startFrame <= frame)
          .map(({ line, assignment, definition }) => ({
            line,
            assignment,
            textStyle: getResolvedTextStyle({
              line,
              definition,
              rowStyles,
              defaultStyle,
              speakerStyles,
            }),
          }));

        return (
          <AbsoluteFill key={scene.sceneId}>
            {scene.definition.render({
              sceneId: scene.sceneId,
              frame,
              fps,
              messages,
              sceneConfig,
            })}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
