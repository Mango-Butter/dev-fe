import { useForm, Controller } from "react-hook-form";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { useLayout } from "../../hooks/useLayout";
import { useEffect } from "react";
import useBottomSheetStore from "../../stores/useBottomSheetStore";

const ContractRegisterPage = () => {
  useLayout({
    title: "근로계약서 템플릿 작성하기",
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
  } = useForm<ContractFormValues>({
    mode: "onChange",
    defaultValues: {
      title: "",
      location: "",
      jobDescription: "",
      wage: "",
      signature: { sign: "" },
    },
  });

  const { setBottomSheetContent, setBottomSheetOpen } = useBottomSheetStore();

  const onSubmit = (data: ContractFormValues) => {
    console.log("제출된 데이터:", data);
    // TODO: 실제 저장 로직 처리
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
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
      className="w-full h-full px-5 py-6 inline-flex flex-col justify-between items-center"
    >
      <div className="w-full inline-flex flex-col justify-start items-start gap-6">
        {/* 계약서 제목 */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              title="계약서 제목"
              placeholder="예) 망고보스 기본 근로계약서"
              {...field}
              required
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
              {...field}
              description="근무장소가 매장이 아닌 경우 수정해주세요."
              placeholder="주소를 입력해주세요"
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
            />
          )}
        />

        {/* 업무 */}
        <Controller
          name="jobDescription"
          control={control}
          render={({ field }) => (
            <TextField title="업무" placeholder="예) 홀 서빙" {...field} />
          )}
        />

        {/* 시급 */}
        <Controller
          name="wage"
          control={control}
          render={({ field }) => (
            <TextField
              title="시급"
              placeholder="10,030원"
              description="현재 최저시급은 10,030원입니다."
              {...field}
            />
          )}
        />

        {/* 서명 */}
        <Controller
          name="signature"
          control={control}
          render={({ field }) => (
            <div className="w-full flex flex-col gap-2">
              <div className="text-base font-semibold text-grayscale-900">
                서명
              </div>
              <div
                className="w-full h-32 bg-white rounded-xl border border-grayscale-300 text-grayscale-500 flex items-center justify-center cursor-pointer"
                onClick={() => {
                  setBottomSheetContent(
                    <div className="w-full bg-white rounded-t-lg  flex flex-col items-center gap-4">
                      <div className="w-full h-60 px-6 py-4 bg-white rounded-xl outline outline-1 outline-grayscale-400 flex items-center justify-center">
                        {/* 실제 서명 캔버스 들어갈 자리 */}
                        <div className="w-60 h-28 outline outline-[5px] outline-black" />
                      </div>
                      <Button
                        size="lg"
                        theme="primary"
                        className="w-full mt-4"
                        onClick={() => {
                          setValue("signature", { sign: "SIGNED" });
                          setBottomSheetOpen(false);
                        }}
                      >
                        서명 완료
                      </Button>
                    </div>,
                    {
                      title: "서명 그리기",
                      leftButtonIcon: false,
                      closeOnClickOutside: true,
                    },
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

      {/* 제출 버튼 */}
      <Button
        size="md"
        theme="primary"
        type="submit"
        state={isValid ? "default" : "disabled"}
        disabled={!isValid}
        className="w-full text-black"
      >
        작성
      </Button>
    </form>
  );
};

export default ContractRegisterPage;

// 타입은 아래에 선언

type SignatureValue = {
  sign: string;
};

type ContractFormValues = {
  title: string;
  location: string;
  jobDescription: string;
  wage: string;
  signature: SignatureValue;
};
