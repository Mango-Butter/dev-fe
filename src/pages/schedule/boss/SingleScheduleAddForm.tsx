import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import SingleDatePicker from "../../../components/common/SingleDatePicker.tsx";
import { createSingleSchedule } from "../../../api/boss/schedule.ts";
import { StaffBrief } from "../../../types/staff.ts";
import { getStaffBriefList } from "../../../api/boss/staff.ts";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { formatFullDate } from "../../../utils/date.ts";
import { getDefaultScheduleTimes } from "../../../utils/time.ts";
import TextField from "../../../components/common/TextField.tsx";
import Button from "../../../components/common/Button.tsx";
import { formatDateToKSTString, getKSTDate } from "../../../libs/date.ts";
import { toast } from "react-toastify";

interface SingleScheduleAddFormProps {
  defaultDate?: Date;
}

const schema = z.object({
  staffId: z
    .number({ required_error: "알바생을 선택해주세요" })
    .refine((val) => val !== 0, { message: "알바생을 선택해주세요" }),
  date: z
    .date()
    .nullable()
    .refine((d) => d !== null, {
      message: "날짜를 선택해주세요",
    }),
  startTime: z.string().min(1, "시작 시간을 입력해주세요"),
  endTime: z.string().min(1, "종료 시간을 입력해주세요"),
});

type FormData = {
  staffId: number;
  date: Date | null;
  startTime: string;
  endTime: string;
};

const SingleScheduleAddForm = ({ defaultDate }: SingleScheduleAddFormProps) => {
  const { setBottomSheetOpen } = useBottomSheetStore();
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const [staffList, setStaffList] = useState<StaffBrief[]>([]);
  const { startTime, endTime } = getDefaultScheduleTimes("half");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      staffId: 0,
      date: defaultDate ?? getKSTDate(),
      startTime,
      endTime,
    },
  });

  const selectedStaffId = watch("staffId");

  useEffect(() => {
    const fetchStaffs = async () => {
      if (!storeId) return;
      try {
        const data = await getStaffBriefList(storeId);
        setStaffList(data);
      } catch (err) {
        console.error("알바생 목록 조회 실패", err);
      }
    };
    fetchStaffs();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!storeId || !data.date) return;

    const workDate = formatDateToKSTString(data.date);
    const dateKey = formatFullDate(data.date);

    try {
      await createSingleSchedule(storeId, {
        staffId: data.staffId,
        workDate,
        startTime: data.startTime,
        endTime: data.endTime,
      });

      // 서버 등록 후 최신 상태 fetch로 동기화
      await useScheduleStore.getState().syncScheduleAndDot(storeId, dateKey);

      toast.success("스케줄이 성공적으로 추가되었습니다!");
    } catch (err) {
      console.error("스케줄 추가 실패", err);
    } finally {
      setBottomSheetOpen(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full gap-4"
    >
      <section>
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">근무자</label>
          <span className="title-1 text-warning">*</span>
        </div>
        <ul className="mt-2 flex gap-3 overflow-x-auto">
          {staffList.map((staff) => (
            <li
              key={staff.staffId}
              className={`flex flex-col items-center cursor-pointer m-1 ${
                selectedStaffId === staff.staffId
                  ? "font-bold text-yellow-500"
                  : ""
              }`}
              onClick={() =>
                setValue("staffId", staff.staffId, { shouldValidate: true })
              }
            >
              <img
                src={staff.profileImageUrl}
                alt={staff.name}
                className={`h-12 w-12 rounded-full object-cover ring-4 ${
                  selectedStaffId === staff.staffId
                    ? "ring-yellow-400"
                    : "ring-transparent"
                }`}
              />
              <span className="text-xs mt-1">{staff.name}</span>
            </li>
          ))}
        </ul>
        {errors.staffId && (
          <p className="text-xs text-red-500 mt-1">{errors.staffId.message}</p>
        )}
      </section>

      <section>
        <label className="title-1 block mb-3 text-grayscale-900">
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
        <label className="title-1 block mb-3 text-grayscale-900">
          근무 시간 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <TextField
            type="time"
            step="600"
            {...register("startTime")}
            state={errors.startTime ? "warning" : "none"}
            size="sm"
            required
          />
          <span className="self-center text-gray-400">~</span>
          <TextField
            type="time"
            step="600"
            {...register("endTime")}
            state={errors.endTime ? "warning" : "none"}
            size="sm"
            required
          />
        </div>
        {(errors.startTime || errors.endTime) && (
          <p className="text-xs text-red-500 mt-1">
            {errors.startTime?.message || errors.endTime?.message}
          </p>
        )}
      </section>

      <div className="mt-4 flex justify-between gap-3 bg-white">
        <Button
          type="button"
          onClick={() => setBottomSheetOpen(false)}
          className="flex-1 border border-gray-300 bg-white"
        >
          취소
        </Button>
        <Button
          type="submit"
          theme="primary"
          className="flex-1"
          state={isValid ? "default" : "disabled"}
          disabled={!isValid}
        >
          추가
        </Button>
      </div>
    </form>
  );
};

export default SingleScheduleAddForm;
