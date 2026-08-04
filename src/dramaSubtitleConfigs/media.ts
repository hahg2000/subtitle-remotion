import type { DramaSubtitleMediaSource } from "../dramaSubtitleMedia";

// 广播剧字幕使用的 ASS 文件。ASS 只负责提供说话人、文本和起止时间。
export const DRAMA_SUBTITLE_ASS = "output-zh.ass";

// 正式合成使用与 output-zh.ass 对应的三分钟完整视频。
export const DRAMA_VIDEO_SRC = "Rokudenashi-Eureka-Premiere.mp4";

// 保留 47.23-54.16 秒的短视频与图片序列，供逐帧校准竖排闪烁参数。
export const DRAMA_REFERENCE_CLIP_VIDEO_SRC = "闪烁特效原视频.mp4";
export const DRAMA_CHAT_PREVIEW_VIDEO_SRC = DRAMA_VIDEO_SRC;

// 直接读取 MP4。适合正常预览和最终导出。
export const DRAMA_VIDEO_MEDIA_SOURCE: DramaSubtitleMediaSource = {
  type: "video",
  src: DRAMA_VIDEO_SRC,
};

// 逐帧参考图片。适合精确核对原视频中的单帧闪烁和位移。
export const DRAMA_IMAGE_SEQUENCE_MEDIA_SOURCE: DramaSubtitleMediaSource = {
  type: "imageSequence",
  directory: "reference-frames",
  filenamePrefix: "frame-",
  extension: "png",
  padLength: 6,
  startNumber: 0,
  frameCount: 208,
  width: 400,
  height: 450,
};

// 主合成当前使用的媒体来源。
// 逐帧调试时可改为 DRAMA_IMAGE_SEQUENCE_MEDIA_SOURCE。
export const DRAMA_MEDIA_SOURCE = DRAMA_VIDEO_MEDIA_SOURCE;

// 透明字幕合成只读取这个媒体的宽高和时长，不会渲染它。
// 需要叠加到其他视频时，应将它指向最终底层视频对应的媒体来源。
export const DRAMA_TRANSPARENT_METADATA_SOURCE = DRAMA_VIDEO_MEDIA_SOURCE;

export const DRAMA_CHAT_PREVIEW_MEDIA_SOURCE: DramaSubtitleMediaSource = {
  type: "video",
  src: DRAMA_CHAT_PREVIEW_VIDEO_SRC,
};
