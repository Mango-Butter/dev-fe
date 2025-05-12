import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../../components/common/TextField.tsx";
import Button from "../../../components/common/Button.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { formatFullDate } from "../../../utils/date.ts";
import SelectField from "../../../components/common/SelectField.tsx";
import {
  updateAttendance,
  deleteAttendance,
} from "../../../api/boss/schedule.ts";
import { useEffect } from "react";
import { DailyAttendanceRecord } from "../../../types/calendar.ts";

const schema = z.object({
  clockInStatus: z.enum(["NORMAL", "LATE", "ABSENT"]),
  clockInTime: z.string().nullable(),
  clockOutTime: z.string().nullable(),
});

type FormData = z.infer<typeof schema>;

const AttendanceEditForm = ({
  schedule,
  staff,
  attendance,
}: DailyAttendanceRecord) => {
  const { setBottomSheetOpen } = useBottomSheetStore();
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clockInStatus: attendance?.clockInStatus ?? "NORMAL",
      clockInTime: attendance?.clockInTime
        ? attendance.clockInTime.slice(11, 16)
        : null,
      clockOutTime: attendance?.clockOutTime
        ? attendance.clockOutTime.slice(11, 16)
        : null,
    },
  });

  const clockInStatus = watch("clockInStatus");

  useEffect(() => {
    if (clockInStatus === "ABSENT") {
      setValue("clockInTime", null);
      setValue("clockOutTime", null);
    }
  }, [clockInStatus, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!storeId) return;
    try {
      await updateAttendance(storeId, schedule.scheduleId, {
        clockInStatus: data.clockInStatus,
        clockInTime: data.clockInTime ?? null,
        clockOutTime: data.clockOutTime ?? null,
      });
      const dateKey = formatFullDate(new Date(schedule.workDate));
      await useScheduleStore.getState().syncScheduleAndDot(storeId, dateKey);
      alert("근태 정보가 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("근태 수정 실패", err);
      alert("근태 수정 중 오류가 발생했습니다.");
    } finally {
      setBottomSheetOpen(false);
    }
  };

  const onDelete = async () => {
    if (!storeId) return;
    if (!confirm("정말로 이 근태 기록을 삭제하시겠습니까?")) return;
    try {
      await deleteAttendance(storeId, schedule.scheduleId);
      const dateKey = formatFullDate(new Date(schedule.workDate));
      await useScheduleStore.getState().syncScheduleAndDot(storeId, dateKey);
      alert("근태 기록이 삭제되었습니다.");
    } catch (err) {
      console.error("근태 삭제 실패", err);
      alert("근태 삭제 중 오류가 발생했습니다.");
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
        <h2 className="title-1 mb-3">근무자</h2>
        <div className="flex w-full items-start justify-center flex-col gap-3">
          <img
            src={staff.profileImageUrl}
            alt={staff.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="text-sm font-medium">{staff.name}</p>
        </div>
      </section>

      <section>
        <label className="title-1 block mb-3">근무 일정</label>
        <TextField
          type="text"
          value={formatFullDate(new Date(schedule.workDate))}
          disabled
        />
      </section>

      <section>
        <label className="title-1 block mb-3">근무 시간</label>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <TextField
            type="time"
            value={schedule.startTime.slice(11, 16)}
            disabled
          />
          <span className="self-center text-gray-400">~</span>
          <TextField
            type="time"
            value={schedule.endTime.slice(11, 16)}
            disabled
          />
        </div>
      </section>

      <section>
        <SelectField
          title="출근 상태"
          options={[
            { label: "정상", value: "NORMAL" },
            { label: "지각", value: "LATE" },
            { label: "결근", value: "ABSENT" },
          ]}
          value={clockInStatus}
          onChange={(val) =>
            setValue("clockInStatus", val as FormData["clockInStatus"], {
              shouldValidate: true,
            })
          }
        />
      </section>

      {clockInStatus !== "ABSENT" && (
        <section>
          <label className="title-1 block mb-3">근태 시간</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <TextField
              type="time"
              {...register("clockInTime")}
              state={errors.clockInTime ? "warning" : "none"}
              required
            />
            <span className="self-center text-gray-400">~</span>
            <TextField
              type="time"
              {...register("clockOutTime")}
              state={errors.clockOutTime ? "warning" : "none"}
              required
            />
          </div>
        </section>
      )}

      <div className="sticky bottom-0 mt-4 flex justify-between gap-3 bg-white">
        <Button
          type="button"
          onClick={onDelete}
          className="flex-1 border border-gray-300 bg-white text-red-500"
        >
          삭제
        </Button>
        <Button type="submit" className="flex-1 bg-yellow-400 text-white">
          수정
        </Button>
      </div>
    </form>
  );
};

export default AttendanceEditForm;
