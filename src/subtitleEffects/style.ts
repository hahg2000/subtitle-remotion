import type { CSSProperties } from "react";
import type { CssLength, DramaSubtitleTextStyle } from "../parseDramaAss";

export const toCssLength = (
  value: CssLength | undefined,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? `${value}px` : value;
};

export const toNumber = (
  value: CssLength | undefined,
  fallback: number,
): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const makeTextOutline = (
  color: string | undefined,
  width: CssLength | undefined,
): string => {
  const radius = Math.max(0, Math.round(toNumber(width, 0)));

  if (!color || radius === 0) {
    return "";
  }

  const shadows: string[] = [];

  for (let currentRadius = 1; currentRadius <= radius; currentRadius++) {
    for (let angle = 0; angle < 360; angle += 30) {
      const radians = (angle * Math.PI) / 180;
      const x = Math.cos(radians) * currentRadius;
      const y = Math.sin(radians) * currentRadius;
      shadows.push(`${x.toFixed(2)}px ${y.toFixed(2)}px 0 ${color}`);
    }
  }

  return shadows.join(", ");
};

export const getTextStyle = (style: DramaSubtitleTextStyle): CSSProperties => {
  const outline = makeTextOutline(style.outlineColor, style.outlineWidth);
  const textShadow = [outline, style.textShadow].filter(Boolean).join(", ");

  return {
    color: style.color,
    fontSize: toCssLength(style.fontSize),
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: toCssLength(style.letterSpacing),
    textShadow,
    backgroundColor: style.backgroundColor,
    borderRadius: toCssLength(style.borderRadius),
    padding: toCssLength(style.padding),
    textAlign: style.textAlign,
    whiteSpace: style.whiteSpace,
    overflowWrap: style.overflowWrap,
    wordBreak: style.wordBreak,
    ...style.css,
  };
};
