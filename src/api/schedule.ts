import axiosAuth from "./axiosAuth";
import {
  CreateSingleScheduleRequest,
  DailySingleSchedule,
} from "../types/schedule.ts";

export const createSingleSchedule = async (
  storeId: number,
  body: CreateSingleScheduleRequest,
): Promise<void> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/schedules`,
    body,
  );
  return response.data;
};

export const deleteSingleSchedule = async (
  storeId: number,
  scheduleId: number,
): Promise<void> => {
  const response = await axiosAuth.delete(
    `/api/boss/stores/${storeId}/schedules/${scheduleId}`,
  );
  return response.data;
};

export const getDailySingleSchedules = async (
  storeId: number,
  date: string,
): Promise<DailySingleSchedule[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/schedules/daily`,
    {
      params: { date },
    },
  );
  return response.data.result;
};
