import Footer from "../../components/layouts/Footer.tsx";
import LogoIcon from "../../components/icons/LogoIcon.tsx";
import { useLayout } from "../../hooks/useLayout.ts";
import ClockIcon from "../../components/icons/ClockIcon.tsx";
import WingMoneyIcon from "../../components/icons/WingMoneyIcon.tsx";
import FolderIcon from "../../components/icons/FolderIcon.tsx";
import DateIcon from "../../components/icons/DateIcon.tsx";
import LandingProblem from "../../components/icons/LandingProblem.tsx";
import LandingArrow from "../../components/icons/LandingArror.tsx";
import LandingGroup from "../../components/icons/LandingGroup.tsx";
import WatchIcon from "../../components/icons/WatchIcon.tsx";
import LandingTimeMap from "../../components/icons/LandingTimeMap.tsx";
import LandingTimeQR from "../../components/icons/LandingTimeQR.tsx";
import MoneyIcon from "../../components/icons/MoneyIcon.tsx";
import LandingSign from "../../components/icons/LandingSign.tsx";
import LandingCoin from "../../components/icons/LandingCoin.tsx";
import BriefCaseIcon from "../../components/icons/BriefCaseIcon.tsx";
import LandingDoc from "../../components/icons/LandingDoc.tsx";
import PartyIcon from "../../components/icons/PartyIcon.tsx";
import Button from "../../components/common/Button.tsx";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  useLayout({
    theme: "default",
    rightIcon: false,
    headerVisible: true,
    bottomNavVisible: false,
  });

  const navigate = useNavigate();

  return (
    <div className="w-full h-full">
      <div className="w-full bg-white inline-flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full px-9 py-12 bg-primary-100 inline-flex justify-center items-center">
          <div className="inline-flex flex-col justify-center items-center gap-12">
            <LogoIcon
              theme="full"
              className="w-50 h-auto object-contain overflow-visible"
            />
            <div className="flex flex-col justify-start items-center gap-5">
              <div className="text-center justify-start">
                <span className="text-grayscale-900 text-3xl font-bold">
                  사장님의 부담을 줄여주는
                  <br />
                </span>
                <span className="text-primary-900 text-3xl font-bold">
                  알바생 관리
                </span>
                <span className="text-grayscale-900 text-3xl font-bold">
                  의 새로운 기준
                </span>
              </div>
              <div className="text-center justify-start text-grayscale-600 heading-2">
                편리하게, 정확하게, 여유롭게
              </div>
            </div>
            <div className="justify-center items-center grid grid-cols-2 gap-5 place-items-center content-center">
              <div className="p-5 bg-white rounded-xl inline-flex flex-col justify-center items-center aspect-square w-[160px]">
                <div className="w-full h-full flex flex-col justify-center items-end gap-3">
                  <div className="flex flex-col justify-start items-start gap-2">
                    <div className="justify-start text-grayscale-900 title-1">
                      출퇴근 관리
                    </div>
                    <div className="justify-start text-grayscale-500 body-2 whitespace-normal break-keep text-left">
                      QR, GPS 기반 출퇴근 인증
                    </div>
                  </div>
                  <ClockIcon />
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl inline-flex flex-col justify-center items-center aspect-square w-[160px]">
                <div className="w-full h-full flex flex-col justify-center items-end gap-3">
                  <div className="flex flex-col justify-start items-start gap-2">
                    <div className="justify-start text-grayscale-900 title-1">
                      자동 송금
                    </div>
                    <div className="justify-start text-grayscale-500 body-2 whitespace-normal break-keep text-left">
                      알바생 급여지급일에 맞춰 한 번에 처리
                    </div>
                  </div>
                  <WingMoneyIcon />
                </div>
              </div>
              <div className="p-5 bg-white rounded-xl inline-flex flex-col justify-center items-center aspect-square w-[160px]">
                <div className="w-full h-full flex flex-col justify-center items-end gap-3">
                  <div className="flex flex-col justify-start items-start gap-2">
                    <div className="justify-start text-grayscale-900 title-1">
                      서류 관리
                    </div>
                    <div className="justify-start text-grayscale-500 body-2 whitespace-normal break-keep text-left">
                      근로계약서, 보건증 종합 서류 통합 확인
                    </div>
                  </div>
                  <FolderIcon />
                </div>
              </div>
              <div className="p-5 bg-white rounded-xl inline-flex flex-col justify-center items-center aspect-square w-[160px]">
                <div className="w-full h-full flex flex-col justify-center items-end gap-3">
                  <div className="flex flex-col justify-start items-start gap-2">
                    <div className="justify-start text-grayscale-900 title-1">
                      스케줄 관리
                    </div>
                    <div className="justify-start text-grayscale-500 body-2 whitespace-normal break-keep text-left">
                      달력 기반 스케줄 확인
                    </div>
                  </div>
                  <DateIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-12 bg-white flex flex-col justify-start items-center gap-12">
          <div className="text-center justify-start text-grayscale-900 text-3xl font-bold">
            망고보스는
            <br />
            이렇게 만들어졌어요!
          </div>
          <LandingProblem />
          <LandingArrow />
          <LandingGroup />
        </div>
        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full flex flex-col justify-start items-center">
            <div className="py-12 flex flex-col justify-start items-center gap-6">
              <div className="flex flex-col justify-start items-center gap-3">
                <div className="w-20 h-20 bg-primary-100 rounded-xl inline-flex justify-center items-center">
                  <WatchIcon />
                </div>
                <div className="text-center justify-start">
                  <span className="text-grayscale-900 text-3xl font-bold">
                    오차 없는
                    <br />
                  </span>
                  <span className="text-primary-900 text-3xl font-bold">
                    출퇴근 기록
                  </span>
                </div>
              </div>
              <div className="text-center justify-start text-grayscale-600 body-1">
                QR / GPS 기반의
                <br />
                출퇴근 인증 및 기록
              </div>
            </div>
            <div className="w-full py-8 bg-primary-100 inline-flex justify-center items-center gap-4">
              <LandingTimeMap className="w-48 h-96" />
              <LandingTimeQR className="w-48 h-96" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full flex flex-col justify-start items-center">
            <div className="py-12 flex flex-col justify-start items-center gap-6">
              <div className="flex flex-col justify-start items-center gap-3">
                <div className="w-20 h-20 bg-primary-100 rounded-xl inline-flex justify-center items-center">
                  <MoneyIcon />
                </div>
                <div className="text-center justify-start">
                  <span className="text-grayscale-900 text-3xl font-bold">
                    급여는 한번에
                    <br />
                  </span>
                  <span className="text-primary-900 text-3xl font-bold">
                    자동
                  </span>
                  <span className="text-grayscale-900 text-3xl font-bold">
                    으로
                  </span>
                </div>
              </div>
              <div className="text-center justify-start text-grayscale-600 body-1">
                급여지급일 설정에 따른
                <br />
                알바생 근태 기록 기반 자동 송금
              </div>
            </div>
            <div className="w-full py-8 bg-primary-100 inline-flex justify-center items-center gap-6">
              <LandingCoin className="w-48 h-96" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start">
          <div className="w-full flex flex-col justify-start items-center">
            <div className="py-12 flex flex-col justify-start items-center gap-6">
              <div className="flex flex-col justify-start items-center gap-3">
                <div className="w-20 h-20 bg-primary-100 rounded-xl inline-flex justify-center items-center">
                  <BriefCaseIcon />
                </div>
                <div className="text-center justify-start">
                  <span className="text-grayscale-900 text-3xl font-bold">
                    복잡한 서류는
                    <br />
                  </span>
                  <span className="text-primary-900 text-3xl font-bold">
                    간단
                  </span>
                  <span className="text-grayscale-900 text-3xl font-bold">
                    하게
                  </span>
                </div>
              </div>
              <div className="text-center justify-start text-grayscale-600 body-1">
                손쉬운 서류 파악과
                <br />
                서명까지 확인
              </div>
            </div>
            <div className="w-full py-8 bg-primary-100 inline-flex justify-center items-center gap-4">
              <LandingDoc className="w-48 h-96" />
              <LandingSign className="w-48 h-96" />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-center py-14 bg-secondary-900 gap-14">
          <div className="w-full flex flex-col justify-start items-center gap-6">
            <PartyIcon />
            <div className="text-center justify-start text-white text-3xl font-bold">
              사장님이 더 쉬워지는 순간
              <br />
              망고보스의 시작입니다.
            </div>
          </div>
          <Button
            size="xl"
            theme="primary"
            type="button"
            state="default"
            className="text-black rounded-full"
            onClick={() => navigate("/login")}
          >
            망고보스 로그인하기
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
