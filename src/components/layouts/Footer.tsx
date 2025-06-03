import { FC, useState } from "react";
import ArrowIcon from "../icons/ArrowIcon.tsx";

const Footer: FC = () => {
  const [direction, setDirection] = useState<"up" | "down">("down");

  const toggleDirection = () => {
    setDirection((prev) => (prev === "down" ? "up" : "down"));
  };

  return (
    <footer className="bg-grayscale-200 flex w-full flex-col gap-5 border-t border-grayscale-200 text-sm text-grayscale-800 p-5">
      <div className="max-w-screen-xl space-y-5">
        {/* 약관 링크 */}
        <div className="flex flex-wrap gap-x-2 justify-start items-center text-center">
          <a href="/terms" className="body-4 hover:underline">
            서비스 이용약관
          </a>
          <p className="text-grayscale-500">|</p>
          <a href="/privacy" className="body-4 hover:underline">
            개인정보 처리방침
          </a>
          <p className="text-grayscale-500">|</p>
          <a href="/location" className="body-4 hover:underline">
            위치기반 이용약관
          </a>
        </div>

        {/* 사업자 정보 */}
        <div className="tleading-relaxed text-sm text-grayscale-800">
          <div className="w-full flex items-centers justify-between">
            <div className="flex items-center">
              <p className="title-4">사업자 정보</p>
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={toggleDirection}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleDirection();
                }
              }}
              className="inline-flex justify-center items-center mt-1 cursor-pointer"
            >
              <ArrowIcon direction={direction} />
            </div>
          </div>

          {direction === "up" && (
            <p className="mt-2 body-4 ">
              (주) 망고보스 | 대표자: 정현지, 윤석찬, 이명건, 심재엽 <br />
              주소: 경기도 수원시 영통구 원천동 월드컵로206 아주대학교
              구학생회관 234호 <br />
              사업자등록번호: 202020770
            </p>
          )}
        </div>

        {/* 저작권 */}
        <div className="text-start body-4 text-grayscale-800">
          © MANGOBOSS ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
};

export default Footer;
