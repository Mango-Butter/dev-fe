import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import TextField from "../../../components/common/TextField.tsx";
import Button from "../../../components/common/Button.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import { formatFullDate } from "../../../utils/date.ts";
import { parseDateStringToKST } from "../../../libs/date.ts";
import {
  requestSubstitution,
  fetchSubstituteCandidates,
} from "../../../api/staff/schedule.ts";
import { DailyAttendanceRecord } from "../../../types/calendar.ts";
import { SubstituteCandidate } from "../../../types/schedule.ts";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import TimeInput from "../../../components/common/TimeInput.tsx";
import { isValidStoreId } from "../../../utils/store.ts";

const schema = z.object({
  targetStaffId: z.number({ required_error: "대타 근무자를 선택해주세요" }),
  reason: z.string().min(1, "사유를 입력해주세요"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  schedule: DailyAttendanceRecord["schedule"];
  staff: DailyAttendanceRecord["staff"];
  attendance: DailyAttendanceRecord["attendance"];
}

const StaffScheduleEditForm = ({ schedule, staff }: Props) => {
  const { setBottomSheetOpen } = useBottomSheetStore();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;

  const [isEditMode, setIsEditMode] = useState(false);
  const [candidates, setCandidates] = useState<SubstituteCandidate[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      targetStaffId: 0,
      reason: "",
    },
  });

  const selectedStaffId = watch("targetStaffId");

  const onSubmit = async (data: FormData) => {
    if (!isValidStoreId(storeId)) {
      setBottomSheetOpen(false);
      return;
    }

    try {
      await requestSubstitution(storeId, schedule.scheduleId, data);
      toast.success("대타 근무 요청을 보냈습니다.");
    } catch (err) {
      console.error("대타 요청 실패", err);
      toast.error("요청에 실패했습니다.");
    } finally {
      setBottomSheetOpen(false);
    }
  };

  useEffect(() => {
    if (!isValidStoreId(storeId)) return;

    const fetch = async () => {
      try {
        const result = await fetchSubstituteCandidates(
          storeId,
          schedule.scheduleId,
        );
        setCandidates(result);
      } catch (err) {
        console.error("대타 후보 조회 실패", err);
      }
    };

    fetch();
  }, [storeId, schedule.scheduleId]);
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
        {isEditMode ? (
          <ul className="mt-2 flex gap-3 overflow-x-auto w-full scrollbar-hide">
            <div className="flex gap-3 w-max">
              {candidates.map(({ staff: s }) => (
                <li
                  key={s.staffId}
                  onClick={() =>
                    setValue("targetStaffId", s.staffId, {
                      shouldValidate: true,
                    })
                  }
                  className={`flex flex-col items-center cursor-pointer my-1 ${
                    selectedStaffId === s.staffId
                      ? "font-bold text-yellow-500"
                      : ""
                  }`}
                >
                  <img
                    src={s.profileImageUrl}
                    alt={s.name}
                    className={`w-12 h-12 rounded-full object-cover ring-4 ${
                      selectedStaffId === s.staffId
                        ? "ring-yellow-400"
                        : "ring-transparent"
                    }`}
                  />
                  <span className="text-xs mt-1">{s.name}</span>
                </li>
              ))}
            </div>
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <img
              src={staff.profileImageUrl}
              alt={staff.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <p className="text-sm font-medium text-center">{staff.name}</p>
          </div>
        )}
      </section>

      <section>
        <label className="title-1 block mb-3">근무 일정</label>
        <TextField
          type="text"
          value={formatFullDate(parseDateStringToKST(schedule.workDate))}
          disabled
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

      {isEditMode && (
        <section>
          <label htmlFor="reason" className="title-1 block mb-3">
            사유
          </label>
          <textarea
            id="reason"
            {...register("reason")}
            placeholder="대타 근무 요청 사유를 입력해주세요"
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.reason && (
            <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>
          )}
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
              theme="secondary"
              size="md"
              className="flex-1"
              onClick={() => setIsEditMode(true)}
            >
              대타 요청하기
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default StaffScheduleEditForm;
