import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { useLayout } from "../../hooks/useLayout";
import useBottomSheetStore from "../../stores/useBottomSheetStore";
import { CalendarOff } from "../../components/icons/CalendarIcon.tsx";

const ContractWritePage = () => {
  useLayout({
    title: "기본 근로계약서",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: null,
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      worker: "",
      period: "",
      location: "",
      job: "",
      weekdays: [],
      time: {},
      wage: "",
      signature: { sign: "" },
    },
  });

  const { setBottomSheetContent, setBottomSheetOpen } = useBottomSheetStore();

  const onSubmit = (data: any) => {
    console.log("제출된 계약서:", data);
  };

  useEffect(() => {
    const handleMessage = (event: {
      origin: string;
      data: { address: any };
    }) => {
      if (event.origin !== window.origin) return;
      const address = event.data?.address;
      if (address) setValue("location", address);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full px-5 py-6 flex flex-col justify-between"
    >
      <div className="flex flex-col gap-6">
        {/* 근무자 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 title-1 text-black">
            근무자<span className="text-warning">*</span>
          </div>
          <div className="flex gap-3">
            {[
              { name: "이명건", active: true },
              { name: "윤석찬", active: false },
              { name: "심재엽", active: false },
              { name: "정현지", active: false },
            ].map(({ name, active }, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div
                  className={`w-14 h-14 rounded-full ${active ? "bg-secondary-900" : "bg-grayscale-300"}`}
                ></div>
                <div
                  className={`title-2 font-${active ? "semibold text-black" : "medium text-grayscale-500"}`}
                >
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 근로계약기간 */}
        <Controller
          name="period"
          control={control}
          render={({ field }) => (
            <TextField
              title="근로계약기간"
              placeholder="2025.04.10 부터 2025.05.10 까지"
              required
              theme="icon"
              icon={<CalendarOff />}
              {...field}
            />
          )}
        />

        {/* 근무 장소 */}
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <TextField
              title="근무 장소"
              placeholder="경기도 수원시 월드컵로 206 아주대학교"
              description="근무장소가 매장이 아닌 경우 수정해주세요."
              required
              button={
                <Button
                  size="md"
                  theme="primary"
                  type="button"
                  onClick={() =>
                    window.open(
                      "/address-search",
                      "주소검색",
                      "width=600,height=600",
                    )
                  }
                >
                  주소검색
                </Button>
              }
              {...field}
            />
          )}
        />

        {/* 업무 */}
        <Controller
          name="job"
          control={control}
          render={({ field }) => (
            <TextField
              title="업무"
              placeholder="예) 홀 서빙"
              required
              {...field}
            />
          )}
        />

        {/* 근무 요일 */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 items-center title-1 text-black">
            근무 요일<span className="text-warning">*</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <div
                key={day}
                className="flex-1 px-4 py-3 body-2 text-center rounded-lg border border-gray-300 text-gray-700"
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* 근무 시간 */}
        <div className="flex flex-col gap-4">
          {["수요일", "금요일"].map((day) => (
            <div key={day} className="flex flex-col gap-2">
              <div className="title-2 text-black">{day}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-14 px-6 py-3.5 border border-gray-300 rounded-lg body-1 text-black flex items-center">
                  10:00
                </div>
                <span className="text-base font-semibold">~</span>
                <div className="flex-1 h-14 px-6 py-3.5 border border-gray-300 rounded-lg body-1 text-black flex items-center">
                  16:00
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 시급 */}
        <Controller
          name="wage"
          control={control}
          render={({ field }) => (
            <TextField
              title="시급"
              placeholder="10,030 원"
              description="현재 최저시급은 10,030원 입니다."
              required
              {...field}
            />
          )}
        />

        {/* 서명 */}
        <Controller
          name="signature"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <div className="flex title-1 text-black gap-1">
                서명<span className="text-warning">*</span>
              </div>
              <div
                className="h-44 px-6 py-4 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer"
                onClick={() => {
                  setBottomSheetContent(
                    <div className="p-6 flex flex-col items-center gap-4">
                      <div className="w-full h-60 border border-gray-300 rounded-xl flex items-center justify-center">
                        <div className="w-60 h-28 border-4 border-black"></div>
                      </div>
                      <Button
                        size="lg"
                        theme="primary"
                        className="w-full"
                        onClick={() => {
                          setValue("signature", { sign: "SIGNED" });
                          setBottomSheetOpen(false);
                        }}
                      >
                        서명 완료
                      </Button>
                    </div>,
                    { title: "서명 그리기" },
                  );
                }}
              >
                {field.value?.sign
                  ? "서명 완료됨 (클릭 시 수정)"
                  : "근로계약서에 적용할 서명을 진행해주세요."}
              </div>
            </div>
          )}
        />
      </div>

      {/* 하단 작성 버튼 */}
      <Button
        size="lg"
        theme="primary"
        type="submit"
        state={isValid ? "default" : "disabled"}
        disabled={!isValid}
        className="w-full mt-6"
      >
        작성
      </Button>
    </form>
  );
};

export default ContractWritePage;
