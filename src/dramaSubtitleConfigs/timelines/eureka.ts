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

type EurekaAutoLineConfig = Pick<
  DramaVerticalTimelineConfig,
  "lineId" | "position" | "style" | "effectOptions"
> & {
  columns: string[];
  timelineOptions?: Omit<AutoVerticalTimelineOptions, "line" | "columns">;
};

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
 * - timelineOptions.cueOverrides[列索引][字索引] 可覆盖单字参数。
 * - line007 保留从参考图片序列人工逐帧校准的 preset。
 */
export const eurekaVerticalTimelineConfigs = [
  defineEurekaAutoLine({
    lineId: "line001",
    columns: ["怎样做一个温柔的人"],
    timelineOptions: {
      moveDirections: ["bottom"],
      cueOverrides: {
        0: {
          0: {
            atFrame: 50,
          },
        },
      },
    },
  }),
  defineEurekaAutoLine({
    lineId: "line002",
    columns: ["希望有谁能告诉我"],
  }),
  defineEurekaAutoLine({
    lineId: "line003",
    columns: ["希望有谁能告诉我"],
  }),
  defineEurekaAutoLine({
    lineId: "line004",
    columns: ["如何做一个可靠的人"],
  }),
  defineEurekaAutoLine({
    lineId: "line005",
    columns: ["不去打起雨伞", "只待将自己淋湿", "就连自己的存在也只觉得无所谓"],
  }),
  defineEurekaAutoLine({
    lineId: "line006",
    columns: ["忽然畏惧那份光芒", "可我并非没事啊", "也并非心无所思"],
  }),
  eurekaLine007Config,
  defineEurekaAutoLine({
    lineId: "line008",
    columns: [
      "就算视线相对我也无法露出笑容",
      "并不是没问题",
      "这并不是没关系的事情啊",
    ],
  }),
  defineEurekaAutoLine({
    lineId: "line009",
    columns: [
      "无论几次",
      "都被伤害",
      "抉择出错",
      "然后失败",
      "大家都蔑视着那份温柔的吧",
      "受尽伤痕",
      "原谅对方",
      "也被宽恕",
    ],
  }),
  defineEurekaAutoLine({
    lineId: "line010",
    columns: ["受尽伤痕", "原谅对方", "也被宽恕", "不是让你继续活下去吗"],
  }),
  defineEurekaAutoLine({
    lineId: "line011",
    columns: ["虽然大家都孤身一人", "但这绝非只剩孤单"],
  }),
  defineEurekaAutoLine({
    lineId: "line012",
    columns: ["只要你身处于此", "就绝不孤独"],
  }),
  defineEurekaAutoLine({
    lineId: "line013",
    columns: ["身旁没有他人存在", "大家都明白这很寂寞"],
  }),
  defineEurekaAutoLine({
    lineId: "line014",
    columns: ["陪在某人的身旁", "这种事情", "为何会那么做得这么差劲呢"],
  }),
  defineEurekaAutoLine({
    lineId: "line015",
    columns: ["逐渐习惯了堵塞耳朵", "但这并非是要封锁内心"],
  }),
  defineEurekaAutoLine({
    lineId: "line016",
    columns: ["只是装作习惯罢了", "并不是没问题", "这并不是没关系的事情啊"],
  }),
  defineEurekaAutoLine({
    lineId: "line017",
    columns: [
      "无论几次",
      "相互碰撞",
      "分崩离析",
      "比肩而立",
      "只是寻找正确形状罢了",
    ],
  }),
  defineEurekaAutoLine({
    lineId: "line018",
    columns: [
      "互相削除",
      "依旧满溢",
      "零落而下",
      "待无法挽回之时就为时已晚了啊",
    ],
  }),
  defineEurekaAutoLine({
    lineId: "line019",
    columns: ["不停烦恼才终于明白", "人类只靠自己是不行的"],
  }),
  defineEurekaAutoLine({
    lineId: "line020",
    columns: [
      "也不必装作是没事的模样",
      "并不是没问题",
      "这并不是没关系的事情啊",
    ],
  }),
  defineEurekaAutoLine({
    lineId: "line021",
    columns: [
      "无论几次",
      "都被伤害",
      "抉择出错",
      "然后失败",
      "大家都蔑视着那份温柔的吧",
    ],
  }),
  defineEurekaAutoLine({
    lineId: "line022",
    columns: ["受尽伤痕", "原谅对方", "也被宽恕", "不是让你继续活下去吗"],
  }),
  defineEurekaAutoLine({
    lineId: "line023",
    columns: ["虽然大家都孤身一人", "但这绝非只剩孤单"],
  }),
  defineEurekaAutoLine({
    lineId: "line024",
    columns: ["只要你身处于此", "就绝不孤独"],
  }),
] satisfies DramaVerticalTimelineConfig[];
