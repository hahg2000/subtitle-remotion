import type {
  DramaSubtitlePosition,
  DramaSubtitleTextStyle,
} from "../parseDramaAss";
import type {
  SubtitleEffectTimelineRegistry,
  VerticalFlickerMoveEffectAssignment,
} from "../subtitleEffects/types";
import { dramaSubtitleAssLines } from "./assLines";
import { eurekaVerticalTimelineConfigs } from "./timelines/eureka";
import { eurekaLine007JapaneseReferenceTimeline } from "./timelines/eurekaLine007JapaneseReference";

const EUREKA_DEFAULT_VERTICAL_POSITION: DramaSubtitlePosition = {
  right: "12%",
  top: "6%",
  width: "50%",
  height: "85%",
};

const EUREKA_DEFAULT_VERTICAL_STYLE: DramaSubtitleTextStyle = {
  letterSpacing: 4,
};

const normalizeVisibleText = (text: string): string =>
  text.replace(/\s+/gu, "");

const assertCompleteVerticalConfiguration = (): void => {
  const assLineIds = Object.keys(dramaSubtitleAssLines).sort();
  const configuredLineIds = eurekaVerticalTimelineConfigs
    .map(({ lineId }) => lineId)
    .sort();
  const timelineIds = eurekaVerticalTimelineConfigs.map(
    ({ timelineId }) => timelineId,
  );

  if (
    assLineIds.length !== configuredLineIds.length ||
    assLineIds.some((lineId, index) => lineId !== configuredLineIds[index])
  ) {
    throw new Error(
      `Vertical timeline coverage mismatch: ASS=${assLineIds.join(",")}; configured=${configuredLineIds.join(",")}.`,
    );
  }

  if (new Set(timelineIds).size !== timelineIds.length) {
    throw new Error("Vertical timelineId values must be unique.");
  }

  for (const { lineId, timeline } of eurekaVerticalTimelineConfigs) {
    const timelineText = timeline.columns
      .flatMap(({ cues }) => cues.map(({ text }) => text))
      .join("");
    const assText = dramaSubtitleAssLines[lineId].text;

    if (normalizeVisibleText(timelineText) !== normalizeVisibleText(assText)) {
      throw new Error(
        `Vertical timeline text mismatch for ${lineId}: timeline="${timelineText}"; ASS="${assText}".`,
      );
    }
  }
};

assertCompleteVerticalConfiguration();

// 每句的 timelineId 对应 timelines/eureka.ts 中的歌曲级配置。
export const dramaSubtitleTimelines: SubtitleEffectTimelineRegistry =
  Object.fromEntries(
    eurekaVerticalTimelineConfigs.map(({ timelineId, timeline }) => [
      timelineId,
      timeline,
    ]),
  );

// 原日文视频的逐帧参数仅用于对照，不参与当前中文字幕渲染。
export const dramaSubtitleReferenceTimelines = {
  line007VerticalFlicker: eurekaLine007JapaneseReferenceTimeline,
} satisfies SubtitleEffectTimelineRegistry;

// output-zh.ass 的全部 24 句都显式使用竖排逐字特效。
export const verticalSubtitleEffectAssignments: VerticalFlickerMoveEffectAssignment[] =
  eurekaVerticalTimelineConfigs.map(
    ({ lineId, timelineId, position, style, effectOptions }) => ({
      match: {
        ...dramaSubtitleAssLines[lineId],
      },
      effectId: "verticalFlickerMove",
      timelineId,
      position: {
        ...EUREKA_DEFAULT_VERTICAL_POSITION,
        ...position,
      },
      style: {
        ...EUREKA_DEFAULT_VERTICAL_STYLE,
        ...style,
      },
      effectOptions,
    }),
  );
