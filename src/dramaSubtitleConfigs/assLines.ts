import type { SubtitleEffectMatch } from "../subtitleEffects/types";

/**
 * public/output-zh.ass 的完整句子索引。
 *
 * - 按 ASS 出现顺序编号。
 * - startMs/endMs/text 用于精确匹配，空格数量必须与 ASS 完全一致。
 * - 当前 ASS 的 Name 全部为空，因此这里不配置 speaker。
 */
export const dramaSubtitleAssLines = {
  line001: {
    startMs: 340,
    endMs: 4080,
    text: "怎样做一个温柔的人",
  },
  line002: {
    startMs: 4080,
    endMs: 7660,
    text: "希望有谁能告诉我",
  },
  line003: {
    startMs: 7860,
    endMs: 11600,
    text: "如何做一个可靠的人",
  },
  line004: {
    startMs: 11630,
    endMs: 15530,
    text: "希望有谁能告诉我",
  },
  line005: {
    startMs: 31230,
    endMs: 39000,
    text: "不去打起雨伞 只待将自己淋湿 就连自己的存在也只觉得无所谓",
  },
  line006: {
    startMs: 39030,
    endMs: 46500,
    text: "忽然畏惧那份光芒 可我并非没事啊 也并非心无所思",
  },
  line007: {
    startMs: 47230,
    endMs: 54160,
    text: "就连一起走路也都只觉厌恶 但我并不是想要孤身一人啊",
  },
  line008: {
    startMs: 54760,
    endMs: 63630,
    text: "就算视线相对我也无法露出笑容 并不是没问题 这并不是没关系的事情啊",
  },
  line009: {
    startMs: 65560,
    endMs: 73060,
    text: "无论几次 都被伤害 抉择出错 然后失败 大家都蔑视着那份温柔的吧 受尽伤痕 原谅对方 也被宽恕",
  },
  line010: {
    startMs: 73100,
    endMs: 80730,
    text: "受尽伤痕 原谅对方 也被宽恕 不是让你继续活下去吗",
  },
  line011: {
    startMs: 80760,
    endMs: 84430,
    text: "虽然大家都孤身一人 但这绝非只剩孤单",
  },
  line012: {
    startMs: 84460,
    endMs: 88430,
    text: "只要你身处于此 就绝不孤独",
  },
  line013: {
    startMs: 96060,
    endMs: 103660,
    text: "身旁没有他人存在 大家都明白这很寂寞",
  },
  line014: {
    startMs: 103700,
    endMs: 111160,
    text: "陪在某人的身旁 这种事情 为何会那么做得这么差劲呢",
  },
  line015: {
    startMs: 111960,
    endMs: 118900,
    text: "逐渐习惯了堵塞耳朵  但这并非是要封锁内心",
  },
  line016: {
    startMs: 119630,
    endMs: 128430,
    text: "只是装作习惯罢了  并不是没问题  这并不是没关系的事情啊",
  },
  line017: {
    startMs: 130330,
    endMs: 137900,
    text: "无论几次 相互碰撞 分崩离析 比肩而立 只是寻找正确形状罢了",
  },
  line018: {
    startMs: 137930,
    endMs: 147930,
    text: "互相削除 依旧满溢 零落而下 待无法挽回之时就为时已晚了啊",
  },
  line019: {
    startMs: 161030,
    endMs: 168600,
    text: "不停烦恼才终于明白 人类只靠自己是不行的",
  },
  line020: {
    startMs: 168630,
    endMs: 177860,
    text: "也不必装作是没事的模样 并不是没问题 这并不是没关系的事情啊",
  },
  line021: {
    startMs: 179860,
    endMs: 187330,
    text: "无论几次 都被伤害 抉择出错 然后失败 大家都蔑视着那份温柔的吧",
  },
  line022: {
    startMs: 187360,
    endMs: 195000,
    text: "受尽伤痕 原谅对方 也被宽恕 不是让你继续活下去吗",
  },
  line023: {
    startMs: 195030,
    endMs: 198700,
    text: "虽然大家都孤身一人 但这绝非只剩孤单",
  },
  line024: {
    startMs: 198730,
    endMs: 203400,
    text: "只要你身处于此 就绝不孤独",
  },
} satisfies Record<string, SubtitleEffectMatch>;

export type DramaSubtitleAssLineId = keyof typeof dramaSubtitleAssLines;
