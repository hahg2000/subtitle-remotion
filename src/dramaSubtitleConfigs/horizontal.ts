import type {
  DramaSubtitlePosition,
  DramaSubtitleTextStyle,
} from "../parseDramaAss";
import type { SubtitleEffectAssignment } from "../subtitleEffects/types";

// 未匹配到其他总特效的句子会自动使用普通横排字幕。
// 这里把 ASS 中的说话人映射到画面中的字幕行。
export const dramaSubtitleRows: Record<string, number> = {
  speaker00: 1,
  speaker01: 2,
  speaker02: 3,
};

// 三行横排字幕的位置。百分比均相对于整个视频画面。
export const dramaSubtitleRowPositions: Record<string, DramaSubtitlePosition> =
  {
    "1": {
      left: "18%",
      top: "32%",
      width: "84%",
    },
    "2": {
      left: "8%",
      top: "55%",
      width: "84%",
    },
    "3": {
      left: "8%",
      top: "78%",
      width: "84%",
    },
  };

// 每一行可单独覆盖文字样式。目前三行都使用左对齐。
export const dramaSubtitleRowStyles: Record<string, DramaSubtitleTextStyle> = {
  "1": {
    textAlign: "left",
  },
  "2": {
    textAlign: "left",
  },
  "3": {
    textAlign: "left",
  },
};

// 普通横排字幕的默认样式：橙色粗体、白色描边。
export const dramaSubtitleDefaultStyle: DramaSubtitleTextStyle = {
  color: "#faa902",
  fontSize: 60,
  fontFamily:
    "Noto Sans SC, Microsoft YaHei, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  fontWeight: 900,
  lineHeight: 1.25,
  outlineColor: "#ffffff",
  outlineWidth: 8,
  textAlign: "left",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.25)",
};

// 说话人样式会覆盖默认样式中的同名字段。
export const dramaSubtitleSpeakerStyles: Record<
  string,
  DramaSubtitleTextStyle
> = {
  speaker00: {
    color: "#00c1ff",
  },
  speaker01: {
    color: "#565352",
  },
  speaker02: {
    color: "#faa902",
  },
};

// 当前 output-zh.ass 的全部句子都在 vertical.ts 中显式注册为竖排。
// 以后需要恢复某句横排时，再把它从竖排配置移到这里。
export const horizontalSubtitleEffectAssignments: SubtitleEffectAssignment[] =
  [];
