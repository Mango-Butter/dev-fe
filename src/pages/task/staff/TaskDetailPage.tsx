import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StaffTask } from "../../../types/task";
import {
  getTaskDetail,
  completeTask,
  cancelTaskCompletion,
  getTaskLogImageUploadUrl,
} from "../../../api/staff/task";
import useStoreStore from "../../../stores/storeStore";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";
import { validateImageFile } from "../../../utils/task";
import { compressImageIfNeeded } from "../../../utils/compressImageIfNeeded";
import Label from "../../../components/common/Label";
import { formatTaskTime } from "../../../utils/task";
import { useLayout } from "../../../hooks/useLayout";

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const [task, setTask] = useState<StaffTask | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useLayout({
    title: "업무 상세",
    theme: "default",
    headerVisible: true,
    bottomNavVisible: true,
    onBack: () => navigate(-1),
  });

  const fetchTaskDetail = async () => {
    if (!storeId || !taskId) return;

    try {
      const data = await getTaskDetail(String(storeId), Number(taskId));
      setTask(data);
      if (data.taskLog?.taskLogImageUrl) {
        setImagePreview(data.taskLog.taskLogImageUrl);
      }
    } catch (err) {
      console.error("업무 상세 조회 실패", err);
      toast.error("업무 정보를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchTaskDetail();
  }, [storeId, taskId]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!storeId || !taskId) return;

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!validateImageFile(file)) {
        toast.error(
          "이미지 파일은 5MB 이하의 JPG, PNG, GIF 형식만 가능합니다."
        );
        return;
      }

      setIsUploading(true);
      const compressedFile = await compressImageIfNeeded(file);

      // presignedURL 발급
      const { uploadUrl, publicUrl } = await getTaskLogImageUploadUrl(
        String(storeId),
        file.name.split(".").pop() || "",
        file.type
      );

      // 이미지 업로드
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: compressedFile,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      setImagePreview(publicUrl);
      toast.success("이미지가 업로드되었습니다.");
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleComplete = async () => {
    if (!storeId || !taskId || isCompleting) return;

    try {
      setIsCompleting(true);
      await completeTask(String(storeId), Number(taskId));
      toast.success("업무가 완료되었습니다.");
      await fetchTaskDetail(); // 업무 상태 갱신
    } catch (err) {
      console.error("업무 완료 처리 실패", err);
      toast.error("업무 완료 처리에 실패했습니다.");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCancelCompletion = async () => {
    if (!storeId || !taskId) return;

    try {
      await cancelTaskCompletion(String(storeId), Number(taskId));
      toast.success("업무 완료가 취소되었습니다.");
      fetchTaskDetail();
    } catch (err) {
      console.error("업무 완료 취소 실패", err);
      toast.error("업무 완료 취소에 실패했습니다.");
    }
  };

  if (!task) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="heading-1 mb-2">{task.title}</h1>
          <div className="flex items-center gap-2">
            <Label theme="ghost" size="lg" className="text-grayscale-500">
              {task.isPhotoRequired ? "사진 인증" : "체크 인증"}
            </Label>
            <span className="text-grayscale-600">
              {formatTaskTime(task.startTime)} - {formatTaskTime(task.endTime)}
            </span>
          </div>
        </div>
        {!task.taskLog && (
          <Button
            size="sm"
            theme="primary"
            onClick={handleComplete}
            disabled={isCompleting}
          >
            {isCompleting ? "처리 중..." : "완료하기"}
          </Button>
        )}
      </div>

      {task.description && (
        <div>
          <h2 className="title-1 text-grayscale-900 mb-2">업무 설명</h2>
          <p className="text-grayscale-700 whitespace-pre-wrap">
            {task.description}
          </p>
        </div>
      )}

      {task.taskLog && (
        <div>
          <h2 className="title-1 text-grayscale-900 mb-2">수행 정보</h2>
          <div className="flex items-center gap-2">
            <img
              src={task.taskLog.checkedStaff?.profileImageUrl}
              alt={task.taskLog.checkedStaff?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-grayscale-700">
              {task.taskLog.checkedStaff?.name}
            </span>
          </div>
        </div>
      )}

      {task.referenceImageUrl && (
        <div>
          <h2 className="title-1 text-grayscale-900 mb-2">참고 사진</h2>
          <img
            src={task.referenceImageUrl}
            alt="참고 사진"
            className="w-full rounded-lg"
          />
        </div>
      )}

      {task.taskLog?.taskLogImageUrl && (
        <div>
          <h2 className="title-1 text-grayscale-900 mb-2">인증 사진</h2>
          <img
            src={task.taskLog.taskLogImageUrl}
            alt="인증 사진"
            className="w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default TaskDetailPage;
