import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Button from "../../../components/common/Button.tsx";
import TextField from "../../../components/common/TextField.tsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import RangeDatePicker from "../../../components/common/RangeDatePicker.tsx";
import {
  dayOfWeekList,
  weekdayKorean,
  DayOfWeek,
} from "../../../types/staff.ts";
import { useNavigate } from "react-router-dom";
import { createContractTemplate } from "../../../api/boss/contractTemplate.ts";
import {
  ContractTemplateFormValues,
  contractTemplateSchema,
} from "../../../schemas/contractTemplateSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDateToKSTString } from "../../../libs/date.ts";

const ContractTemplateRegisterPage = () => {
  useLayout({
    title: "근로계약서 템플릿 생성",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: null,
  });

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
  } = useForm<ContractTemplateFormValues>({
    mode: "onChange",
    resolver: zodResolver(contractTemplateSchema),
    defaultValues: {
      title: "",
      range: [null, null],
      duty: "",
      weekdays: [],
      time: {} as any,
      hourlyWage: undefined,
    },
  });

  const selectedDays = watch("weekdays") ?? [];

  const toggleDay = (day: DayOfWeek) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue("weekdays", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: ContractTemplateFormValues) => {
    if (!selectedStore) return;

    try {
      setLoading(true);

      const [contractStart, contractEnd] = data.range;

      const workSchedules =
        selectedDays.length > 0
          ? selectedDays.map((day) => {
              const timeForDay = data.time?.[day];
              return {
                dayOfWeek: day,
                startTime: timeForDay?.start ?? null,
                endTime: timeForDay?.end ?? null,
              };
            })
          : null;

      const payload = {
        title: data.title,
        contractTemplateData: {
          contractStart: contractStart
            ? formatDateToKSTString(contractStart)
            : null,
          contractEnd: contractEnd ? formatDateToKSTString(contractEnd) : null,
          duty: data.duty || null,
          hourlyWage:
            typeof data.hourlyWage === "number" ? data.hourlyWage : null,
          workSchedules,
        },
      };

      await createContractTemplate(selectedStore.storeId, payload);
      alert("템플릿이 성공적으로 등록되었습니다.");
      navigate("/boss/contract/template");
    } catch (err) {
      console.error("템플릿 저장 실패", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full h-full flex flex-col gap-6 p-6 overflow-y-auto">
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
              <label className="title-1 block mb-2">근로계약 기간</label>
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
            <TextField title="업무" placeholder="예) 홀 서빙" {...field} />
          )}
        />

        <section>
          <label className="title-1 block mb-2">근무 요일 선택</label>
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
              {weekdayKorean[day]} 근무 시간
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
              title="시급"
              placeholder="10,030"
              description="현재 최저시급은 10,030원 입니다."
              type="number"
              theme="suffix"
              suffix="원"
              {...register("hourlyWage", { valueAsNumber: true })}
            />
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
