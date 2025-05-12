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

const ScheduleAddForm = () => {
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

    await createRegularSchedules(1, 1, payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <section>
        <label className="text-sm font-medium block mb-2">
          근무 요일 선택 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {dayOfWeekList.map((day) => (
            <button
              type="button"
              key={day}
              className={`rounded-full border px-3 py-1 text-sm ${
                selectedDays.includes(day)
                  ? "bg-yellow-400 text-white"
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

      <div className="sticky bottom-0 mt-4 flex justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3">
        <button
          type="button"
          className="flex-1 rounded-lg border border-gray-300 py-2 text-sm"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 rounded-lg bg-yellow-400 py-2 text-sm font-semibold text-white"
        >
          추가
        </button>
      </div>
    </form>
  );
};

export default ScheduleAddForm;
