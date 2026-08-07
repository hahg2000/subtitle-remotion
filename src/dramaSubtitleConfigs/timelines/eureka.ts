import { bindVerticalTextToPreset } from "../../subtitleEffects/timeline";
import { dramaSubtitleAssLines } from "../assLines";
import { eurekaLine007FlickerPreset } from "../presets/eurekaLine007FlickerPreset";
import {
  defineAutoVerticalFlickerMoveTimeline,
  defineDramaVerticalTimelineConfig,
} from "./helpers";
import type {
  AutoVerticalTimelineOptions,
  DramaVerticalTimelineConfig,
} from "./helpers";
import { eurekaCharacterProfiles } from "./eurekaMotionProfiles";

type EurekaTimelineOptions = Omit<
  AutoVerticalTimelineOptions,
  "line" | "columns"
>;

type EurekaAutoLineConfig = Pick<
  DramaVerticalTimelineConfig,
  "lineId" | "position" | "style" | "effectOptions"
> & {
  columns: string[];
  timelineOptions?: EurekaTimelineOptions;
};

const defineCharacterProfileTimeline = (
  lineId: keyof typeof eurekaCharacterProfiles,
): EurekaTimelineOptions => ({
  animationDurationInFrames: 16,
  moveDirections: ["bottom"],
  moveDistance: 25,
  columnMotionProfiles: eurekaCharacterProfiles[lineId],
});

const EUREKA_BLUE_COMPACT_TRANSLATION_POSITION = {
  right: "54%",
  top: "15%",
  width: "40%",
  height: "100%",
} satisfies NonNullable<DramaVerticalTimelineConfig["position"]>;

const EUREKA_ORANGE_WIDE_TRANSLATION_POSITION = {
  right: "5%",
  top: "10%",
  width: "90%",
  height: "90%",
} satisfies NonNullable<DramaVerticalTimelineConfig["position"]>;

const EUREKA_ORANGE_RIGHT_TRANSLATION_POSITION = {
  // 原日文位于画面最右侧，中文整组放在它左边，避免两组竖排相互覆盖。
  right: "30%",
  top: "10%",
  width: "40%",
  height: "90%",
} satisfies NonNullable<DramaVerticalTimelineConfig["position"]>;

const EUREKA_ORANGE_LEFT_TRANSLATION_POSITION = {
  right: "62%",
  top: "10%",
  width: "40%",
  height: "90%",
} satisfies NonNullable<DramaVerticalTimelineConfig["position"]>;

const defineEurekaAutoLine = ({
  lineId,
  columns,
  position,
  style,
  effectOptions,
  timelineOptions = {},
}: EurekaAutoLineConfig): DramaVerticalTimelineConfig =>
  defineDramaVerticalTimelineConfig({
    lineId,
    timelineId: `${lineId}VerticalFlicker`,
    timeline: defineAutoVerticalFlickerMoveTimeline({
      ...timelineOptions,
      line: dramaSubtitleAssLines[lineId],
      columns,
    }),
    position,
    style,
    effectOptions,
  });

const eurekaLine007Columns = [
  "就连一起走路",
  "也都只觉厌恶",
  "但我并不是想要",
  "孤身一人啊",
];

const eurekaLine007Timeline = bindVerticalTextToPreset({
  preset: eurekaLine007FlickerPreset,
  columns: eurekaLine007Columns,
});

const eurekaLine007Config = defineDramaVerticalTimelineConfig({
  lineId: "line007",
  timelineId: "line007VerticalFlicker",
  timeline: eurekaLine007Timeline,
  style: {
    letterSpacing: 4,
  },
  position: {
    right: "12%",
    top: "6%",
    width: "50%",
    height: "85%",
  },
});

/**
 * 《Eureka》output-zh.ass 的完整竖排字幕配置。
 *
 * - columns 按画面从右向左排列。
 * - timelineOptions 配置整句自动时间轴。
 * - profile 句的逐字出现帧与动画参数统一保存在 eurekaMotionProfiles.ts。
 * - timelineOptions.cueOverrides[列索引][字索引] 可覆盖单字参数。
 * - line007 保留从参考图片序列人工逐帧校准的 preset。
 */
export const eurekaVerticalTimelineConfigs = [
  defineEurekaAutoLine({
    lineId: "line001",
    columns: ["怎样做一个温柔的人"],
    position: {
      right: "10%",
      top: "8.5%",
      width: "40%",
      height: "100%",
    },
    timelineOptions: defineCharacterProfileTimeline("line001"),
  }),
  defineEurekaAutoLine({
    lineId: "line002",
    position: {
      right: "10%",
      top: "6.8%",
      width: "40%",
      height: "100%",
    },
    columns: ["希望有谁能告诉我"],
    timelineOptions: defineCharacterProfileTimeline("line002"),
  }),
  defineEurekaAutoLine({
    lineId: "line003",
    columns: ["如何做一个可靠的人"],
    position: {
      right: "10%",
      top: "8.5%",
      width: "40%",
      height: "100%",
    },
    timelineOptions: defineCharacterProfileTimeline("line003"),
  }),
  defineEurekaAutoLine({
    lineId: "line004",
    columns: ["希望有谁能告诉我"],
    position: {
      right: "10%",
      top: "6.8%",
      width: "40%",
      height: "100%",
    },
    timelineOptions: defineCharacterProfileTimeline("line004"),
  }),
  defineEurekaAutoLine({
    lineId: "line005",
    columns: [
      "不去打起雨伞",
      "只待将自己淋湿",
      "就连自己的",
      "存在也只觉得无所谓",
    ],
    position: {
      right: "54%",
      top: "15%",
      width: "40%",
      height: "100%",
    },
    timelineOptions: defineCharacterProfileTimeline("line005"),
  }),
  defineEurekaAutoLine({
    lineId: "line006",
    // 对应日文四栏：明るさが急に / 怖くなって / 大丈夫じゃないよ / 大丈夫じゃないよ
    columns: ["忽然畏惧", "那份光芒", "可我并非没事啊", "也并非心无所思"],
    position: EUREKA_BLUE_COMPACT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line006"),
  }),
  eurekaLine007Config,
  defineEurekaAutoLine({
    lineId: "line008",
    columns: [
      "就算视线相对",
      "我也无法露出笑容",
      "并不是没问题",
      "这并不是没关系的事情啊",
    ],
    position: EUREKA_BLUE_COMPACT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line008"),
  }),
  defineEurekaAutoLine({
    lineId: "line009",
    columns: [
      "无论几次都被伤害",
      "抉择出错然后失败",
      "大家都蔑视着那份温柔的吧",
      "受尽伤痕原谅对方也被宽恕",
    ],
    position: EUREKA_ORANGE_WIDE_TRANSLATION_POSITION,
    effectOptions: { columnGap: 460 },
    timelineOptions: defineCharacterProfileTimeline("line009"),
  }),
  defineEurekaAutoLine({
    lineId: "line010",
    columns: ["受尽伤痕", "原谅对方也被宽恕", "不是让你继续", "活下去吗"],
    position: EUREKA_ORANGE_WIDE_TRANSLATION_POSITION,
    effectOptions: { columnGap: 460 },
    timelineOptions: defineCharacterProfileTimeline("line010"),
  }),
  defineEurekaAutoLine({
    lineId: "line011",
    columns: ["虽然大家", "都孤身一人", "但这绝非", "只剩孤单"],
    position: EUREKA_ORANGE_RIGHT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line011"),
  }),
  defineEurekaAutoLine({
    lineId: "line012",
    columns: ["只要你", "身处于此", "就绝不孤独"],
    position: EUREKA_ORANGE_LEFT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line012"),
  }),
  defineEurekaAutoLine({
    lineId: "line013",
    columns: ["身旁没有", "他人存在", "大家都明白", "这很寂寞"],
    position: EUREKA_BLUE_COMPACT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line013"),
  }),
  defineEurekaAutoLine({
    lineId: "line014",
    columns: ["陪在某人的身旁", "这种事情", "为何会那么", "做得这么差劲呢"],
    position: EUREKA_BLUE_COMPACT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line014"),
  }),
  defineEurekaAutoLine({
    lineId: "line015",
    columns: ["逐渐习惯了", "堵塞耳朵", "但这并非是要", "封锁内心"],
    position: EUREKA_BLUE_COMPACT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line015"),
  }),
  defineEurekaAutoLine({
    lineId: "line016",
    columns: ["只是装作", "习惯罢了", "并不是没问题", "这并不是没关系的事情啊"],
    position: EUREKA_BLUE_COMPACT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line016"),
  }),
  defineEurekaAutoLine({
    lineId: "line017",
    columns: [
      "无论几次相互碰撞",
      "分崩离析比肩而立",
      "只是寻找",
      "正确形状罢了",
    ],
    position: EUREKA_ORANGE_WIDE_TRANSLATION_POSITION,
    effectOptions: { columnGap: 460 },
    timelineOptions: defineCharacterProfileTimeline("line017"),
  }),
  defineEurekaAutoLine({
    lineId: "line018",
    columns: [
      "互相削除依旧满溢",
      "零落而下",
      "待无法挽回之时",
      "就为时已晚了啊",
    ],
    position: EUREKA_ORANGE_WIDE_TRANSLATION_POSITION,
    effectOptions: { columnGap: 460 },
    timelineOptions: defineCharacterProfileTimeline("line018"),
  }),
  defineEurekaAutoLine({
    lineId: "line019",
    columns: ["不停烦恼", "才终于明白", "人类只靠自己", "是不行的"],
    position: EUREKA_BLUE_COMPACT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line019"),
  }),
  defineEurekaAutoLine({
    lineId: "line020",
    columns: [
      "也不必装作是",
      "没事的模样",
      "并不是没问题",
      "这并不是没关系的事情啊",
    ],
    position: EUREKA_BLUE_COMPACT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line020"),
  }),
  defineEurekaAutoLine({
    lineId: "line021",
    columns: [
      "无论几次都被伤害",
      "抉择出错然后失败",
      "大家都蔑视着",
      "那份温柔的吧",
    ],
    position: EUREKA_ORANGE_WIDE_TRANSLATION_POSITION,
    effectOptions: { columnGap: 460 },
    timelineOptions: defineCharacterProfileTimeline("line021"),
  }),
  defineEurekaAutoLine({
    lineId: "line022",
    columns: ["受尽伤痕", "原谅对方也被宽恕", "不是让你继续", "活下去吗"],
    position: EUREKA_ORANGE_WIDE_TRANSLATION_POSITION,
    effectOptions: { columnGap: 460 },
    timelineOptions: defineCharacterProfileTimeline("line022"),
  }),
  defineEurekaAutoLine({
    lineId: "line023",
    columns: ["虽然大家", "都孤身一人", "但这绝非", "只剩孤单"],
    position: EUREKA_ORANGE_RIGHT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line023"),
  }),
  defineEurekaAutoLine({
    lineId: "line024",
    columns: ["只要你", "身处于此", "就绝不孤独"],
    position: EUREKA_ORANGE_LEFT_TRANSLATION_POSITION,
    timelineOptions: defineCharacterProfileTimeline("line024"),
  }),
] satisfies DramaVerticalTimelineConfig[];
