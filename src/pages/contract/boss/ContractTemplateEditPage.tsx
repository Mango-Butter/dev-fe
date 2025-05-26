import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import {
  deleteContractTemplate,
  fetchContractTemplateDetail,
  updateContractTemplate,
} from "../../../api/boss/contractTemplate.ts";
import {
  ContractTemplateFormValues,
  contractTemplateSchema,
} from "../../../schemas/contractTemplateSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  formatDateToKSTString,
  parseDateStringToKST,
} from "../../../libs/date.ts";

const ContractTemplateEditPage = () => {
  useLayout({
    title: "근로계약서 템플릿 수정",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const { id: templateId } = useParams();

  const {
    control,
    handleSubmit,
    setValue,
    register,
    reset,
    watch,
    formState: { isValid, isDirty },
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

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateId || !selectedStore) return;

      try {
        const data = await fetchContractTemplateDetail(
          selectedStore.storeId,
          Number(templateId),
        );

        reset({
          title: data.title,
          range: [
            data.contractTemplateData.contractStart
              ? parseDateStringToKST(data.contractTemplateData.contractStart)
              : null,
            data.contractTemplateData.contractEnd
              ? parseDateStringToKST(data.contractTemplateData.contractEnd)
              : null,
          ],
          duty: data.contractTemplateData.duty ?? "",
          weekdays:
            data.contractTemplateData.workSchedules
              ?.map((s) => s.dayOfWeek)
              .filter((d): d is DayOfWeek => d !== null && d !== undefined) ??
            [],
          time: Object.fromEntries(
            (data.contractTemplateData.workSchedules ?? []).map((s) => [
              s.dayOfWeek,
              { start: s.startTime ?? "", end: s.endTime ?? "" },
            ]),
          ),
          hourlyWage: data.contractTemplateData.hourlyWage ?? undefined,
        });
      } catch (err) {
        console.error("템플릿 불러오기 실패", err);
        alert("템플릿을 불러오지 못했습니다.");
        navigate("/boss/contract/template");
      }
    };

    fetchTemplate();
  }, [templateId, selectedStore]);

  const toggleDay = (day: DayOfWeek) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue("weekdays", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: ContractTemplateFormValues) => {
    if (!selectedStore || !templateId) return;

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

      await updateContractTemplate(
        selectedStore.storeId,
        Number(templateId),
        payload,
      );
      alert("템플릿이 성공적으로 수정되었습니다.");
      navigate("/boss/contract/template");
    } catch (err) {
      console.error("템플릿 수정 실패", err);
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
              required
              {...register("hourlyWage", { valueAsNumber: true })}
            />
          )}
        />

        <div className="flex gap-2">
          <Button
            size="md"
            theme="outline"
            type="button"
            onClick={async () => {
              if (!selectedStore || !templateId) return;
              if (!confirm("정말 삭제하시겠습니까?")) return;
              try {
                await deleteContractTemplate(
                  selectedStore.storeId,
                  Number(templateId),
                );
                alert("삭제 완료");
                navigate("/boss/contract/template");
              } catch (err) {
                console.error("삭제 실패", err);
              }
            }}
            className="w-full"
          >
            삭제
          </Button>
          <Button
            size="md"
            theme="primary"
            type="submit"
            disabled={!isValid || !isDirty || loading}
            state={!isValid || !isDirty || loading ? "disabled" : "default"}
            className="w-full"
          >
            {loading ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ContractTemplateEditPage;
