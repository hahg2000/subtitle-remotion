import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import assText from "./danmaku.ass";
import { getDanmakuData, type ParsedDanmaku } from "./parseAss";

export type MyCompositionProps = {
  videoSrc?: string;
};

const DanmakuItem: React.FC<{ data: ParsedDanmaku }> = ({ data }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - data.startFrame;

  // 如果还没到时间，或者已经结束了，不渲染
  if (relativeFrame < 0 || relativeFrame > data.durationInFrames) return null;

  // 使用 Remotion 内置插值函数，完美还原 ASS 的匀速直线运动 (\move)
  const x = interpolate(
    relativeFrame,
    [0, data.durationInFrames], // 对应从动画开始到结束
    [data.startX, data.endX], // 对应 X 轴坐标从 1992 移动到 -72
    { extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        top: `${data.top}px`,
        transform: `translateX(${x}px)`,
        fontSize: "36px", // 对应样式中的 Fontsize: 36
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', sans-serif",
        whiteSpace: "nowrap",
        color: data.color, // 还原原版弹幕颜色
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.85)", // 保持阴影，保证清晰度
      }}
    >
      {data.text}
    </div>
  );
};

export const MyComposition: React.FC<MyCompositionProps> = ({ videoSrc }) => {
  const danmakus = getDanmakuData(assText, 60);

  return (
    <AbsoluteFill>
      {videoSrc ? (
        <OffthreadVideo
          src={staticFile(videoSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      ) : null}
      {danmakus.map((danmaku) => (
        <DanmakuItem key={danmaku.id} data={danmaku} />
      ))}
    </AbsoluteFill>
  );
};
