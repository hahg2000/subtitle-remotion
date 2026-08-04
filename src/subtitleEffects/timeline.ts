import type {
  VerticalFlickerMoveColumn,
  VerticalFlickerMoveCueDefaults,
  VerticalFlickerMoveCueInput,
  VerticalFlickerMovePreset,
  VerticalFlickerMovePresetColumn,
  VerticalFlickerMoveTimeline,
} from "./types";

export const defineCharacterColumn = ({
  text,
  defaults = {},
  cues,
}: {
  text: string;
  defaults?: VerticalFlickerMoveCueDefaults;
  cues: VerticalFlickerMoveCueInput[];
}): VerticalFlickerMoveColumn => {
  const characters = Array.from(text);

  if (characters.length !== cues.length) {
    throw new Error(
      `Character timeline mismatch for "${text}": received ${cues.length} cues for ${characters.length} characters.`,
    );
  }

  cues.forEach((cue, index) => {
    if (!Number.isInteger(cue.atFrame) || cue.atFrame < 0) {
      throw new Error(
        `Invalid atFrame for character "${characters[index]}" at index ${index}: ${cue.atFrame}. Expected a non-negative integer relative to the ASS line start.`,
      );
    }
  });

  return {
    cues: characters.map((character, index) => ({
      text: character,
      ...defaults,
      ...cues[index],
    })),
  };
};

export const defineVerticalFlickerMoveTimeline = (
  columns: VerticalFlickerMoveColumn[],
): VerticalFlickerMoveTimeline => ({
  type: "verticalFlickerMove",
  columns,
});

export const defineVerticalFlickerMovePreset = (
  columns: VerticalFlickerMovePresetColumn[],
): VerticalFlickerMovePreset => ({ columns });

export const bindVerticalTextToPreset = ({
  preset,
  columns,
}: {
  preset: VerticalFlickerMovePreset;
  columns: string[];
}): VerticalFlickerMoveTimeline => {
  if (columns.length !== preset.columns.length) {
    throw new Error(
      `Vertical preset column mismatch: received ${columns.length} text columns for ${preset.columns.length} preset columns.`,
    );
  }

  return defineVerticalFlickerMoveTimeline(
    preset.columns.map((column, index) =>
      defineCharacterColumn({
        text: columns[index],
        defaults: column.defaults,
        cues: column.cues,
      }),
    ),
  );
};
