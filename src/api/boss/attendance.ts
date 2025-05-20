// src/api/boss/attendance.ts
import axiosAuth from "../common/axiosAuth";
import {
  StaffAttendanceRecord,
  UpdateAttendanceRequest,
} from "../../types/attendance";

export const getStaffAttendanceRecords = async (
  storeId: number,
  staffId: number,
  start: string, // YYYY-MM-DD
  end: string, // YYYY-MM-DD
): Promise<StaffAttendanceRecord[]> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/schedules/staffs/${staffId}/attendances`,
    {
      params: { start, end },
    },
  );

  return res.data.result;
};

export const getAttendanceDetail = async (
  storeId: number,
  scheduleId: number,
): Promise<StaffAttendanceRecord> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/schedules/${scheduleId}/attendance`,
  );
  return res.data.result;
};

export const updateAttendance = async (
  storeId: number,
  scheduleId: number,
  data: UpdateAttendanceRequest,
): Promise<StaffAttendanceRecord> => {
  const res = await axiosAuth.put(
    `/api/boss/stores/${storeId}/schedules/${scheduleId}/attendance`,
    data,
  );
  return res.data.result;
};
