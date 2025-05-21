import axiosAuth from "../common/axiosAuth.ts";
import {
  RegularSchedule,
  CreateRegularScheduleDto,
  StaffBrief,
  StaffAttendance,
} from "../../types/staff.ts";

export const getStaffDetail = async (
  storeId: number,
  staffId: number,
): Promise<StaffBrief> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/staffs/${staffId}`,
  );
  return res.data;
};

// 고정 스케줄 생성
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

// 고정 스케줄 조회
export const getRegularSchedules = async (
  storeId: number,
  staffId: number,
): Promise<RegularSchedule[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/staffs/${staffId}/regular`,
  );
  return response.data.result;
};

// 고정 스케줄 삭제
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

export const getStaffBriefList = async (
  storeId: number,
): Promise<StaffBrief[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/staffs/brief`,
  );
  return response.data.result;
};

export const getStaffAttendancesList = async (
  storeId: number,
  start: string,
  end: string,
): Promise<StaffAttendance[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/staffs/attendances`,
    {
      params: { start, end },
    },
  );
  return response.data.result;
};
