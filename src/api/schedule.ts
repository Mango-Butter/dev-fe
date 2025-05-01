import axiosAuth from "./axiosAuth";

export const getSchedules = (storeId: number) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/schedules`);

export const getScheduleById = (storeId: number, scheduleId: number) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/schedules/${scheduleId}`);

export const getDailySchedules = (storeId: number, date: string) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/schedules/daily`, {
    params: { date },
  });

export const getScheduleSummary = (
  storeId: number,
  start: string,
  end: string,
) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/schedules/summary`, {
    params: { start, end },
  });

export const getCommonDailySchedules = (storeId: number, date: string) =>
  axiosAuth.get(`/api/common/stores/${storeId}/schedules/daily`, {
    params: { date },
  });

export const getSubstitution = (storeId: number, substitutionId: number) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/substitutions/${substitutionId}`);

export const approveSubstitution = (storeId: number, substitutionId: number) =>
  axiosAuth.post(
    `/api/boss/stores/${storeId}/substitutions/${substitutionId}/approve`,
  );

export const rejectSubstitution = (storeId: number, substitutionId: number) =>
  axiosAuth.post(
    `/api/boss/stores/${storeId}/substitutions/${substitutionId}/reject`,
  );

export const requestSubstitution = (
  storeId: number,
  scheduleId: number,
  data: any,
) =>
  axiosAuth.post(
    `/api/staff/stores/${storeId}/schedules/${scheduleId}/substitution`,
    data,
  );
