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
import { DailyAttendanceRecord } from "../../../types/calendar.ts";
import { parseDateStringToKST } from "../../../libs/date.ts";
import { toast } from "react-toastify";
import { showConfirm } from "../../../libs/showConfirm.ts";
import TimeInput from "../../../components/common/TimeInput.tsx";
import { isValidStoreId } from "../../../utils/store.ts";

const schema = z.object({
  clockInStatus: z.enum(["NORMAL", "LATE", "ABSENT"]),
  clockInTime: z.string().min(1, "출근 시간을 입력해주세요"),
  clockOutTime: z.string().min(1, "퇴근 시간을 입력해주세요"),
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
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      clockInStatus: attendance?.clockInStatus ?? "NORMAL",
      clockInTime:
        attendance?.clockInStatus === "ABSENT"
          ? "00:00"
          : (attendance?.clockInTime?.slice(11, 16) ?? ""),
      clockOutTime:
        attendance?.clockInStatus === "ABSENT"
          ? "00:00"
          : (attendance?.clockOutTime?.slice(11, 16) ?? ""),
    },
  });

  const clockInStatus = watch("clockInStatus");

  const onSubmit = async (data: FormData) => {
    if (!isValidStoreId(storeId)) {
      setBottomSheetOpen(false);
      return;
    }
    try {
      await updateAttendance(storeId, schedule.scheduleId, {
        clockInStatus: data.clockInStatus,
        clockInTime:
          data.clockInStatus === "ABSENT" ? "00:00" : data.clockInTime,
        clockOutTime:
          data.clockInStatus === "ABSENT" ? "00:00" : data.clockOutTime,
      });
      const dateKey = formatFullDate(parseDateStringToKST(schedule.workDate));
      await useScheduleStore.getState().syncScheduleAndDot(storeId, dateKey);
      toast.success("근태 정보가 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("근태 수정 실패", err);
    } finally {
      setBottomSheetOpen(false);
    }
  };

  const onDelete = async () => {
    if (!isValidStoreId(storeId)) {
      setBottomSheetOpen(false);
      return;
    }

    const confirmed = await showConfirm({
      title: "정말 삭제할까요?",
      text: "삭제한 근태 기록은 복구할 수 없어요",
      confirmText: "삭제할래요",
      cancelText: "취소할래요",
      icon: "question",
    });

    if (!confirmed) return;

    try {
      await deleteAttendance(storeId, schedule.scheduleId);
      const dateKey = formatFullDate(parseDateStringToKST(schedule.workDate));
      await useScheduleStore.getState().syncScheduleAndDot(storeId, dateKey);
      toast.success("근태 기록이 삭제되었습니다.");
    } catch (err) {
      console.error("근태 삭제 실패", err);
      toast.error("근태 기록 삭제에 실패했어요.");
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
          <div className="w-12">
            <p className="text-sm font-medium text-center">{staff.name}</p>
          </div>
        </div>
      </section>

      <section>
        <label className="title-1 block mb-3">근무 일정</label>
        <TextField
          type="text"
          value={formatFullDate(parseDateStringToKST(schedule.workDate))}
          state="disable"
        />
      </section>

      <section>
        <label className="title-1 block mb-3">근무 시간</label>
        <div className="flex w-full gap-2 flex-wrap">
          <TimeInput
            value={schedule.startTime.slice(11, 16)}
            onChange={() => {}}
            disabled
          />
          <span className="self-center text-gray-400">~</span>
          <TimeInput
            value={schedule.endTime.slice(11, 16)}
            onChange={() => {}}
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
              shouldDirty: true,
            })
          }
        />
      </section>

      {clockInStatus !== "ABSENT" && (
        <section>
          <label className="title-1 block mb-3">근태 시간</label>
          <div className="flex w-full gap-2 flex-wrap">
            <TimeInput
              value={watch("clockInTime") ?? ""}
              onChange={(val) =>
                setValue("clockInTime", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={!!errors.clockInTime}
            />
            <span className="self-center text-gray-400">~</span>
            <TimeInput
              value={watch("clockOutTime") ?? ""}
              onChange={(val) =>
                setValue("clockOutTime", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={!!errors.clockOutTime}
            />
          </div>
          {(errors.clockInTime || errors.clockOutTime) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.clockInTime?.message || errors.clockOutTime?.message}
            </p>
          )}
        </section>
      )}

      <div className="mt-4 flex justify-between gap-3 bg-white">
        <Button
          type="button"
          onClick={onDelete}
          className="flex-1 border border-gray-300 bg-white text-red-500"
        >
          삭제
        </Button>
        <Button
          type="submit"
          theme="primary"
          className="flex-1"
          state={isDirty && isValid ? "default" : "disabled"}
          disabled={!isDirty || !isValid}
        >
          수정
        </Button>
      </div>
    </form>
  );
};

export default AttendanceEditForm;
