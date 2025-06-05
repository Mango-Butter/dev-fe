import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import RangeDatePicker from "../../../components/common/RangeDatePicker";
import TextField from "../../../components/common/TextField";
import Button from "../../../components/common/Button";
import useBottomSheetStore from "../../../stores/useBottomSheetStore";
import useStoreStore from "../../../stores/storeStore";
import {
  DayOfWeek,
  TaskRoutineRequest,
  SingleTaskRequest,
} from "../../../types/task";
import { cn } from "../../../libs";
import { validateImageFile } from "../../../utils/task";
import { compressImageIfNeeded } from "../../../utils/compressImageIfNeeded";
import { toast } from "react-toastify";
import { BossTaskAPI } from "../../../api/boss/task";
import {
  CheckboxOn,
  CheckboxFilled,
} from "../../../components/icons/CheckboxIcon.tsx";
import { CameraOn, CameraOff } from "../../../components/icons/CameraIcon.tsx";
import { useNavigate } from "react-router-dom";
import {
  formatDateToKSTString,
  getKSTDate,
  getKSTISOStringFromDateAndTime,
} from "../../../libs/date.ts";

interface TaskAddFormProps {
  defaultDate?: Date;
}

const MAX_TITLE_LENGTH = 32;

// 요일 목록 추가
const dayOfWeekList = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

// 요일 한글 매핑
const weekdayKorean: Record<DayOfWeek, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const schema = z.object({
  title: z
    .string()
    .min(1, "업무 제목을 입력해주세요")
    .max(
      MAX_TITLE_LENGTH,
      `업무 제목은 최대 ${MAX_TITLE_LENGTH}자까지 입력 가능합니다`,
    ),
  description: z.string().optional(),
  photoRequired: z.boolean(),
  taskRoutineRepeatType: z.enum([
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "ONCE",
  ]) as z.ZodType<"DAILY" | "WEEKLY" | "MONTHLY" | "ONCE">,
  repeatRule: z
    .object({
      repeatDays: z.array(z.enum(dayOfWeekList)).optional(),
      repeatDates: z.array(z.number()).optional(),
      timeMap: z
        .record(
          z.string(),
          z.object({
            startTime: z.string(),
            endTime: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().min(1, "시작 시간을 입력해주세요"),
  endTime: z.string().min(1, "종료 시간을 입력해주세요"),
  referenceImageUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const TaskAddForm = ({ defaultDate }: TaskAddFormProps) => {
  const [step, setStep] = useState(1);
  const { setBottomSheetOpen } = useBottomSheetStore();
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

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
      title: "",
      description: "",
      photoRequired: false,
      taskRoutineRepeatType: "ONCE",
      startDate: defaultDate ?? getKSTDate(),
      endDate: defaultDate ?? getKSTDate(),
      startTime: "",
      endTime: "",
      referenceImageUrl: "",
      repeatRule: {
        repeatDays: [],
        repeatDates: [],
        timeMap: {} as Record<string, { startTime: string; endTime: string }>,
      },
    },
  });

  const title = watch("title");
  const taskRoutineRepeatType = watch("taskRoutineRepeatType");
  const repeatRule = watch("repeatRule");
  const photoRequired = watch("photoRequired");

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && storeId) {
      try {
        // 파일 유효성 검사
        if (!validateImageFile(file)) {
          toast.error("이미지 파일은 5MB 이하의 JPG, PNG 형식만 가능합니다.");
          return;
        }

        // 필요한 경우 이미지 압축
        const compressedFile = await compressImageIfNeeded(file);
        const extension =
          compressedFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const contentType = compressedFile.type || "image/jpeg";

        try {
          // 이미지 업로드 URL 발급
          const { uploadUrl, fileKey } =
            await BossTaskAPI.getReferenceImageUploadUrl(
              String(storeId),
              extension,
              contentType,
            );

          // 이미지 업로드
          await BossTaskAPI.uploadReferenceImage(uploadUrl, compressedFile);

          // fileKey를 referenceImageUrl 필드에 저장
          setValue("referenceImageUrl", fileKey);
          setImagePreview(URL.createObjectURL(compressedFile));
          toast.success("이미지가 성공적으로 업로드되었습니다.");
        } catch (uploadError) {
          console.error("이미지 업로드 실패:", uploadError);
          toast.error("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("이미지 처리 실패:", error);
        toast.error("이미지 처리 중 오류가 발생했습니다.");
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!storeId) {
      toast.error("매장 정보가 없습니다.");
      return;
    }

    try {
      const baseTaskData = {
        title: data.title,
        description: data.description || "",
        photoRequired: data.photoRequired,
        referenceImageUrl: data.referenceImageUrl || "",
      };

      if (data.taskRoutineRepeatType === "ONCE") {
        const taskDateStr = formatDateToKSTString(data.startDate);
        const singleTaskRequest: SingleTaskRequest = {
          ...baseTaskData,
          taskDate: taskDateStr,
          startTime: getKSTISOStringFromDateAndTime(
            taskDateStr,
            data.startTime,
          ),
          endTime: getKSTISOStringFromDateAndTime(taskDateStr, data.endTime),
        };

        console.log("단일 업무 요청 데이터:", singleTaskRequest);

        const response = await BossTaskAPI.createSingleTask(
          String(storeId),
          singleTaskRequest,
        );

        console.log("단일 업무 생성 응답:", response);

        // API 응답 구조에 맞게 수정
        if (response?.taskId) {
          toast.success("업무가 성공적으로 추가되었습니다!");
          setBottomSheetOpen(false);
          navigate(`/boss/task/${response.taskId}`);
        } else {
          console.error("API 응답:", response);
          throw new Error("업무 생성 실패: taskId가 없습니다.");
        }
      } else {
        // 반복 업무 처리
        const baseRoutineData = {
          ...baseTaskData,
          startDate: formatDateToKSTString(data.startDate),
          endDate: formatDateToKSTString(data.endDate),
        };

        let taskRoutineRequest: TaskRoutineRequest;

        switch (data.taskRoutineRepeatType) {
          case "DAILY":
            taskRoutineRequest = {
              ...baseRoutineData,
              taskRoutineRepeatType: "DAILY",
              startTime: data.startTime,
              endTime: data.endTime,
            };
            break;

          case "WEEKLY":
            if (!data.repeatRule?.repeatDays?.length) {
              toast.error("반복할 요일을 선택해주세요.");
              return;
            }

            const weeklyTaskRoutineRequest: TaskRoutineRequest = {
              ...baseRoutineData,
              taskRoutineRepeatType: "WEEKLY",
              repeatRule: {
                repeatDays: data.repeatRule.repeatDays,
              },
              startTime: data.startTime,
              endTime: data.endTime,
            };

            taskRoutineRequest = weeklyTaskRoutineRequest;
            break;

          case "MONTHLY":
            if (!data.repeatRule?.repeatDates?.length) {
              toast.error("반복할 날짜를 선택해주세요.");
              return;
            }

            const monthlyTaskRoutineRequest: TaskRoutineRequest = {
              ...baseRoutineData,
              taskRoutineRepeatType: "MONTHLY",
              repeatRule: {
                repeatDates: data.repeatRule.repeatDates,
              },
              startTime: data.startTime,
              endTime: data.endTime,
            };

            taskRoutineRequest = monthlyTaskRoutineRequest;
            break;

          default:
            toast.error("잘못된 반복 유형입니다.");
            return;
        }

        console.log("반복 업무 요청 데이터:", taskRoutineRequest);

        await BossTaskAPI.createTaskRoutine(
          String(storeId),
          taskRoutineRequest,
        );

        toast.success("반복 업무가 성공적으로 추가되었습니다!");
        setBottomSheetOpen(false);
      }
    } catch (err: any) {
      console.error("업무 추가 실패", err);

      // 에러 메시지 처리 개선
      let errorMessage = "업무 추가에 실패했습니다.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      // 네트워크 에러 등 추가 처리
      if (err.code === "NETWORK_ERROR") {
        errorMessage = "네트워크 연결을 확인해주세요.";
      }

      toast.error(errorMessage);
    }
  };

  const renderStep1 = () => (
    <>
      <section>
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">업무 제목</label>
          <span className="title-1 text-warning">*</span>
        </div>
        <div className="relative">
          <TextField
            {...register("title")}
            placeholder="업무 제목(최대 32자)"
            state={errors.title ? "warning" : "none"}
            maxLength={MAX_TITLE_LENGTH}
          />
          <span className="absolute right-3 bottom-3 text-xs text-grayscale-400">
            {title.length}/{MAX_TITLE_LENGTH}
          </span>
        </div>
        {errors.title && (
          <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
        )}
      </section>

      <section>
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">업무 설명</label>
        </div>
        <div className="relative">
          <textarea
            {...register("description")}
            placeholder="업무에 대한 상세 내용을 작성해주세요."
            className="w-full min-h-[100px] p-3 rounded-lg border border-grayscale-300 resize-none focus:outline-none focus:border-grayscale-500"
          />
        </div>
      </section>

      <div className="mt-auto">
        <Button
          type="button"
          theme="primary"
          className="w-full"
          onClick={() => setStep(2)}
          disabled={!title}
        >
          다음
        </Button>
      </div>
    </>
  );

  const renderTimeFields = () => (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <TextField
          type="time"
          {...register("startTime")}
          className="w-full"
          onChange={(e) => {
            register("startTime").onChange(e);
            toast.success(`시작 시간이 ${e.target.value}로 설정되었습니다.`);
          }}
        />
      </div>
      <span className="self-center text-grayscale-400">~</span>
      <div className="relative flex-1">
        <TextField
          type="time"
          {...register("endTime")}
          className="w-full"
          onChange={(e) => {
            register("endTime").onChange(e);
            toast.success(`종료 시간이 ${e.target.value}로 설정되었습니다.`);
          }}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <>
      <section>
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">인증 방식</label>
          <span className="title-1 text-warning">*</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="md"
            icon={!photoRequired ? <CheckboxFilled /> : <CheckboxOn />}
            theme={!photoRequired ? "primary" : "outline"}
            className={!photoRequired ? "text-grayscale-800" : ""}
            onClick={() => {
              setValue("photoRequired", false);
              toast.success("체크 인증으로 변경되었습니다.");
            }}
          >
            체크 인증
          </Button>
          <Button
            type="button"
            size="md"
            icon={photoRequired ? <CameraOn /> : <CameraOff />}
            theme={photoRequired ? "primary" : "outline"}
            className={photoRequired ? "text-grayscale-800" : ""}
            onClick={() => {
              setValue("photoRequired", true);
              toast.success("사진 인증으로 변경되었습니다.");
            }}
          >
            사진 인증
          </Button>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">반복 설정</label>
          <span className="title-1 text-warning">*</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {["ONCE", "DAILY", "WEEKLY", "MONTHLY"].map((type) => (
            <Button
              key={type}
              type="button"
              size="md"
              theme={taskRoutineRepeatType === type ? "primary" : "outline"}
              className={
                taskRoutineRepeatType === type ? "text-grayscale-800" : ""
              }
              onClick={() =>
                setValue(
                  "taskRoutineRepeatType",
                  type as FormData["taskRoutineRepeatType"],
                )
              }
            >
              {type === "ONCE"
                ? "한번만"
                : type === "DAILY"
                  ? "매일"
                  : type === "WEEKLY"
                    ? "매주"
                    : "매월"}
            </Button>
          ))}
        </div>
      </section>

      {taskRoutineRepeatType !== "ONCE" && (
        <section>
          <div className="flex items-center gap-1 mb-3">
            <label className="title-1 text-grayscale-900">기간 설정</label>
            <span className="title-1 text-warning">*</span>
          </div>
          <Controller
            name="startDate"
            control={control}
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

      {(taskRoutineRepeatType === "ONCE" ||
        taskRoutineRepeatType === "DAILY") && (
        <section>
          <div className="flex items-center gap-1 mb-3">
            <label className="title-1 text-grayscale-900">수행 시간</label>
            <span className="title-1 text-warning">*</span>
          </div>
          {renderTimeFields()}
        </section>
      )}

      {taskRoutineRepeatType === "WEEKLY" && (
        <section>
          <div className="flex items-center gap-1 mb-3">
            <label className="title-1 text-grayscale-900">반복 요일</label>
            <span className="title-1 text-warning">*</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {dayOfWeekList.map((day) => (
              <Button
                key={day}
                type="button"
                size="md"
                theme={
                  repeatRule?.repeatDays?.includes(day as DayOfWeek)
                    ? "primary"
                    : "outline"
                }
                className={
                  repeatRule?.repeatDays?.includes(day as DayOfWeek)
                    ? "text-grayscale-800"
                    : ""
                }
                onClick={() => {
                  const currentDays = repeatRule?.repeatDays || [];
                  const newDays = currentDays.includes(day as DayOfWeek)
                    ? currentDays.filter((d) => d !== day)
                    : [...currentDays, day as DayOfWeek];
                  setValue("repeatRule", {
                    ...repeatRule,
                    repeatDays: newDays,
                  });
                }}
              >
                {weekdayKorean[day as DayOfWeek]}
              </Button>
            ))}
          </div>
          {repeatRule?.repeatDays?.map((day) => (
            <div key={day} className="mt-4">
              <label className="text-sm font-medium">
                {weekdayKorean[day]} 수행 시간{" "}
                <span className="text-warning">*</span>
              </label>
              <div className="mt-2 flex gap-2">
                <TextField
                  type="time"
                  value={repeatRule?.timeMap?.[day]?.startTime || ""}
                  onChange={(e) => {
                    const currentTimeMap = repeatRule?.timeMap || {};
                    setValue("repeatRule", {
                      ...repeatRule,
                      timeMap: {
                        ...currentTimeMap,
                        [day]: {
                          startTime: e.target.value,
                          endTime: currentTimeMap[day]?.endTime || "",
                        },
                      },
                    });
                  }}
                />
                <span className="self-center text-grayscale-400">~</span>
                <TextField
                  type="time"
                  value={repeatRule?.timeMap?.[day]?.endTime || ""}
                  onChange={(e) => {
                    const currentTimeMap = repeatRule?.timeMap || {};
                    setValue("repeatRule", {
                      ...repeatRule,
                      timeMap: {
                        ...currentTimeMap,
                        [day]: {
                          startTime: currentTimeMap[day]?.startTime || "",
                          endTime: e.target.value,
                        },
                      },
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {taskRoutineRepeatType === "MONTHLY" && (
        <section>
          <div className="flex items-center gap-1 mb-3">
            <label className="title-1 text-grayscale-900">반복 날짜</label>
            <span className="title-1 text-warning">*</span>
          </div>
          <div className="space-y-4">
            <select
              className="w-full p-2 border border-grayscale-300 rounded-lg"
              value={repeatRule?.repeatDates?.[0] || ""}
              onChange={(e) => {
                setValue("repeatRule", {
                  ...repeatRule,
                  repeatDates: [Number(e.target.value)],
                });
              }}
            >
              <option value="">날짜 선택</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  매월 {day}일
                </option>
              ))}
            </select>

            <div>
              <label className="text-sm font-medium">
                수행 시간 <span className="text-warning">*</span>
              </label>
              <div className="mt-2">{renderTimeFields()}</div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-1 mb-3">
          <label className="title-1 text-grayscale-900">참고 사진</label>
        </div>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className={cn(
              "block w-full p-3 rounded-lg border border-dashed border-grayscale-300 text-center cursor-pointer hover:border-grayscale-500",
              imagePreview ? "bg-grayscale-50" : "",
            )}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="참고 이미지"
                className="max-h-32 mx-auto"
              />
            ) : (
              <span className="text-grayscale-400">
                클릭하여 이미지를 업로드하세요
              </span>
            )}
          </label>
        </div>
      </section>

      <div className="mt-auto flex">
        <Button
          size="md"
          type="submit"
          theme="primary"
          className="flex-1 text-black"
        >
          업무 추가하기
        </Button>
      </div>
    </>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full gap-4"
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </form>
  );
};

export default TaskAddForm;
