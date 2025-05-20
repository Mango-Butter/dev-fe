import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RangeDatePicker from "../../../components/common/RangeDatePicker.tsx";
import {
  DayOfWeek,
  CreateRegularScheduleDto,
  dayOfWeekList,
  weekdayKorean,
} from "../../../types/staff.ts";
import { createRegularSchedules } from "../../../api/boss/staff.ts";
import Button from "../../../components/common/Button.tsx";
import useStoreStore from "../../../stores/storeStore.ts";
import useSelectedStaffStore from "../../../stores/selectedStaffStore.ts";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";

const schema = z.object({
  range: z
    .tuple([z.date().nullable(), z.date().nullable()])
    .refine(([start, end]) => !!start && !!end && start <= end, {
      message: "유효한 반복 기간을 선택해주세요",
    }),
  selectedDays: z
    .array(z.enum(dayOfWeekList), { required_error: "요일을 선택해주세요" })
    .min(1, "근무 요일을 선택해주세요"),
  timeMap: z.record(
    z.enum(dayOfWeekList),
    z
      .object({
        startTime: z.string().min(1, "시작시간 필수"),
        endTime: z.string().min(1, "종료시간 필수"),
      })
      .refine(({ startTime, endTime }) => startTime < endTime, {
        message: "시작시간은 종료시간보다 빨라야 합니다",
      }),
  ),
});

type FormData = {
  range: [Date | null, Date | null];
  selectedDays: DayOfWeek[];
  timeMap: Partial<Record<DayOfWeek, { startTime: string; endTime: string }>>;
};

interface Props {
  onSuccess?: () => void;
}

const RegularScheduleAddForm = ({ onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      range: [null, null],
      selectedDays: [],
      timeMap: {},
    },
  });

  const selectedDays = watch("selectedDays");
  const toggleDay = (day: DayOfWeek) => {
    const current = watch("selectedDays");
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("selectedDays", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    const [startDateObj, endDateObj] = data.range;
    if (!startDateObj || !endDateObj) return;

    const startDate = startDateObj.toISOString().slice(0, 10);
    const endDate = endDateObj.toISOString().slice(0, 10);

    const payload: CreateRegularScheduleDto[] = data.selectedDays.map((day) => {
      const time = data.timeMap[day];
      if (!time) throw new Error(`${day} 요일에 대한 시간 정보가 없습니다`);
      return {
        dayOfWeek: day,
        startDate,
        endDate,
        startTime: time.startTime,
        endTime: time.endTime,
      };
    });

    const { selectedStore } = useStoreStore.getState();
    const { selectedStaffId } = useSelectedStaffStore.getState();
    const { setBottomSheetOpen } = useBottomSheetStore.getState();

    if (!selectedStore || !selectedStaffId) {
      alert("매장 또는 알바생 정보가 없습니다.");
      return;
    }

    try {
      await createRegularSchedules(
        selectedStore.storeId,
        Number(selectedStaffId),
        payload,
      );
      onSuccess?.();
    } catch (err) {
      console.error("고정 스케줄 생성 실패", err);
      alert("스케줄 추가 중 오류가 발생했습니다.");
    } finally {
      setBottomSheetOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <section>
        <label className="text-sm font-medium block mb-2">
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
        {errors.selectedDays && (
          <p className="text-xs text-red-500 mt-1">
            {errors.selectedDays.message}
          </p>
        )}
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
              {...register(`timeMap.${day}.startTime`)}
              className="flex-1 rounded-md border px-3 py-2 text-sm"
            />
            <span className="self-center text-gray-400">~</span>
            <input
              type="time"
              {...register(`timeMap.${day}.endTime`)}
              className="flex-1 rounded-md border px-3 py-2 text-sm"
            />
          </div>
          {errors.timeMap?.[day]?.message && (
            <p className="text-xs text-red-500 mt-1">
              {errors.timeMap[day].message}
            </p>
          )}
        </section>
      ))}

      <section>
        <label className="text-sm font-medium block mb-2">
          반복 기간 <span className="text-red-500">*</span>
        </label>
        <Controller
          name="range"
          control={control}
          render={({ field }) => (
            <RangeDatePicker
              value={field.value}
              onChange={field.onChange}
              mode="future"
            />
          )}
        />
        {errors.range && (
          <p className="text-xs text-red-500 mt-1">{errors.range.message}</p>
        )}
      </section>

      <div className="sticky bottom-0 mt-4 flex justify-between gap-3 bg-white py-3">
        <Button theme="outline" className="flex-1">
          취소
        </Button>
        <Button type="submit" theme="primary" className="flex-1">
          추가
        </Button>
      </div>
    </form>
  );
};

export default RegularScheduleAddForm;
