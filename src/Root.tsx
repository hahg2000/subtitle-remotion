import "./index.css";
import { getVideoMetadata } from "@remotion/media-utils";
import {
  type CalculateMetadataFunction,
  Composition,
  staticFile,
} from "remotion";
import {
  DramaSubtitleComposition,
  type DramaSubtitleCompositionProps,
} from "./DramaSubtitleComposition";
import {
  DramaSubtitleTransparentComposition,
  type DramaSubtitleTransparentCompositionProps,
} from "./DramaSubtitleTransparentComposition";
import {
  DRAMA_CHAT_PREVIEW_MEDIA_SOURCE,
  DRAMA_MEDIA_SOURCE,
  DRAMA_SUBTITLE_ASS,
  DRAMA_TRANSPARENT_METADATA_SOURCE,
  dramaSubtitleConversationScenes,
  dramaSubtitleDefaultStyle,
  dramaSubtitleEffectAssignments,
  dramaSubtitleRowPositions,
  dramaSubtitleRowStyles,
  dramaSubtitleRows,
  dramaSubtitleSpeakerStyles,
  dramaSubtitleTimelines,
} from "./dramaSubtitleConfigs";
import type { DramaSubtitleMediaSource } from "./dramaSubtitleMedia";

const DRAMA_SUBTITLE_FPS = 30;

const dramaSubtitleOverlayDefaultProps = {
  assSrc: DRAMA_SUBTITLE_ASS,
  showSpeaker: false,
  rowPositions: dramaSubtitleRowPositions,
  rowStyles: dramaSubtitleRowStyles,
  defaultStyle: dramaSubtitleDefaultStyle,
  speakerRows: dramaSubtitleRows,
  speakerStyles: dramaSubtitleSpeakerStyles,
  effectAssignments: dramaSubtitleEffectAssignments,
  effectTimelines: dramaSubtitleTimelines,
  conversationScenes: dramaSubtitleConversationScenes,
};

const dramaSubtitleDefaultProps: DramaSubtitleCompositionProps = {
  mediaSource: DRAMA_MEDIA_SOURCE,
  ...dramaSubtitleOverlayDefaultProps,
};

const dramaSubtitleTransparentDefaultProps: DramaSubtitleTransparentCompositionProps =
  {
    metadataSource: DRAMA_TRANSPARENT_METADATA_SOURCE,
    ...dramaSubtitleOverlayDefaultProps,
  };

const getDramaMediaMetadata = async (
  mediaSource: DramaSubtitleMediaSource,
): Promise<{ durationInFrames: number; width: number; height: number }> => {
  if (mediaSource.type === "imageSequence") {
    return {
      durationInFrames: mediaSource.frameCount,
      width: mediaSource.width,
      height: mediaSource.height,
    };
  }

  const metadata = await getVideoMetadata(staticFile(mediaSource.src));

  return {
    durationInFrames: Math.ceil(
      metadata.durationInSeconds * DRAMA_SUBTITLE_FPS,
    ),
    width: metadata.width,
    height: metadata.height,
  };
};

const calculateDramaSubtitleMetadata: CalculateMetadataFunction<
  DramaSubtitleCompositionProps
> = async ({ props }) => {
  const mediaSource =
    props.mediaSource ??
    (props.videoSrc
      ? {
          type: "video" as const,
          src: props.videoSrc,
        }
      : undefined);

  if (!mediaSource) {
    return {};
  }

  return getDramaMediaMetadata(mediaSource);
};

const calculateDramaSubtitleTransparentMetadata: CalculateMetadataFunction<
  DramaSubtitleTransparentCompositionProps
> = async ({ props }) => ({
  ...(await getDramaMediaMetadata(props.metadataSource)),
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* <Composition
        id="DanmakuVideo"
        component={MyComposition}
        defaultProps={{
          videoSrc: "Skills Skills Skills.mp4",
        }}
        durationInFrames={17200}
        fps={60}
        width={1920}
        height={1080}
      /> */}
      <Composition
        id="DramaSubtitleVideo"
        component={DramaSubtitleComposition}
        defaultProps={dramaSubtitleDefaultProps}
        calculateMetadata={calculateDramaSubtitleMetadata}
        durationInFrames={1}
        fps={DRAMA_SUBTITLE_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="DramaSubtitleTransparent"
        component={DramaSubtitleTransparentComposition}
        defaultProps={dramaSubtitleTransparentDefaultProps}
        calculateMetadata={calculateDramaSubtitleTransparentMetadata}
        durationInFrames={1}
        fps={DRAMA_SUBTITLE_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="DramaSubtitleChatPreview"
        component={DramaSubtitleComposition}
        defaultProps={{
          ...dramaSubtitleDefaultProps,
          mediaSource: DRAMA_CHAT_PREVIEW_MEDIA_SOURCE,
        }}
        calculateMetadata={calculateDramaSubtitleMetadata}
        durationInFrames={1}
        fps={DRAMA_SUBTITLE_FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
