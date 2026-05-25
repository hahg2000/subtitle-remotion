import { parse } from 'ass-compiler';

export interface ParsedDanmaku {
  id: string;
  text: string;
  startFrame: number;
  durationInFrames: number;
  startX: number;
  endX: number;
  top: number;
  color: string;
}

// 建立样式名(Style)到十六进制颜色的映射表
// ASS的颜色是BGR格式：&H00[蓝][绿][红]，我们需要转为标准的 Web CSS 颜色
const styleToColorMap: Record<string, string> = {
  Color0: "#FFFFFF", // 纯白
  Color7: "#FF5654", // 红色系（对应 ASS: &H005456FF）
  Color8: "#FF7523", // 橙色系
  Color9: "#FE69B3", // 粉紫系
  Color10: "#FFBC00", // 黄色/青色
  Color11: "#78C946", // 绿色系
  Color12: "#9E7FFF", // 紫色系
  Color13: "#3D9BFF", // 蓝色系
};

// 时间格式（00:00:01.50）转为秒
export const getDanmakuData = (assText: string, fps: number = 60): ParsedDanmaku[] => {
  const parsed = parse(assText);
  const dialogues = parsed.events.dialogue;

  return dialogues.map((d, index) => {
    const startTimeSec = d.Start;
    const endTimeSec = d.End;
    
    const startFrame = Math.round(startTimeSec * fps);
    const endFrame = Math.round(endTimeSec * fps);
    const durationInFrames = endFrame - startFrame;

    // 使用正则提取 {\move(startX, startY, endX, endY)}
    const moveRegex = /\\move\((-?\d+),\s*(-?\d+),\s*(-?\d+),\s*(-?\d+)\)/;
    const match = d.Text.raw.match(moveRegex);

    let startX = 1992;
    let endX = -72;
    let top = 36;

    if (match) {
      startX = parseInt(match[1], 10);
      top = parseInt(match[2], 10); // Y轴坐标直接作为 top 距离
      endX = parseInt(match[3], 10);
    }

    // 过滤掉所有 ASS 标签（如 {\move...}），只保留纯文本和 Emoji
    const cleanText = d.Text.combined.trim();

    // 获取颜色，如果找不到匹配的 Style，默认白色
    const color = styleToColorMap[d.Style] || "#FFFFFF";

    return {
      id: `danmaku-${index}`,
      text: cleanText,
      startFrame,
      durationInFrames,
      startX,
      endX,
      top,
      color,
    };
  });
};
