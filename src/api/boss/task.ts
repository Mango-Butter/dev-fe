import axiosAuth from "../common/axiosAuth";
import {
  SingleTaskRequest,
  TaskRoutineRequest,
  ReferenceImageUploadUrlResponse,
  TaskRoutine,
  TaskStatus,
} from "../../types/task";

export const BossTaskAPI = {
  // 단일 업무 생성
  createSingleTask: async (
    storeId: number,
    taskData: SingleTaskRequest,
  ): Promise<void> => {
    await axiosAuth.post(`/api/boss/stores/${storeId}/tasks`, taskData);
  },

  // 반복 업무 생성
  createTaskRoutine: async (
    storeId: number,
    taskData: TaskRoutineRequest,
  ): Promise<void> => {
    await axiosAuth.post(
      `/api/boss/stores/${storeId}/tasks/task-routines`,
      taskData,
    );
  },

  // 참고 사진 업로드 presignedURL 요청
  getReferenceImageUploadUrl: async (
    storeId: number,
    extension: string,
    contentType: string,
  ): Promise<ReferenceImageUploadUrlResponse> => {
    const response = await axiosAuth.get(
      `/api/boss/stores/${storeId}/tasks/reference-image/upload-url`,
      {
        params: {
          extension,
          contentType,
        },
      },
    );
    return response.data;
  },

  // 참고 사진 업로드
  uploadReferenceImage: async (
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
  },

  // 날짜별 업무 상태 조회
  getTasksByDate: async (
    storeId: number,
    date: string,
  ): Promise<TaskStatus[]> => {
    const response = await axiosAuth.get(`/api/boss/stores/${storeId}/tasks`, {
      params: { date },
    });
    return response.data.result;
  },

  // 업무 상세 조회
  getTaskDetail: async (
    storeId: number,
    taskId: number,
  ): Promise<TaskStatus> => {
    const response = await axiosAuth.get<TaskStatus>(
      `/api/boss/stores/${storeId}/tasks/${taskId}`,
    );
    return response.data;
  },

  // 반복 업무 목록 조회
  getTaskRoutines: async (storeId: number): Promise<TaskRoutine[]> => {
    const response = await axiosAuth.get(
      `/api/boss/stores/${storeId}/tasks/task-routines`,
    );
    return response.data.result;
  },

  // 반복 업무 삭제
  deleteTaskRoutine: async (
    storeId: number,
    taskRoutineId: number,
    deleteOption: "ALL" | "PENDING",
  ): Promise<void> => {
    await axiosAuth.delete(
      `/api/boss/stores/${storeId}/tasks/task-routines/${taskRoutineId}`,
      {
        params: { deleteOption },
      },
    );
  },

  // 특정 업무 삭제
  deleteTask: async (storeId: number, taskId: number): Promise<void> => {
    await axiosAuth.delete(`/api/boss/stores/${storeId}/tasks/${taskId}`);
  },
};
