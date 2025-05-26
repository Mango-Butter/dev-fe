import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import TextField from "../../../components/common/TextField.tsx";
import SingleDatePicker from "../../../components/common/SingleDatePicker.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import { getStaffBriefList } from "../../../api/boss/staff.ts";
import { StaffBrief } from "../../../types/staff.ts";
import { formatFullDate } from "../../../utils/date.ts";
import Button from "../../../components/common/Button.tsx";
import { createAttendance } from "../../../api/boss/schedule.ts";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { formatDateToKSTString, getKSTDate } from "../../../libs/date.ts";

interface AddAttendanceFormProps {
  defaultDate?: Date;
}

const schema = z.object({
  staffId: z
    .number({ required_error: "알바생을 선택해주세요" })
    .refine((val) => val !== 0, { message: "알바생을 선택해주세요" }),
  date: z.date({ required_error: "날짜를 선택해주세요" }),
  clockInTime: z.string().min(1, "출근 시간을 입력해주세요"),
  clockOutTime: z.string().min(1, "퇴근 시간을 입력해주세요"),
});

type FormData = z.infer<typeof schema>;

const AttendanceAddForm = ({ defaultDate }: AddAttendanceFormProps) => {
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;
  const { setBottomSheetOpen } = useBottomSheetStore();

  const [staffList, setStaffList] = useState<StaffBrief[]>([]);

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
      clockInTime: "09:00",
      clockOutTime: "15:00",
    },
  });

  const selectedStaffId = watch("staffId");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        if (!storeId) return;
        const data = await getStaffBriefList(storeId);
        setStaffList(data);
      } catch (err) {
        console.error("알바생 목록 조회 실패", err);
      }
    };
    fetchStaff();
  }, [storeId]);

  const onSubmit = async (data: FormData) => {
    if (!storeId) return;

    const workDate = formatDateToKSTString(data.date);
    const dateKey = formatFullDate(data.date); // YYYY-MM-DD 형식 문자열

    try {
      await createAttendance(storeId, {
        staffId: data.staffId,
        workDate,
        clockInTime: data.clockInTime,
        clockOutTime: data.clockOutTime,
      });

      await useScheduleStore.getState().syncScheduleAndDot(storeId, dateKey);

      alert("근태가 성공적으로 추가되었습니다.");
    } catch (err) {
      console.error("근태 추가 실패", err);
    } finally {
      setBottomSheetOpen(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <section>
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">근무자</label>
          <span className="title-1 text-warning">*</span>
        </div>
        <ul className="flex gap-3 overflow-x-auto scrollbar-hide">
          {staffList.map((staff) => (
            <li
              key={staff.staffId}
              className={`flex flex-col items-center cursor-pointer m-1 ${
                selectedStaffId === staff.staffId
                  ? "text-yellow-500 font-bold"
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
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">근무 일자</label>
          <span className="title-1 text-warning">*</span>
        </div>
        <SingleDatePicker
          value={watch("date")}
          onChange={(date) =>
            date && setValue("date", date, { shouldValidate: true })
          }
          mode="past"
        />
        {errors.date && (
          <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
        )}
      </section>

      <section>
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">출근 / 퇴근 시간</label>
          <span className="title-1 text-warning">*</span>
        </div>
        <div className="flex w-full gap-2 overflow-x-auto scrollbar-hide">
          <TextField type="time" {...register("clockInTime")} size="sm" />
          <span className="self-center text-gray-400">~</span>
          <TextField type="time" {...register("clockOutTime")} size="sm" />
        </div>
        {(errors.clockInTime || errors.clockOutTime) && (
          <p className="text-xs text-red-500 mt-1">
            {errors.clockInTime?.message || errors.clockOutTime?.message}
          </p>
        )}
      </section>

      <div className="mt-4 flex gap-3 bg-white">
        <Button
          type="button"
          theme="outline"
          className="flex-1"
          onClick={() => setBottomSheetOpen(false)}
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

export default AttendanceAddForm;
