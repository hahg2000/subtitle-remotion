import type {
  DramaSubtitlePosition,
  DramaSubtitleTextStyle,
} from "../../parseDramaAss";
import {
  defineCharacterColumn,
  defineVerticalFlickerMoveTimeline,
} from "../../subtitleEffects/timeline";
import type {
  SubtitleEffectMatch,
  SubtitleHiddenFrameWindow,
  SubtitleMoveDirection,
  VerticalFlickerMoveCueInput,
  VerticalFlickerMoveOptions,
  VerticalFlickerMoveTimeline,
} from "../../subtitleEffects/types";
import type { DramaSubtitleAssLineId } from "../assLines";

export type DramaVerticalTimelineConfig = {
  lineId: DramaSubtitleAssLineId;
  timelineId: string;
  timeline: VerticalFlickerMoveTimeline;
  position?: DramaSubtitlePosition;
  style?: DramaSubtitleTextStyle;
  effectOptions?: Partial<VerticalFlickerMoveOptions>;
};

export const defineDramaVerticalTimelineConfig = (
  config: DramaVerticalTimelineConfig,
): DramaVerticalTimelineConfig => config;

type CueOverrides = Record<
  number,
  Record<number, Partial<VerticalFlickerMoveCueInput>>
>;

export type AutoVerticalTimelineOptions = {
  line: SubtitleEffectMatch;
  columns: string[];
  fps?: number;
  startFrame?: number;
  endPaddingInFrames?: number;
  animationDurationInFrames?: number;
  hiddenWindows?: SubtitleHiddenFrameWindow[];
  moveDistance?: number;
  moveDirections?: SubtitleMoveDirection[];
  cueOverrides?: CueOverrides;
};

const normalizeVisibleText = (text: string): string =>
  text.replace(/\s+/gu, "");

const validateCueOverrides = (
  columns: string[],
  cueOverrides: CueOverrides,
): void => {
  for (const [columnKey, characterOverrides] of Object.entries(cueOverrides)) {
    const columnIndex = Number(columnKey);

    if (
      !Number.isInteger(columnIndex) ||
      columnIndex < 0 ||
      columnIndex >= columns.length
    ) {
      throw new Error(`Invalid vertical cue override column: ${columnKey}.`);
    }

    const characterCount = Array.from(columns[columnIndex]).length;

    for (const characterKey of Object.keys(characterOverrides)) {
      const characterIndex = Number(characterKey);

      if (
        !Number.isInteger(characterIndex) ||
        characterIndex < 0 ||
        characterIndex >= characterCount
      ) {
        throw new Error(
          `Invalid vertical cue override character: column=${columnIndex}, character=${characterKey}.`,
        );
      }
    }
  }
};

/**
 * 为尚未人工逐帧校准的句子生成可运行的初始时间轴。
 * cueOverrides[columnIndex][characterIndex] 可覆盖任意单字的全部帧参数。
 */
export const defineAutoVerticalFlickerMoveTimeline = ({
  line,
  columns,
  fps = 30,
  startFrame = 1,
  endPaddingInFrames = 8,
  animationDurationInFrames = 16,
  hiddenWindows = [],
  moveDistance = 16,
  moveDirections = ["right", "top", "left", "bottom"],
  cueOverrides = {},
}: AutoVerticalTimelineOptions): VerticalFlickerMoveTimeline => {
  if (
    line.startMs === undefined ||
    line.endMs === undefined ||
    line.text === undefined
  ) {
    throw new Error("Auto vertical timeline requires startMs, endMs and text.");
  }

  if (
    normalizeVisibleText(columns.join("")) !== normalizeVisibleText(line.text)
  ) {
    throw new Error(
      `Vertical columns do not match ASS text: columns="${columns.join("")}", ASS="${line.text}".`,
    );
  }

  if (columns.length === 0 || columns.some((column) => column.length === 0)) {
    throw new Error("Auto vertical timeline requires non-empty columns.");
  }

  if (moveDirections.length === 0) {
    throw new Error(
      "Auto vertical timeline requires at least one move direction.",
    );
  }

  validateCueOverrides(columns, cueOverrides);

  const lineStartFrame = Math.round((line.startMs / 1000) * fps);
  const lineEndFrame = Math.round((line.endMs / 1000) * fps);
  const durationInFrames = lineEndFrame - lineStartFrame;
  const characters = columns.map((column) => Array.from(column));
  const totalCharacters = characters.reduce(
    (total, column) => total + column.length,
    0,
  );
  const lastStartFrame = Math.max(
    startFrame,
    durationInFrames - endPaddingInFrames - animationDurationInFrames,
  );
  let globalCharacterIndex = 0;

  return defineVerticalFlickerMoveTimeline(
    columns.map((text, columnIndex) =>
      defineCharacterColumn({
        text,
        cues: characters[columnIndex].map((_, characterIndex) => {
          const progress =
            totalCharacters <= 1
              ? 0
              : globalCharacterIndex / (totalCharacters - 1);
          const atFrame = Math.round(
            startFrame + (lastStartFrame - startFrame) * progress,
          );
          const moveDirection =
            moveDirections[globalCharacterIndex % moveDirections.length];
          const override = cueOverrides[columnIndex]?.[characterIndex];

          globalCharacterIndex++;

          return {
            atFrame,
            animationDurationInFrames,
            hiddenWindows,
            moveDistance,
            moveDirection,
            ...override,
          };
        }),
      }),
    ),
  );
};
