import { defineVerticalFlickerMovePreset } from "../../subtitleEffects/timeline";

/**
 * 当前竖排字幕已经逐帧校准好的特效预设。
 *
 * 配置规则：
 * - 不包含具体文字，只保存每个字符槽位的动画参数。
 * - columns 按画面从右向左排列，当前各列槽位数为 6、6、7、5。
 * - atFrame 相对于这句 ASS 字幕的起始帧，不是整个视频的绝对帧。
 * - hiddenWindows 相对于当前字符的 atFrame，用于控制逐帧隐藏。
 * - moveDistance 单位为像素；spacingBefore/spacingAfter 控制竖排上下字距。
 */
export const eurekaLine007FlickerPreset = defineVerticalFlickerMovePreset([
  // 第一列（画面最右），原文字：“就连一起走路”
  {
    defaults: {
      animationDurationInFrames: 24,
    },
    cues: [
      {
        atFrame: 1,
        hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
        moveDistance: 5,
        moveDirection: "right",
      },
      {
        atFrame: 1,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 15,
        moveDirection: "top",
        animationDurationInFrames: 10,
      },
      {
        atFrame: 4,
        hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
        animationDurationInFrames: 16,
        moveDirection: "left",
        moveDistance: 17,
      },
      {
        atFrame: 13,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDirection: "bottom",
        animationDurationInFrames: 12,
        moveDistance: 14,
      },
      {
        atFrame: 19,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 16,
        animationDurationInFrames: 16,
      },
      {
        atFrame: 55,
        moveDirection: "top",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 18,
        animationDurationInFrames: 20,
      },
    ],
  },

  // 第二列，原文字：“也都只觉厌恶”
  {
    cues: [
      {
        atFrame: 62,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 19,
        moveDirection: "right",
        animationDurationInFrames: 16,
      },
      {
        atFrame: 72,
        animationDurationInFrames: 12,
        moveDirection: "bottom",
        moveDistance: 15,
        hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
      },
      {
        atFrame: 75,
        moveDistance: 15,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        animationDurationInFrames: 17,
      },
      {
        atFrame: 77,
        moveDistance: 15,
        animationDurationInFrames: 15,
        moveDirection: "top",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 79,
        animationDurationInFrames: 16,
        moveDistance: 16,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 79,
        animationDurationInFrames: 16,
        moveDistance: 16,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
    ],
  },

  // 第三列，原文字：“但我并不是想要”
  {
    cues: [
      {
        atFrame: 112,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 16,
        moveDirection: "right",
        animationDurationInFrames: 16,
      },
      {
        atFrame: 115,
        animationDurationInFrames: 13,
        moveDirection: "left",
        moveDistance: 20,
        hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
      },
      {
        atFrame: 120,
        moveDistance: 13,
        moveDirection: "top",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        animationDurationInFrames: 16,
      },
      {
        atFrame: 125,
        moveDistance: 13,
        animationDurationInFrames: 16,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 127,
        animationDurationInFrames: 15,
        moveDistance: 14,
        moveDirection: "bottom",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 132,
        animationDurationInFrames: 16,
        moveDistance: 14,
        moveDirection: "left",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 140,
        animationDurationInFrames: 14,
        moveDistance: 13,
        moveDirection: "top",
        // 负数表示与上方字符靠近 3px。
        spacingBefore: -3,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
    ],
  },

  // 第四列（画面最左），原文字：“孤身一人啊”
  {
    cues: [
      {
        atFrame: 158,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 12,
        moveDirection: "top",
        animationDurationInFrames: 14,
      },
      {
        atFrame: 164,
        animationDurationInFrames: 16,
        moveDirection: "left",
        moveDistance: 13,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 170,
        moveDistance: 21,
        moveDirection: "bottom",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        animationDurationInFrames: 16,
      },
      {
        atFrame: 176,
        moveDistance: 13,
        animationDurationInFrames: 16,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 182,
        animationDurationInFrames: 17,
        moveDistance: 15,
        moveDirection: "left",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
    ],
  },
]);
