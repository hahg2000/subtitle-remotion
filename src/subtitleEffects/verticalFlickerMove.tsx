import { Easing, interpolate } from "remotion";
import type {
  DramaSubtitlePosition,
  DramaSubtitleTextStyle,
} from "../parseDramaAss";
import { getTextStyle, toCssLength, toNumber } from "./style";
import type {
  SubtitleEffectDefinition,
  SubtitleMoveDirection,
  VerticalFlickerMoveCharacterCue,
  VerticalFlickerMoveOptions,
  VerticalFlickerMoveTimeline,
} from "./types";

const VERTICAL_EFFECT_DEFAULT_POSITION: DramaSubtitlePosition = {
  left: "auto",
  right: "28%",
  top: "4%",
  width: "60%",
  height: "92%",
};

const VERTICAL_EFFECT_DEFAULT_STYLE: DramaSubtitleTextStyle = {
  // color: "#f8f9ff",
  color: "#ffffff",
  fontSize: 43,
  fontFamily:
    '"SimSun", "Yu Mincho", "Noto Serif CJK JP", "Noto Serif SC", SimSun, serif',
  fontWeight: 400,
  lineHeight: 1,
  letterSpacing: 8,
  outlineColor: "#4057a6",
  // outlineColor: "#f2e8e8",
  outlineWidth: 1,
  textShadow: [
    "0 0 5px rgba(30, 90, 255, 0.8)",
    "0 0 15px rgba(30, 90, 255, 0.6)",
    " 0 0 30px rgba(20, 60, 200, 0.5)",
    "0 0 60px rgba(10, 40, 150, 0.4)",
  ].join(", "),
};

const RENDERER_FALLBACK_OPTIONS: VerticalFlickerMoveOptions = {
  animationDurationInFrames: 6,
  hiddenWindows: [],
  moveDistance: 64,
  moveDirection: "left",
  columnGap: 48,
};

const MOVE_DIRECTION_VECTORS: Record<
  SubtitleMoveDirection,
  { x: number; y: number }
> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

const getCharacterState = ({
  frame,
  cue,
  lineStartFrame,
  options,
}: {
  frame: number;
  cue: VerticalFlickerMoveCharacterCue;
  lineStartFrame: number;
  options: VerticalFlickerMoveOptions;
}): { visible: boolean; translateX: number; translateY: number } => {
  const cueStartFrame = lineStartFrame + cue.atFrame;
  const relativeFrame = frame - cueStartFrame;

  if (relativeFrame < 0) {
    return { visible: false, translateX: 0, translateY: 0 };
  }

  const animationDurationInFrames =
    cue.animationDurationInFrames ?? options.animationDurationInFrames;

  if (
    !Number.isInteger(animationDurationInFrames) ||
    animationDurationInFrames <= 0
  ) {
    throw new Error(
      `Invalid animationDurationInFrames for character "${cue.text}": ${animationDurationInFrames}. Expected a positive integer.`,
    );
  }

  const hiddenWindows = cue.hiddenWindows ?? options.hiddenWindows;
  const invalidWindow = hiddenWindows.find(
    ({ startFrame, durationInFrames }) =>
      !Number.isInteger(startFrame) ||
      startFrame < 0 ||
      !Number.isInteger(durationInFrames) ||
      durationInFrames <= 0,
  );

  if (invalidWindow) {
    throw new Error(
      `Invalid hidden window for character "${cue.text}": startFrame=${invalidWindow.startFrame}, durationInFrames=${invalidWindow.durationInFrames}. Expected non-negative integer startFrame and positive integer durationInFrames.`,
    );
  }

  const visible = !hiddenWindows.some(
    ({ startFrame, durationInFrames }) =>
      relativeFrame >= startFrame &&
      relativeFrame < startFrame + durationInFrames,
  );
  const progress = interpolate(
    relativeFrame,
    [0, animationDurationInFrames],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const remainingDistance =
    (cue.moveDistance ?? options.moveDistance) * (1 - progress);
  const vector =
    MOVE_DIRECTION_VECTORS[cue.moveDirection ?? options.moveDirection];

  return {
    visible,
    translateX: vector.x * remainingDistance,
    translateY: vector.y * remainingDistance,
  };
};

const VerticalFlickerMoveRenderer: React.FC<{
  timeline: VerticalFlickerMoveTimeline;
  options: VerticalFlickerMoveOptions;
  frame: number;
  lineStartFrame: number;
  textStyle: DramaSubtitleTextStyle;
}> = ({ timeline, options, frame, lineStartFrame, textStyle }) => {
  const columnGap =
    options.columnGap ?? Math.round(toNumber(textStyle.fontSize, 52) * 0.7);

  return (
    <div
      style={{
        ...getTextStyle(textStyle),
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        gap: toCssLength(columnGap),
        width: "100%",
        height: "100%",
        whiteSpace: "pre",
        overflow: "visible",
      }}
    >
      {timeline.columns.map((column, columnIndex) => (
        <div
          key={`vertical-column-${columnIndex}`}
          style={{
            writingMode: "vertical-rl",
            textOrientation: "upright",
            flex: "0 0 auto",
          }}
        >
          {column.cues.map((cue, cueIndex) => {
            const state = getCharacterState({
              frame,
              cue,
              lineStartFrame,
              options,
            });

            return (
              <span
                key={`vertical-character-${columnIndex}-${cueIndex}`}
                style={{
                  display: "inline-block",
                  visibility: state.visible ? "visible" : "hidden",
                  marginInlineStart: toCssLength(cue.spacingBefore),
                  marginInlineEnd: toCssLength(cue.spacingAfter),
                  transform: `translate3d(${state.translateX}px, ${state.translateY}px, 0)`,
                }}
              >
                {cue.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const verticalFlickerMoveEffect = {
  effectId: "verticalFlickerMove",
  kind: "vertical",
  defaultPosition: VERTICAL_EFFECT_DEFAULT_POSITION,
  defaultStyle: VERTICAL_EFFECT_DEFAULT_STYLE,
  render: (context, assignment, timelines) => {
    if (assignment.effectId !== "verticalFlickerMove") {
      throw new Error(
        `verticalFlickerMove received incompatible effect "${assignment.effectId}".`,
      );
    }

    const timeline = timelines[assignment.timelineId];

    if (!timeline) {
      throw new Error(
        `Missing subtitle timeline "${assignment.timelineId}" for "${context.line.text}".`,
      );
    }

    if (timeline.type !== "verticalFlickerMove") {
      throw new Error(
        `Timeline "${assignment.timelineId}" is not compatible with verticalFlickerMove.`,
      );
    }

    return (
      <VerticalFlickerMoveRenderer
        timeline={timeline}
        options={{
          ...RENDERER_FALLBACK_OPTIONS,
          ...assignment.effectOptions,
        }}
        frame={context.frame}
        lineStartFrame={context.line.startFrame}
        textStyle={context.textStyle}
      />
    );
  },
} satisfies SubtitleEffectDefinition;
