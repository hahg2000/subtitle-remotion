import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DanmakuVideo"
        component={MyComposition}
        durationInFrames={7200} // 根据弹幕最长时调大
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
