import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Camera, CheckCircle } from "lucide-react";
import Button from "../../../../components/common/Button.tsx";
import RangeDatePicker from "../../../../components/common/RangeDatePicker.tsx";
import TimeInput from "../../../../components/common/TimeInput.tsx";
import FileDropzone from "../../../../components/common/FileDropzone.tsx";
import { TaskAddFormValues } from "../../../../schemas/useTaskAddSchema.ts";
import { toast } from "react-toastify";
import { isValidStoreId } from "../../../../utils/store.ts";
import { BossTaskAPI } from "../../../../api/boss/task.ts";
import useStoreStore from "../../../../stores/storeStore.ts";
import { DayOfWeek, dayOfWeekList } from "../../../../types/staff.ts";
import SingleDatePicker from "../../../../components/common/SingleDatePicker.tsx";
import { validateImageFile } from "../../../../utils/task.ts";

interface Props {
  onBack: () => void;
}

const TaskStep2 = ({ onBack }: Props) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<TaskAddFormValues>();

  const taskRoutineRepeatType = watch("taskRoutineRepeatType");

  const photoRequired = watch("photoRequired");

  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handleUpload = async (
    file: File | null,
    onChange: (val: string) => void,
  ) => {
    if (!file) {
      setPreviewFile(null);
      onChange("");
      return;
    }

    if (!validateImageFile(file)) {
      toast.error(
        "유효하지 않은 이미지입니다. JPG, PNG, GIF 형식만 가능하며 5MB 이하만 업로드할 수 있어요.",
      );
      return;
    }

    if (!isValidStoreId(storeId)) {
      toast.error("매장 정보가 올바르지 않습니다.");
      return;
    }

    const extension = file.name.split(".").pop()!;
    const contentType = file.type;

    try {
      setIsUploading(true);
      const { uploadUrl, publicUrl } =
        await BossTaskAPI.getReferenceImageUploadUrl(
          storeId,
          extension,
          contentType,
        );

      await BossTaskAPI.uploadReferenceImage(uploadUrl, file);

      setPreviewFile(file);
      onChange(publicUrl);
      toast.success("이미지가 업로드되었습니다.");
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (taskRoutineRepeatType === "WEEKLY") {
      setValue("repeatRule", { repeatDays: ["MONDAY"] });
    } else if (taskRoutineRepeatType === "MONTHLY") {
      setValue("repeatRule", { repeatDates: [1] });
    } else {
      setValue("repeatRule", {} as any);
    }
  }, [taskRoutineRepeatType, setValue]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pb-6 space-y-5">
        {/* 인증 방식 */}
        <section>
          <div className="flex items-center gap-1 mb-2">
            <label className="title-1 text-grayscale-900">인증 방식</label>
            <span className="text-warning text-lg">*</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              theme={!photoRequired ? "primary" : "outline"}
              icon={<CheckCircle />}
              onClick={() => setValue("photoRequired", false)}
            >
              체크 인증
            </Button>
            <Button
              type="button"
              theme={photoRequired ? "primary" : "outline"}
              icon={<Camera />}
              onClick={() => setValue("photoRequired", true)}
            >
              사진 인증
            </Button>
          </div>
        </section>

        {photoRequired && (
          <section>
            <div className="flex items-center gap-1 mb-2">
              <label className="title-1 text-grayscale-900">참고 이미지</label>
            </div>
            <Controller
              control={control}
              name="referenceImageUrl"
              render={({ field }) => (
                <FileDropzone
                  file={previewFile}
                  onChange={(file) => handleUpload(file, field.onChange)}
                  placeholder={
                    isUploading ? "업로드 중..." : "예시 사진을 업로드하세요"
                  }
                />
              )}
            />
          </section>
        )}

        {/* 반복 설정 */}
        <section>
          <div className="flex items-center gap-1 mb-2">
            <label className="title-1 text-grayscale-900">반복 설정</label>
            <span className="text-warning text-lg">*</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["ONCE", "DAILY", "WEEKLY", "MONTHLY"].map((type) => (
              <Button
                key={type}
                type="button"
                theme={taskRoutineRepeatType === type ? "primary" : "outline"}
                onClick={() =>
                  setValue(
                    "taskRoutineRepeatType",
                    type as TaskAddFormValues["taskRoutineRepeatType"],
                  )
                }
              >
                {type === "ONCE"
                  ? "하루"
                  : type === "DAILY"
                    ? "매일"
                    : type === "WEEKLY"
                      ? "매주"
                      : "매달"}
              </Button>
            ))}
          </div>
        </section>

        {/* 요일 선택 (주간 반복인 경우에만 표시) */}
        {taskRoutineRepeatType === "WEEKLY" && (
          <section>
            <div className="flex items-center gap-1 mb-2">
              <label className="title-1 text-grayscale-900">
                반복 요일 선택
              </label>
              <span className="text-warning text-lg">*</span>
            </div>
            <Controller
              control={control}
              name="repeatRule.repeatDays"
              render={({ field }) => {
                const value = (field.value ?? []) as DayOfWeek[];
                const toggleDay = (day: DayOfWeek) => {
                  if (value.includes(day)) {
                    field.onChange(value.filter((d) => d !== day));
                  } else {
                    field.onChange([...value, day]);
                  }
                };

                return (
                  <div className="grid grid-cols-7 gap-2">
                    {dayOfWeekList.map((day) => (
                      <Button
                        key={day}
                        size="sm"
                        type="button"
                        theme={value.includes(day) ? "primary" : "outline"}
                        onClick={() => toggleDay(day)}
                        className="p-0"
                      >
                        {day === "SUNDAY"
                          ? "일"
                          : day === "MONDAY"
                            ? "월"
                            : day === "TUESDAY"
                              ? "화"
                              : day === "WEDNESDAY"
                                ? "수"
                                : day === "THURSDAY"
                                  ? "목"
                                  : day === "FRIDAY"
                                    ? "금"
                                    : "토"}
                      </Button>
                    ))}
                  </div>
                );
              }}
            />
          </section>
        )}
        {/* 반복 날짜 선택 (월 반복일 경우) */}
        {taskRoutineRepeatType === "MONTHLY" && (
          <section>
            <div className="flex items-center gap-1 mb-2">
              <label className="title-1 text-grayscale-900">
                반복 날짜 선택
              </label>
              <span className="text-warning text-lg">*</span>
            </div>
            <Controller
              control={control}
              name="repeatRule.repeatDates"
              render={({ field }) => {
                const value = (field.value ?? []) as number[];
                const toggleDate = (date: number) => {
                  if (value.includes(date)) {
                    field.onChange(value.filter((d) => d !== date));
                  } else {
                    field.onChange([...value, date]);
                  }
                };

                return (
                  <div className="relative w-full">
                    <div className="border px-3 py-2 rounded-lg bg-white shadow-sm">
                      <div className="flex flex-wrap gap-2 pt-2 pb-3 border-b border-grayscale-200">
                        {value.length === 0 ? (
                          <span className="text-grayscale-400">
                            선택된 날짜 없음
                          </span>
                        ) : (
                          value
                            .sort((a, b) => a - b)
                            .map((d) => (
                              <span
                                key={d}
                                className="px-2 py-1 bg-primary-900 text-white text-sm rounded"
                              >
                                {d}일
                              </span>
                            ))
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-7 gap-1 max-h-[160px] overflow-y-auto">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (date) => (
                            <button
                              key={date}
                              type="button"
                              onClick={() => toggleDate(date)}
                              className={`text-sm border rounded-full px-2 py-2.5 hover:bg-primary-light ${
                                value.includes(date)
                                  ? "bg-gray-100 text-black"
                                  : "bg-white text-black"
                              }`}
                            >
                              {date}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </section>
        )}

        {/* 기간 설정 */}
        {taskRoutineRepeatType === "ONCE" ? (
          <section>
            <div className="flex items-center gap-1 mb-2">
              <label className="title-1 text-grayscale-900">업무 날짜</label>
              <span className="text-warning text-lg">*</span>
            </div>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <SingleDatePicker
                  value={value}
                  onChange={onChange}
                  mode="future"
                  placeholder="업무 일자를 선택해주세요"
                />
              )}
            />
          </section>
        ) : (
          <section>
            <div className="flex items-center gap-1 mb-2">
              <label className="title-1 text-grayscale-900">기간 설정</label>
              <span className="text-warning text-lg">*</span>
            </div>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <RangeDatePicker
                  value={[value, watch("endDate")]}
                  onChange={([start, end]) => {
                    if (start) onChange(start);
                    if (end) setValue("endDate", end);
                  }}
                  mode="future"
                />
              )}
            />
          </section>
        )}

        {/* 수행 시간 */}
        <section>
          <div className="flex items-center gap-1 mb-2">
            <label className="title-1 text-grayscale-900">수행 시간</label>
            <span className="text-warning text-lg">*</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Controller
              control={control}
              name="startTime"
              render={({ field: { value, onChange } }) => (
                <TimeInput
                  value={value}
                  onChange={onChange}
                  error={!!errors.startTime}
                />
              )}
            />
            <span className="self-center text-grayscale-400">~</span>
            <Controller
              control={control}
              name="endTime"
              render={({ field: { value, onChange } }) => (
                <TimeInput
                  value={value}
                  onChange={onChange}
                  error={!!errors.endTime}
                />
              )}
            />
          </div>
          {(errors.startTime || errors.endTime) && (
            <p className="text-xs text-warning mt-1">
              시간을 모두 입력해주세요.
            </p>
          )}
        </section>
      </div>

      {/* 고정 버튼 */}
      <div className="py-3 bg-white">
        <div className="flex gap-2">
          <Button
            type="button"
            theme="ghost"
            className="flex-1"
            onClick={onBack}
          >
            이전
          </Button>
          <Button type="submit" theme="primary" className="flex-1">
            업무 추가하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskStep2;
