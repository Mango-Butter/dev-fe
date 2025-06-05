import {
  TaskStatus,
  StaffTaskListResponse,
  TaskUploadUrlResponse,
} from "../../types/task";
import axiosAuth from "../common/axiosAuth";

// 날짜별 업무 목록 조회
export const getTasksByDate = async (
  storeId: number,
  date: string,
): Promise<TaskStatus[]> => {
  const response = await axiosAuth.get<StaffTaskListResponse>(
    `/api/staff/stores/${storeId}/tasks?date=${date}`,
  );
  return response.data.result;
};

// 업무 세부 조회
export const getTaskDetail = async (
  storeId: number,
  taskId: number,
): Promise<TaskStatus> => {
  const response = await axiosAuth.get<TaskStatus>(
    `/api/staff/stores/${storeId}/tasks/${taskId}`,
  );
  return response.data;
};

export const completeTask = async (
  storeId: number,
  taskId: number,
  reportImageUrl: string | null,
): Promise<void> => {
  await axiosAuth.post(
    `/api/staff/stores/${storeId}/tasks/${taskId}/complete`,
    { reportImageUrl }, // ✅ 필수 요청 바디 추가
  );
};

// 업무 완료 취소
export const cancelTaskCompletion = async (
  storeId: number,
  taskId: number,
): Promise<void> => {
  await axiosAuth.delete(
    `/api/staff/stores/${storeId}/tasks/${taskId}/completion`,
  );
};

// 업무 보고 사진 업로드용 presignedUrl 발급
export const getTaskLogImageUploadUrl = async (
  storeId: number,
  extension: string,
  contentType: string,
): Promise<TaskUploadUrlResponse> => {
  const response = await axiosAuth.get<TaskUploadUrlResponse>(
    `/api/staff/stores/${storeId}/tasks/task-log-image/upload-url`,
    {
      params: {
        extension,
        contentType,
      },
    },
  );
  return response.data;
};

export const uploadReferenceImage = async (
  uploadUrl: string,
  file: File,
): Promise<void> => {
  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
};
