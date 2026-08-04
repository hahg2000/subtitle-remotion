import {
  defineCharacterColumn,
  defineVerticalFlickerMoveTimeline,
} from "../../subtitleEffects/timeline";

/**
 * 原日文视频的逐帧参考时间轴。
 *
 * 这份配置用于对照原片字形出现顺序，不会被当前中文字幕合成使用。
 * 如果需要重新校准中文时间轴，可从这里复制相应字符的帧、闪烁和位移参数。
 */
export const eurekaLine007JapaneseReferenceTimeline =
  defineVerticalFlickerMoveTimeline([
    // 第一列（画面最右）：“一緒に歩くの”
    defineCharacterColumn({
      text: "一緒に歩くの",
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
    }),

    // 第二列：“嫌になって”
    defineCharacterColumn({
      text: "嫌になって",
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
      ],
    }),

    // 第三列：“でもひとりでいたい”
    defineCharacterColumn({
      text: "でもひとりでいたい",
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
          spacingBefore: -3,
          hiddenWindows: [
            { startFrame: 1, durationInFrames: 1 },
            { startFrame: 3, durationInFrames: 1 },
          ],
        },
        {
          atFrame: 146,
          animationDurationInFrames: 17,
          moveDistance: 12,
          moveDirection: "right",
          spacingBefore: -3,
          hiddenWindows: [
            { startFrame: 1, durationInFrames: 1 },
            { startFrame: 3, durationInFrames: 1 },
          ],
        },
        {
          atFrame: 154,
          animationDurationInFrames: 17,
          moveDistance: 7,
          moveDirection: "bottom",
          hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
        },
      ],
    }),

    // 第四列（画面最左）：“わけじゃなくて”
    defineCharacterColumn({
      text: "わけじゃなくて",
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
        {
          atFrame: 188,
          animationDurationInFrames: 17,
          moveDistance: 15,
          moveDirection: "top",
          hiddenWindows: [
            { startFrame: 1, durationInFrames: 1 },
            { startFrame: 3, durationInFrames: 1 },
          ],
        },
        {
          atFrame: 195,
          animationDurationInFrames: 12,
          moveDistance: 15,
          moveDirection: "right",
          hiddenWindows: [{ startFrame: 1, durationInFrames: 1 }],
        },
      ],
    }),
  ]);
