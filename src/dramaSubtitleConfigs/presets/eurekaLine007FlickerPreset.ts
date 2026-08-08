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
        atFrame: 0,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 5,
        moveDirection: "right",
      },
      {
        atFrame: 2,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 10,
        moveDirection: "top",
        animationDurationInFrames: 10,
      },
      {
        atFrame: 5,
        hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
        animationDurationInFrames: 16,
        moveDirection: "left",
        moveDistance: 17,
      },
      {
        atFrame: 14,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDirection: "bottom",
        animationDurationInFrames: 10,
        moveDistance: 14,
      },
      {
        atFrame: 20,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 16,
        animationDurationInFrames: 16,
      },
      {
        atFrame: 56,
        moveDirection: "top",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 10,
        animationDurationInFrames: 20,
      },
    ],
  },

  // 第二列，原文字：“也都只觉厌恶”
  {
    cues: [
      {
        atFrame: 63,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 19,
        moveDirection: "right",
        animationDurationInFrames: 16,
      },
      {
        atFrame: 73,
        animationDurationInFrames: 12,
        moveDirection: "bottom",
        moveDistance: 15,
        hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
      },
      {
        atFrame: 76,
        moveDistance: 15,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        animationDurationInFrames: 17,
      },
      {
        atFrame: 78,
        moveDistance: 10,
        animationDurationInFrames: 15,
        moveDirection: "top",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 80,
        animationDurationInFrames: 16,
        moveDistance: 16,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 80,
        animationDurationInFrames: 16,
        moveDistance: 16,
        moveDirection: "bottom",
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
        atFrame: 113,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 16,
        moveDirection: "right",
        animationDurationInFrames: 16,
      },
      {
        atFrame: 116,
        animationDurationInFrames: 13,
        moveDirection: "left",
        moveDistance: 20,
        hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
      },
      {
        atFrame: 121,
        moveDistance: 13,
        moveDirection: "top",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        animationDurationInFrames: 16,
      },
      {
        atFrame: 126,
        moveDistance: 13,
        animationDurationInFrames: 16,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 128,
        animationDurationInFrames: 15,
        moveDistance: 14,
        moveDirection: "bottom",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 133,
        animationDurationInFrames: 16,
        moveDistance: 10,
        moveDirection: "left",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 141,
        animationDurationInFrames: 20,
        moveDistance: 10,
        moveDirection: "top",
        // 负数表示与上方字符靠近 3px。
        // spacingBefore: -3,
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
        atFrame: 159,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        moveDistance: 12,
        moveDirection: "top",
        animationDurationInFrames: 14,
      },
      {
        atFrame: 165,
        animationDurationInFrames: 16,
        moveDirection: "left",
        moveDistance: 13,
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 171,
        moveDistance: 21,
        moveDirection: "bottom",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
        animationDurationInFrames: 16,
      },
      {
        atFrame: 177,
        moveDistance: 13,
        animationDurationInFrames: 16,
        moveDirection: "right",
        hiddenWindows: [
          { startFrame: 1, durationInFrames: 1 },
          { startFrame: 3, durationInFrames: 1 },
        ],
      },
      {
        atFrame: 183,
        animationDurationInFrames: 20,
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
