import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const DRAMA_TITLE_FONT_FAMILY = "DramaTitleFont";
export const DRAMA_TITLE_FONT_PATH = "fonts/drama-title.ttf";
export const DRAMA_KLEE_ONE_FONT_FAMILY = "Klee One";
export const DRAMA_KLEE_ONE_FONT_PATH = "fonts/klee-one-regular.ttf";

let dramaTitleFontPromise: Promise<void> | null = null;
let dramaKleeOneFontPromise: Promise<void> | null = null;

export const loadDramaTitleFont = (): Promise<void> => {
  dramaTitleFontPromise ??= loadFont({
    family: DRAMA_TITLE_FONT_FAMILY,
    url: staticFile(DRAMA_TITLE_FONT_PATH),
    display: "block",
  }).catch((error: unknown) => {
    dramaTitleFontPromise = null;
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to load drama title font from public/${DRAMA_TITLE_FONT_PATH}: ${message}`,
    );
  });

  return dramaTitleFontPromise;
};

export const loadDramaKleeOneFont = (): Promise<void> => {
  dramaKleeOneFontPromise ??= loadFont({
    family: DRAMA_KLEE_ONE_FONT_FAMILY,
    url: staticFile(DRAMA_KLEE_ONE_FONT_PATH),
    weight: "400",
    style: "normal",
    display: "block",
  }).catch((error: unknown) => {
    dramaKleeOneFontPromise = null;
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to load Klee One from public/${DRAMA_KLEE_ONE_FONT_PATH}: ${message}`,
    );
  });

  return dramaKleeOneFontPromise;
};
