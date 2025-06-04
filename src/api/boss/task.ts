import axiosAuth from "../common/axiosAuth";
import {
  SingleTaskRequest,
  TaskRoutineRequest,
  TaskDetail,
  ReferenceImageUploadUrlResponse,
  TaskRoutine,
  TaskStatus,
} from "../../types/task";

export const BossTaskAPI = {
  // 단일 업무 생성
  createSingleTask: async (
    storeId: string,
    taskData: SingleTaskRequest,
  ): Promise<TaskDetail> => {
    const response = await axiosAuth.post(
      `/api/boss/stores/${storeId}/tasks`,
      taskData,
    );
    return response.data;
  },

  // 반복 업무 생성
  createTaskRoutine: async (
    storeId: string,
    taskData: TaskRoutineRequest,
  ): Promise<void> => {
    await axiosAuth.post(
      `/api/boss/stores/${storeId}/tasks/task-routines`,
      taskData,
    );
  },

  // 참고 사진 업로드 URL 요청
  getReferenceImageUploadUrl: async (
    storeId: string,
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

  // getReferenceImageViewUrl: async (
  //   storeId: number,
  //   taskId: number,
  // ): Promise<{ viewUrl: string }> => {
  //   const res = await axiosAuth.get(
  //     `/api/boss/stores/${storeId}/tasks/${taskId}/reference-image/view-url`,
  //   );
  //   return res.data;
  // },

  // 날짜별 업무 상태 조회
  getTasksByDate: async (
    storeId: string,
    date: string,
  ): Promise<TaskStatus[]> => {
    const response = await axiosAuth.get(`/api/boss/stores/${storeId}/tasks`, {
      params: { date },
    });
    return response.data.result;
  },

  // 업무 상세 조회
  getTaskDetail: async (
    storeId: string,
    taskId: number,
  ): Promise<TaskStatus> => {
    const response = await axiosAuth.get<TaskStatus>(
      `/api/boss/stores/${storeId}/tasks/${taskId}`,
    );
    return response.data;
  },

  // 반복 업무 목록 조회
  getTaskRoutines: async (storeId: string): Promise<TaskRoutine[]> => {
    const response = await axiosAuth.get(
      `/api/boss/stores/${storeId}/tasks/task-routines`,
    );
    return response.data.result;
  },

  // 반복 업무 삭제
  deleteTaskRoutine: async (
    storeId: string,
    deleteOption: "ALL" | "PENDING",
  ): Promise<void> => {
    await axiosAuth.delete(`/api/boss/stores/${storeId}/tasks/task-routines`, {
      params: { deleteOption },
    });
  },

  // 특정 업무 삭제
  deleteTask: async (storeId: string, taskId: number): Promise<void> => {
    await axiosAuth.delete(`/api/boss/stores/${storeId}/tasks/${taskId}`);
  },
};
