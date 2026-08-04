import { AbsoluteFill } from "remotion";
import {
  DramaSubtitleOverlay,
  type DramaSubtitleOverlayProps,
} from "./DramaSubtitleOverlay";
import type { DramaSubtitleMediaSource } from "./dramaSubtitleMedia";

export type DramaSubtitleTransparentCompositionProps =
  DramaSubtitleOverlayProps & {
    // 仅用于计算透明合成的宽高和时长，不会渲染到画面中。
    metadataSource: DramaSubtitleMediaSource;
  };

// 独立的透明字幕合成：只渲染字幕层，不加载背景视频、图片或声音。
export const DramaSubtitleTransparentComposition: React.FC<
  DramaSubtitleTransparentCompositionProps
> = ({
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
  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
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
