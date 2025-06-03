import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SingleDatePicker from "../../../components/common/SingleDatePicker.tsx";
import Button from "../../../components/common/Button.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { formatFullDate } from "../../../utils/date.ts";
import {
  updateSingleSchedule,
  deleteSingleSchedule,
} from "../../../api/boss/schedule.ts";
import { DailyAttendanceRecord } from "../../../types/calendar.ts";
import {
  formatDateToKSTString,
  parseDateStringToKST,
} from "../../../libs/date.ts";
import { toast } from "react-toastify";
import { showConfirm } from "../../../libs/showConfirm.ts";
import TimeInput from "../../../components/common/TimeInput.tsx";
import { isValidStoreId } from "../../../utils/store.ts";

interface SingleScheduleEditFormProps {
  schedule: DailyAttendanceRecord["schedule"];
  staff: DailyAttendanceRecord["staff"];
  attendance: DailyAttendanceRecord["attendance"];
}

const schema = z.object({
  date: z.date({ required_error: "날짜를 선택해주세요" }),
  startTime: z.string().min(1, "시작 시간을 입력해주세요"),
  endTime: z.string().min(1, "종료 시간을 입력해주세요"),
});

type FormData = z.infer<typeof schema>;

const SingleScheduleEditForm = ({
  schedule,
  staff,
}: SingleScheduleEditFormProps) => {
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
      date: parseDateStringToKST(schedule.workDate!),
      startTime: schedule.startTime.slice(11, 16),
      endTime: schedule.endTime.slice(11, 16),
    },
  });

  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const onSubmit = async (data: FormData) => {
    if (!isValidStoreId(storeId)) {
      return;
    }

    try {
      await updateSingleSchedule(storeId, schedule.scheduleId, {
        workDate: formatDateToKSTString(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
      });

      const dateKey = formatFullDate(data.date);
      await useScheduleStore.getState().syncScheduleAndDot(storeId, dateKey);

      toast.success("스케줄이 성공적으로 수정되었습니다.");
    } catch (err) {
      console.error("스케줄 수정 실패", err);
    } finally {
      setBottomSheetOpen(false);
    }
  };

  const onDelete = async () => {
    if (!isValidStoreId(storeId)) {
      return;
    }

    const confirmed = await showConfirm({
      title: "정말로 삭제할까요?",
      text: "이 스케줄을 삭제하면 복구할 수 없어요.",
      confirmText: "삭제할래요",
      cancelText: "취소할래요",
      icon: "question",
    });

    if (!confirmed) return;

    try {
      await deleteSingleSchedule(storeId, schedule.scheduleId);

      const dateKey = formatFullDate(parseDateStringToKST(schedule.workDate));
      await useScheduleStore.getState().syncScheduleAndDot(storeId, dateKey);

      toast.success("스케줄이 삭제되었습니다.");
    } catch (err) {
      console.error("스케줄 삭제 실패", err);
      toast.error("스케줄 삭제에 실패했어요.");
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
        <h2 className="title-1 block mb-3">근무자</h2>
        <div className="flex items-start justify-center flex-col gap-3">
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
        <label className="title-1 block mb-3">
          근무 일정 <span className="text-red-500">*</span>
        </label>
        <SingleDatePicker
          value={watch("date")}
          onChange={(date) =>
            setValue("date", date ?? parseDateStringToKST(schedule.workDate), {
              shouldValidate: true,
            })
          }
          mode="future"
          placeholder="일정을 선택해 주세요"
        />
        {errors.date && (
          <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
        )}
      </section>

      <section>
        <label className="title-1 block mb-3">
          근무 시간 <span className="text-red-500">*</span>
        </label>
        <div className="flex w-full gap-2 flex-wrap">
          <TimeInput
            value={startTime}
            onChange={(val) =>
              setValue("startTime", val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={!!errors.startTime}
          />
          <span className="self-center text-gray-400">~</span>
          <TimeInput
            value={endTime}
            onChange={(val) =>
              setValue("endTime", val, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            error={!!errors.endTime}
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

export default SingleScheduleEditForm;
