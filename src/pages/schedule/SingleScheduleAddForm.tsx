// src/components/schedule/SingleScheduleAddForm.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SingleDatePicker from "../../components/common/SingleDatePicker";
import { createSingleSchedule } from "../../api/schedule.ts";

const schema = z
  .object({
    date: z
      .date()
      .nullable()
      .refine((d) => d !== null, { message: "날짜를 선택해주세요" }),
    startTime: z.string().min(1, "시작 시간을 입력해주세요"),
    endTime: z.string().min(1, "종료 시간을 입력해주세요"),
  })
  .refine(
    ({ startTime, endTime }) => {
      if (!startTime || !endTime) return true;
      return startTime < endTime;
    },
    {
      message: "종료 시간은 시작 시간보다 이후여야 합니다",
      path: ["endTime"], // 🔥 오류 메시지를 endTime 필드에 표시
    },
  );

type FormData = {
  date: Date | null;
  startTime: string;
  endTime: string;
};

const SingleScheduleAddForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: null,
      startTime: "",
      endTime: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createSingleSchedule(1, {
        staffId: 1,
        workDate: data.date!.toISOString().slice(0, 10),
        startTime: data.startTime,
        endTime: data.endTime,
      });
      alert("스케줄이 성공적으로 추가되었습니다!");
    } catch (err) {
      console.error("스케줄 추가 실패", err);
      alert("스케줄 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <section>
        <h2 className="font-semibold text-sm text-gray-700">근무자</h2>
        <ul className="mt-2 flex gap-3">
          {[1, 2, 3, 4, 5].map((id) => (
            <li key={id} className="flex flex-col items-center">
              <img
                src={`https://i.pravatar.cc/48?img=${id}`}
                alt={`avatar-${id}`}
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="text-xs mt-1">알바생 {id}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <label className="text-sm font-medium block mb-2">
          근무 일정 <span className="text-red-500">*</span>
        </label>
        <SingleDatePicker
          value={watch("date")}
          onChange={(date) => setValue("date", date, { shouldValidate: true })}
          mode="future"
          placeholder="추가할 일정을 선택해 주세요"
        />
        {errors.date && (
          <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
        )}
      </section>

      <section>
        <label className="text-sm font-medium">
          근무 시간 <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="time"
            {...register("startTime")}
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
          <span className="self-center text-gray-400">~</span>
          <input
            type="time"
            {...register("endTime")}
            className="flex-1 rounded-md border px-3 py-2 text-sm"
          />
        </div>
        {(errors.startTime || errors.endTime) && (
          <p className="text-xs text-red-500 mt-1">
            {errors.startTime?.message || errors.endTime?.message}
          </p>
        )}
      </section>

      <div
        data-footer
        className="sticky bottom-0 mt-4 flex justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3"
      >
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

export default SingleScheduleAddForm;
