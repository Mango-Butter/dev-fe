// components/common/FullScreenLoading.tsx
import { Player } from "@lottiefiles/react-lottie-player";
import mangoLoading from "../../assets/mangoLoading.json";

const FullScreenLoading = () => {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 touch-none"
      style={{
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      <Player
        autoplay
        loop
        src={mangoLoading}
        style={{ height: 120, width: 120 }}
      />
    </div>
  );
};

export default FullScreenLoading;
