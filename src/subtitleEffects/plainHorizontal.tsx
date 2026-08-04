import { getTextStyle } from "./style";
import type { SubtitleEffectDefinition } from "./types";

export const plainHorizontalEffect = {
  effectId: "plainHorizontal",
  kind: "horizontal",
  defaultPosition: undefined,
  defaultStyle: undefined,
  render: (context, assignment) => {
    if (assignment.effectId !== "plainHorizontal") {
      throw new Error(
        `plainHorizontal received incompatible effect "${assignment.effectId}".`,
      );
    }

    const text = `${
      context.showSpeaker && context.line.speaker
        ? `${context.line.speaker}: `
        : ""
    }${context.line.text}`;

    return <div style={getTextStyle(context.textStyle)}>{text}</div>;
  },
} satisfies SubtitleEffectDefinition;
