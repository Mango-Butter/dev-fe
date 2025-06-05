import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TaskDetail } from "../../../../types/task.ts";
import { toast } from "react-toastify";
import Button from "../../../../components/common/Button.tsx";
import Label from "../../../../components/common/Label.tsx";
import { formatTaskTime, validateImageFile } from "../../../../utils/task.ts";
import { useLayout } from "../../../../hooks/useLayout.ts";
import useStaffStoreStore from "../../../../stores/useStaffStoreStore.ts";
import {
  cancelTaskCompletion,
  completeTask,
  getTaskDetail,
  getTaskLogImageUploadUrl,
  uploadReferenceImage,
} from "../../../../api/staff/task.ts";
import FileDropzone from "../../../../components/common/FileDropzone.tsx";
import { isValidStoreId } from "../../../../utils/store.ts";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showConfirm } from "../../../../libs/showConfirm.ts";

export const completeTaskSchema = z.object({
  reportImageUrl: z
    .string()
    .url()
    .nullable()
    .refine((val) => val !== null, { message: "인증샷을 업로드해주세요." }),
});

const StaffChecklistDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;
  const myStaffId = selectedStore?.staff.staffId;

  const [task, setTask] = useState<TaskDetail | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(
      task?.isPhotoRequired
        ? completeTaskSchema
        : z.object({ reportImageUrl: z.string().nullable() }),
    ),
    mode: "onChange",
    defaultValues: {
      reportImageUrl: null as string | null,
    },
  });

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
      const { uploadUrl, publicUrl } = await getTaskLogImageUploadUrl(
        storeId,
        extension,
        contentType,
      );

      await uploadReferenceImage(uploadUrl, file);

      setPreviewFile(file);
      onChange(publicUrl);
      toast.success("이미지가 업로드되었습니다.");
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  useLayout({
    title: "업무 상세",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => navigate(-1),
    rightIcon: null,
  });

  const fetchTaskDetail = async () => {
    if (!storeId || !taskId) return;

    try {
      const data = await getTaskDetail(storeId, Number(taskId));
      setTask(data);
    } catch (err) {
      console.error("업무 상세 조회 실패", err);
      toast.error("업무 정보를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchTaskDetail();
  }, [storeId, taskId]);

  const handleComplete = handleSubmit(async (data) => {
    if (!isValidStoreId(storeId) || !taskId) return;

    try {
      await completeTask(storeId, Number(taskId), data.reportImageUrl);
      toast.success("업무가 완료 처리되었습니다.");
      navigate(-1);
    } catch (err: any) {
      const msg =
        err?.response?.data?.ErrorCode === "ALREADY_COMPLETED_TASK"
          ? "이미 완료된 업무입니다."
          : "업무 완료 처리에 실패했습니다.";
      toast.error(msg);
    }
  });

  const handleCancel = async () => {
    if (!isValidStoreId(storeId) || !taskId) return;

    const confirmed = await showConfirm({
      title: "완료를 취소하시겠습니까?",
      text: "해당 업무를 다시 미완료 상태로 되돌립니다.",
      icon: "warning",
      confirmText: "취소하기",
      cancelText: "닫기",
    });

    if (!confirmed) return;

    try {
      await cancelTaskCompletion(storeId, Number(taskId));
      toast.success("업무 완료가 취소되었습니다.");
      fetchTaskDetail(); // 상태 다시 불러오기
    } catch (err) {
      console.error("업무 완료 취소 실패", err);
      toast.error("완료 취소에 실패했습니다.");
    }
  };

  if (!task) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="w-full p-5 flex flex-col h-full justify-between">
      <div className="w-full h-full flex justify-between items-start overflow-auto scrollbar-hide">
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Label size="lg" theme={task.taskLog ? "solid" : "ghost"}>
              {task.taskLog ? "완료" : "미완료"}
            </Label>
            {task.isPhotoRequired ? (
              <Label theme="lightsecond" size="lg">
                인증샷
              </Label>
            ) : (
              <Label theme="lightsolid" size="lg">
                체크
              </Label>
            )}
          </div>
          <div className="w-full flex flex-col gap-1 pb-4 border-b border-grayscale-200 dark:border-grayscale-700">
            <div className="flex gap-2 items-center">
              <span className="heading-3">{task.taskDate}</span>
              <span className="heading-3 text-grayscale-500">
                {formatTaskTime(task.startTime)} ~{" "}
                {formatTaskTime(task.endTime)}
              </span>
            </div>

            <span className="heading-2">{task.title}</span>
            {task.description && (
              <p className="text-grayscale-700 whitespace-pre-wrap">
                {task.description}
              </p>
            )}
            {task.referenceImageUrl && (
              <img
                src={task.referenceImageUrl}
                alt="참고 사진"
                className="w-full rounded-lg mt-2"
              />
            )}
          </div>
          {task.taskLog ? (
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="title-2 text-grayscale-900">작성자</h2>
                <div className="flex items-center gap-2">
                  <img
                    src={task.taskLog.checkedStaff.profileImageUrl}
                    alt={task.taskLog.checkedStaff.name}
                    className="w-5 h-5 rounded-full"
                  />
                  <span className="body-2">
                    {task.taskLog.checkedStaff.name}
                  </span>
                </div>
              </div>

              {task.taskLog.taskLogImageUrl && (
                <div className="flex flex-col gap-1">
                  <h2 className="title-2 text-grayscale-900">인증 사진</h2>
                  <img
                    src={task.taskLog.taskLogImageUrl}
                    alt="인증 사진"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-4 p-6 text-center border border-grayscale-300 dark:border-grayscale-700 rounded-lg border-dashed">
              <span className="body-3 text-grayscale-700 dark:text-grayscale-300 ">
                아직 업무를 수행한 알바생이 없습니다.
                <br />
                업무를 완료하고 버튼을 눌러주세요.
              </span>
              {task.isPhotoRequired && (
                <Controller
                  control={control}
                  name="reportImageUrl"
                  render={({ field, fieldState }) => (
                    <div className="w-full flex flex-col gap-1">
                      <FileDropzone
                        file={previewFile}
                        onChange={(file) => handleUpload(file, field.onChange)}
                        placeholder={
                          isUploading
                            ? "업로드 중..."
                            : "완료 사진을 업로드하세요"
                        }
                      />
                      {fieldState.error && (
                        <p className="text-xs text-red-500">
                          {fieldState.error.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 shrink-0">
        {task.taskLog ? (
          myStaffId === task.taskLog.checkedStaff.staffId && (
            <Button
              size="sm"
              theme="danger"
              onClick={handleCancel}
              className="w-full"
            >
              완료 취소하기
            </Button>
          )
        ) : (
          <Button
            size="sm"
            theme="secondary"
            onClick={handleComplete}
            disabled={!isValid}
            state={isValid ? "default" : "disabled"}
            className="w-full"
          >
            완료하기
          </Button>
        )}
      </div>
    </div>
  );
};

export default StaffChecklistDetailPage;
