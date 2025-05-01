import { useNavigate } from "react-router-dom";
import LogoIcon from "../components/icons/LogoIcon.tsx";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#FFFCE1] font-sans text-black">
      <LogoIcon
        theme="icon"
        className="w-[140px] h-[140px] mb-10 animate-bounce [animation-delay:1s] [animation-duration:2s]"
      />

      <div className="w-[100px] h-5 rounded-full bg-[#D2B04C] blur-sm mb-8 animate-pulse"></div>

      <div className="text-center max-w-xs">
        <h1 className="text-3xl font-bold mb-4">망고가 길을 잃었어요!</h1>
        <p className="text-[#555] text-sm mb-6">
          찾으려는 페이지가 존재하지 않아요. 다시 돌아가볼까요?
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-block px-10 py-3 rounded-full text-white text-lg bg-[#FFB800] hover:bg-[#E5A500] transition duration-300"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default NotFound;
