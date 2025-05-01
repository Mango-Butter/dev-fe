import axiosAuth from "./axiosAuth";
import { RegularSchedule, CreateRegularScheduleDto } from "../types/staff.ts";

export const createRegularSchedules = async (
  storeId: number,
  staffId: number,
  schedules: CreateRegularScheduleDto[],
): Promise<void> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/staffs/${staffId}/regular`,
    schedules,
  );
  return response.data;
};

export const getRegularSchedules = async (
  storeId: number,
  staffId: number,
): Promise<RegularSchedule[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/staffs/${staffId}/regular`,
  );
  return response.data.result;
};

export const deleteRegularSchedule = async (
  storeId: number,
  staffId: number,
  regularId: number,
): Promise<void> => {
  const response = await axiosAuth.delete(
    `/api/boss/stores/${storeId}/staffs/${staffId}/regular/${regularId}`,
  );
  return response.data;
};
