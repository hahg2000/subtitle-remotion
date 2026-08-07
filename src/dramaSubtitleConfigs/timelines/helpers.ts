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

export type VerticalCharacterMotion = Pick<
  VerticalFlickerMoveCueInput,
  | "atFrame"
  | "animationDurationInFrames"
  | "hiddenWindows"
  | "moveDistance"
  | "moveDirection"
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
  columnMotionProfiles?: ReadonlyArray<ReadonlyArray<VerticalCharacterMotion>>;
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
  columnMotionProfiles,
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

  if (
    columnMotionProfiles !== undefined &&
    (columnMotionProfiles.length !== columns.length ||
      columnMotionProfiles.some((profile) => profile.length === 0))
  ) {
    throw new Error(
      `Vertical motion profile mismatch: expected ${columns.length} non-empty column profiles.`,
    );
  }

  validateCueOverrides(columns, cueOverrides);

  const lineStartFrame = Math.round((line.startMs / 1000) * fps);
  const lineEndFrame = Math.round((line.endMs / 1000) * fps);
  const durationInFrames = lineEndFrame - lineStartFrame;

  columnMotionProfiles?.forEach((profile, columnIndex) => {
    profile.forEach(({ atFrame }, characterIndex) => {
      if (
        !Number.isInteger(atFrame) ||
        atFrame < 0 ||
        atFrame >= durationInFrames
      ) {
        throw new Error(
          `Invalid vertical character atFrame: column=${columnIndex}, character=${characterIndex}, atFrame=${atFrame}, lineDuration=${durationInFrames}.`,
        );
      }
    });
  });

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
          const globalProgress =
            totalCharacters <= 1
              ? 0
              : globalCharacterIndex / (totalCharacters - 1);
          const columnProgress =
            characters[columnIndex].length <= 1
              ? 0
              : characterIndex / (characters[columnIndex].length - 1);
          const moveDirection =
            moveDirections[globalCharacterIndex % moveDirections.length];
          const motionProfile = columnMotionProfiles?.[columnIndex];
          const motionProfilePosition = motionProfile
            ? columnProgress * (motionProfile.length - 1)
            : 0;
          const motion = motionProfile
            ? motionProfile[Math.round(motionProfilePosition)]
            : undefined;
          const previousMotion =
            motionProfile?.[Math.floor(motionProfilePosition)];
          const nextMotion = motionProfile?.[Math.ceil(motionProfilePosition)];
          const atFrame =
            previousMotion && nextMotion
              ? Math.round(
                  previousMotion.atFrame +
                    (nextMotion.atFrame - previousMotion.atFrame) *
                      (motionProfilePosition -
                        Math.floor(motionProfilePosition)),
                )
              : Math.round(
                  startFrame + (lastStartFrame - startFrame) * globalProgress,
                );
          const override = cueOverrides[columnIndex]?.[characterIndex];

          globalCharacterIndex++;

          return {
            atFrame,
            animationDurationInFrames,
            hiddenWindows,
            moveDistance,
            moveDirection,
            ...(motion
              ? {
                  animationDurationInFrames: motion.animationDurationInFrames,
                  hiddenWindows: motion.hiddenWindows,
                  moveDistance: motion.moveDistance,
                  moveDirection: motion.moveDirection,
                }
              : undefined),
            ...override,
          };
        }),
      }),
    ),
  );
};
