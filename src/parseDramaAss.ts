import { parse } from "ass-compiler";
import type { CSSProperties } from "react";

export type CssLength = number | string;
type ParsedAss = ReturnType<typeof parse>;
type AssDialogue = ParsedAss["events"]["dialogue"][number];

export type DramaSubtitlePosition = {
  top?: CssLength;
  bottom?: CssLength;
  left?: CssLength;
  right?: CssLength;
  width?: CssLength;
  height?: CssLength;
  maxWidth?: CssLength;
  transform?: string;
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  css?: CSSProperties;
};

export type DramaSubtitleTextStyle = {
  color?: string;
  fontSize?: CssLength;
  fontFamily?: string;
  fontWeight?: CSSProperties["fontWeight"];
  lineHeight?: CssLength;
  letterSpacing?: CssLength;
  outlineColor?: string;
  outlineWidth?: CssLength;
  textShadow?: string;
  backgroundColor?: string;
  borderRadius?: CssLength;
  padding?: CssLength;
  textAlign?: CSSProperties["textAlign"];
  whiteSpace?: CSSProperties["whiteSpace"];
  overflowWrap?: CSSProperties["overflowWrap"];
  wordBreak?: CSSProperties["wordBreak"];
  css?: CSSProperties;
};

export type DramaSubtitleLine = {
  id: string;
  text: string;
  speaker?: string;
  speakerKey?: string;
  startMs: number;
  endMs: number;
  row: number;
  startFrame: number;
  durationInFrames: number;
};

export type ParseDramaAssOptions = {
  fps: number;
  speakerRows?: Record<string, number>;
};

const parseSpeakerAndText = (
  dialogue: AssDialogue,
): { speaker?: string; text: string } => {
  const name = String(dialogue.Name ?? "").trim();
  const text = dialogue.Text.combined.trim();
  const speakerPrefix = text.match(/^([^:\uFF1A]{1,24})[:\uFF1A]\s*(.+)$/);

  if (name) {
    return { speaker: name, text };
  }

  if (speakerPrefix) {
    return {
      speaker: speakerPrefix[1].trim(),
      text: speakerPrefix[2].trim(),
    };
  }

  return { text };
};

export const parseDramaAss = (
  assText: string,
  options: ParseDramaAssOptions,
): DramaSubtitleLine[] => {
  const parsed = parse(assText);

  return parsed.events.dialogue.map((dialogue, index) => {
    const { speaker, text } = parseSpeakerAndText(dialogue);
    const row = speaker ? (options.speakerRows?.[speaker] ?? 1) : 1;
    const startMs = Math.round(dialogue.Start * 1000);
    const endMs = Math.round(dialogue.End * 1000);
    const startFrame = Math.round(dialogue.Start * options.fps);
    const endFrame = Math.round(dialogue.End * options.fps);

    return {
      id: `drama-subtitle-${index}`,
      text,
      speaker,
      speakerKey: speaker,
      startMs,
      endMs,
      row,
      startFrame,
      durationInFrames: endFrame - startFrame,
    };
  });
};
