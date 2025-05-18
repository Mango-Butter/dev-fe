import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Button from "../../../components/common/Button.tsx";
import TextField from "../../../components/common/TextField.tsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import RangeDatePicker from "../../../components/common/RangeDatePicker.tsx";
import {
  dayOfWeekList,
  weekdayKorean,
  DayOfWeek,
} from "../../../types/staff.ts";
import SignaturePadSheet from "./SignaturePadSheet.tsx";
import { createContract } from "../../../api/boss/contract.ts";
import { useNavigate } from "react-router-dom";

interface ContractFormValues {
  title: string;
  range: [Date | null, Date | null];
  duty: string;
  weekdays: DayOfWeek[];
  time: Record<DayOfWeek, { start: string; end: string }>;
  hourlyWage: number;
  bossSignatureKey: string;
}

const ContractTemplateRegisterPage = () => {
  useLayout({
    title: "기본 근로계약서",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: null,
  });

  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { isValid },
  } = useForm<ContractFormValues>({
    mode: "onChange",
    defaultValues: {
      title: "",
      range: [null, null],
      duty: "",
      weekdays: [],
      time: {} as any,
      hourlyWage: 10030,
      bossSignatureKey: "",
    },
  });

  const selectedDays = watch("weekdays");
  const { setBottomSheetContent, setBottomSheetOpen } = useBottomSheetStore();

  const toggleDay = (day: DayOfWeek) => {
    const current = watch("weekdays");
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("weekdays", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: ContractFormValues) => {
    if (!selectedStore) return;

    try {
      setLoading(true);

      const [contractStart, contractEnd] = data.range;
      if (!contractStart || !contractEnd) throw new Error("계약 기간 미입력");

      const workSchedules = data.weekdays.map((day) => {
        const time = data.time[day];
        return {
          dayOfWeek: day,
          startTime: time.start,
          endTime: time.end,
        };
      });

      const payload = {
        title: data.title,
        bossSignatureKey: data.bossSignatureKey,
        contractDataInput: {
          contractName: "기본 근로계약서",
          contractStart: contractStart.toISOString().split("T")[0],
          contractEnd: contractEnd.toISOString().split("T")[0],
          duty: data.duty,
          workSchedules,
          hourlyWage: data.hourlyWage,
        },
      };

      //Todo: 템플릿생성 api로 바꾸기
      const res = await createContract(selectedStore.storeId, payload);
      console.log("계약서 생성 성공", res);

      navigate(`/boss/contract/${res.contractId}`); // ✅ 이동
    } catch (err) {
      console.error("계약서 제출 실패", err);
      alert("계약서 제출에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full h-full flex flex-col gap-6 p-6">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              title="템플릿 이름"
              placeholder="기본 초급 템플릿"
              required
              {...field}
            />
          )}
        />

        <Controller
          name="range"
          control={control}
          render={({ field }) => (
            <section>
              <label className="title-1 block mb-2">
                근로계약 기간 <span className="text-red-500">*</span>
              </label>
              <RangeDatePicker
                value={field.value}
                onChange={field.onChange}
                mode="future"
              />
            </section>
          )}
        />

        <Controller
          name="duty"
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

        <section>
          <label className="title-1 block mb-2">
            근무 요일 선택 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-7 gap-2">
            {dayOfWeekList.map((day) => (
              <button
                type="button"
                key={day}
                className={`rounded-lg border p-2 text-sm ${
                  selectedDays.includes(day)
                    ? "border-yellow-300 bg-yellow-100 text-black"
                    : "text-gray-600"
                }`}
                onClick={() => toggleDay(day)}
              >
                {weekdayKorean[day]}
              </button>
            ))}
          </div>
        </section>

        {selectedDays.map((day) => (
          <section key={day}>
            <label className="text-sm font-medium">
              {weekdayKorean[day]} 근무 시간{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="time"
                {...register(`time.${day}.start`)}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
              <span className="self-center text-gray-400">~</span>
              <input
                type="time"
                {...register(`time.${day}.end`)}
                className="flex-1 rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </section>
        ))}

        <Controller
          name="hourlyWage"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value as number}
              title="시급"
              min={1}
              placeholder="10,030"
              description="현재 최저시급은 10,030원 입니다."
              type="number"
              theme="suffix"
              suffix="원"
              required
            />
          )}
        />

        <Controller
          name="bossSignatureKey"
          control={control}
          render={() => (
            <div className="flex flex-col gap-2">
              <div className="flex title-1 text-black gap-1">
                서명<span className="text-warning">*</span>
              </div>
              <div
                className="h-44 px-6 py-4 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer bg-white"
                onClick={() => {
                  setBottomSheetContent(
                    <SignaturePadSheet
                      onComplete={({ base64, signatureKey }) => {
                        setSignatureImage(base64); // ✅ 이미지 상태에 저장
                        setValue("bossSignatureKey", signatureKey); // ✅ 폼에는 key만 저장
                        setBottomSheetOpen(false);
                      }}
                    />,
                    { title: "서명 그리기" },
                  );
                }}
              >
                {signatureImage ? (
                  <img
                    src={signatureImage}
                    alt="서명 이미지"
                    className="h-full object-contain"
                  />
                ) : (
                  "근로계약서에 적용할 서명을 진행해주세요."
                )}
              </div>
            </div>
          )}
        />
        <Button
          size="lg"
          theme="primary"
          type="submit"
          disabled={!isValid || loading}
          state={loading ? "disabled" : isValid ? "default" : "disabled"}
          className="w-full my-6"
        >
          {loading ? "작성 중..." : "작성"}
        </Button>
      </div>
    </form>
  );
};

export default ContractTemplateRegisterPage;
