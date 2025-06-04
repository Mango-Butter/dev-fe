import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "../../../components/common/TextField.tsx";
import Button from "../../../components/common/Button.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import { formatFullDate } from "../../../utils/date.ts";
import SelectField from "../../../components/common/SelectField.tsx";
import { useEffect, useState } from "react";
import { DailyAttendanceRecord } from "../../../types/calendar.ts";
import { parseDateStringToKST } from "../../../libs/date.ts";
import { toast } from "react-toastify";
import { requestAttendanceEdit } from "../../../api/staff/attendance.ts";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import TimeInput from "../../../components/common/TimeInput.tsx";
import { isValidStoreId } from "../../../utils/store.ts";

const schema = z
  .object({
    clockInStatus: z.enum(["NORMAL", "LATE", "ABSENT"]),
    clockInTime: z.string().optional(),
    clockOutTime: z.string().optional(),
    reason: z.string().min(1, "사유를 입력해주세요"),
  })
  .superRefine((data, ctx) => {
    if (data.clockInStatus !== "ABSENT") {
      if (!data.clockInTime || data.clockInTime.trim() === "") {
        ctx.addIssue({
          path: ["clockInTime"],
          code: z.ZodIssueCode.custom,
          message: "출근 시간을 입력해주세요",
        });
      }
      if (!data.clockOutTime || data.clockOutTime.trim() === "") {
        ctx.addIssue({
          path: ["clockOutTime"],
          code: z.ZodIssueCode.custom,
          message: "퇴근 시간을 입력해주세요",
        });
      }
    }
  });

type FormData = z.infer<typeof schema>;

const StaffAttendanceEditForm = ({
  schedule,
  staff,
  attendance,
}: DailyAttendanceRecord) => {
  const { setBottomSheetOpen } = useBottomSheetStore();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues:
      attendance?.clockInStatus === "ABSENT"
        ? {
            clockInStatus: "ABSENT",
            clockInTime: "",
            clockOutTime: "",
            reason: "",
          }
        : {
            clockInStatus: attendance?.clockInStatus ?? "NORMAL",
            clockInTime: attendance?.clockInTime?.slice(11, 16) ?? "",
            clockOutTime: attendance?.clockOutTime?.slice(11, 16) ?? "",
            reason: "",
          },
  });

  const clockInStatus = watch("clockInStatus");

  useEffect(() => {
    if (clockInStatus === "ABSENT") {
      setValue("clockInTime", "00:00");
      setValue("clockOutTime", "00:00");
    }
  }, [clockInStatus, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!isValidStoreId(storeId)) {
      setBottomSheetOpen(false);
      return;
    }

    try {
      await requestAttendanceEdit(storeId, schedule.scheduleId, {
        requestedClockInStatus: data.clockInStatus,
        requestedClockInTime:
          data.clockInStatus === "ABSENT" ? "00:00" : data.clockInTime!,
        requestedClockOutTime:
          data.clockInStatus === "ABSENT" ? "00:00" : data.clockOutTime!,
        reason: data.reason,
      });
      toast.success("근태 수정 요청이 성공적으로 발송되었습니다.");
    } catch (err) {
      console.error("근태 수정 요청 실패", err);
    } finally {
      setBottomSheetOpen(false);
    }
  };

  if (!selectedStore) {
    return (
      <div className="text-center py-10 text-grayscale-500">
        선택된 매장이 없습니다.
      </div>
    );
  }

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
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
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
          disabled={!isEditMode}
        />
      </section>

      {clockInStatus !== "ABSENT" && (
        <section>
          <label className="title-1 block mb-3">근태 시간</label>
          <div className="flex gap-2 flex-wrap">
            <TimeInput
              value={watch("clockInTime") || ""}
              onChange={(val) =>
                setValue("clockInTime", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={!!errors.clockInTime}
              disabled={!isEditMode}
            />
            <span className="self-center text-gray-400">~</span>
            <TimeInput
              value={watch("clockOutTime") || ""}
              onChange={(val) =>
                setValue("clockOutTime", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              error={!!errors.clockOutTime}
              disabled={!isEditMode}
            />
          </div>
        </section>
      )}
      {isEditMode && (
        <section>
          <label htmlFor="reason" className="title-1 block mb-3">
            사유
          </label>
          <textarea
            id="reason"
            {...register("reason")}
            placeholder="근태 수정 요청 사유를 입력해주세요"
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 p-4 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            readOnly={!isEditMode}
          />
        </section>
      )}
      {selectedStore.staff.staffId === staff.staffId && (
        <div className="mt-4 flex justify-between gap-3 bg-white">
          {isEditMode ? (
            <>
              <Button
                type="button"
                theme="outline"
                size="md"
                className="flex-1"
                state="default"
                onClick={() => setIsEditMode(false)}
              >
                취소
              </Button>
              <Button
                type="submit"
                theme="secondary"
                size="md"
                className="flex-1"
                state={isDirty && isValid ? "default" : "disabled"}
                disabled={!isDirty || !isValid}
              >
                요청 보내기
              </Button>
            </>
          ) : (
            <Button
              type="button"
              size="md"
              theme="secondary"
              className="flex-1"
              state="default"
              onClick={() => setIsEditMode(true)}
            >
              근태 수정 요청하기
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default StaffAttendanceEditForm;
