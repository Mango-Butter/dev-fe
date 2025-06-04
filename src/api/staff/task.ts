import {
  StaffTask,
  StaffTaskListResponse,
  TaskUploadUrlResponse,
} from "../../types/task";
import axiosAuth from "../common/axiosAuth";

// 날짜별 업무 목록 조회
export const getTasksByDate = async (
  storeId: string,
  date: string,
): Promise<StaffTask[]> => {
  const response = await axiosAuth.get<StaffTaskListResponse>(
    `/api/staff/stores/${storeId}/tasks?date=${date}`,
  );
  return response.data.result;
};

// 업무 세부 조회
export const getTaskDetail = async (
  storeId: string,
  taskId: number,
): Promise<StaffTask> => {
  const response = await axiosAuth.get<StaffTask>(
    `/api/staff/stores/${storeId}/tasks/${taskId}`,
  );
  return response.data;
};

// 업무 완료 처리
export const completeTask = async (
  storeId: string,
  taskId: number,
): Promise<void> => {
  await axiosAuth.post(`/api/staff/stores/${storeId}/tasks/${taskId}/complete`);
};

// 업무 완료 취소
export const cancelTaskCompletion = async (
  storeId: string,
  taskId: number,
): Promise<void> => {
  await axiosAuth.delete(
    `/api/staff/stores/${storeId}/tasks/${taskId}/completion`,
  );
};

// 업무 보고 사진 업로드용 presignedUrl 발급
export const getTaskLogImageUploadUrl = async (
  storeId: string,
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
