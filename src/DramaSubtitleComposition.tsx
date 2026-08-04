import { Video } from "@remotion/media";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import {
  DramaSubtitleOverlay,
  type DramaSubtitleOverlayProps,
} from "./DramaSubtitleOverlay";
import type { DramaSubtitleMediaSource } from "./dramaSubtitleMedia";

export type DramaSubtitleCompositionProps = {
  mediaSource?: DramaSubtitleMediaSource;
  // Kept for compatibility with existing render props.
  videoSrc?: string;
  assSrc: string;
  rowPositions?: DramaSubtitleOverlayProps["rowPositions"];
  rowStyles?: DramaSubtitleOverlayProps["rowStyles"];
  defaultStyle?: DramaSubtitleOverlayProps["defaultStyle"];
  speakerRows?: DramaSubtitleOverlayProps["speakerRows"];
  speakerStyles?: DramaSubtitleOverlayProps["speakerStyles"];
  effectAssignments?: DramaSubtitleOverlayProps["effectAssignments"];
  effectTimelines?: DramaSubtitleOverlayProps["effectTimelines"];
  conversationScenes?: DramaSubtitleOverlayProps["conversationScenes"];
  showSpeaker?: boolean;
};

const DramaSubtitleMedia: React.FC<{
  mediaSource: DramaSubtitleMediaSource;
}> = ({ mediaSource }) => {
  const frame = useCurrentFrame();

  if (mediaSource.type === "video") {
    return (
      <Video
        src={staticFile(mediaSource.src)}
        objectFit="contain"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    );
  }

  if (frame >= mediaSource.frameCount) {
    return null;
  }

  const frameNumber = mediaSource.startNumber + frame;
  const filename = `${mediaSource.filenamePrefix}${String(frameNumber).padStart(
    mediaSource.padLength,
    "0",
  )}.${mediaSource.extension}`;
  const directory = mediaSource.directory.replace(/\/+$/, "");

  return (
    <Img
      src={staticFile(`${directory}/${filename}`)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  );
};

export const DramaSubtitleComposition: React.FC<
  DramaSubtitleCompositionProps
> = ({
  mediaSource,
  videoSrc,
  assSrc,
  rowPositions,
  rowStyles,
  defaultStyle,
  speakerRows,
  speakerStyles,
  effectAssignments,
  effectTimelines,
  conversationScenes,
  showSpeaker,
}) => {
  const resolvedMediaSource =
    mediaSource ??
    (videoSrc
      ? ({
          type: "video",
          src: videoSrc,
        } satisfies DramaSubtitleMediaSource)
      : undefined);

  return (
    <AbsoluteFill>
      {resolvedMediaSource ? (
        <DramaSubtitleMedia mediaSource={resolvedMediaSource} />
      ) : null}
      <DramaSubtitleOverlay
        assSrc={assSrc}
        rowPositions={rowPositions}
        rowStyles={rowStyles}
        defaultStyle={defaultStyle}
        speakerRows={speakerRows}
        speakerStyles={speakerStyles}
        effectAssignments={effectAssignments}
        effectTimelines={effectTimelines}
        conversationScenes={conversationScenes}
        showSpeaker={showSpeaker}
      />
    </AbsoluteFill>
  );
};
