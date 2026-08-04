export type DramaSubtitleMediaSource =
  | {
      type: "video";
      src: string;
    }
  | {
      type: "imageSequence";
      directory: string;
      filenamePrefix: string;
      extension: string;
      padLength: number;
      startNumber: number;
      frameCount: number;
      width: number;
      height: number;
    };
