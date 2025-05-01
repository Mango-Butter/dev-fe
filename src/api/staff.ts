import axiosAuth from "./axiosAuth";

export const getStaffList = (storeId: number) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/staff`);

export const getStaff = (storeId: number, staffId: number) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/staffs/${staffId}`);

export const getStaffDocuments = (storeId: number, staffId: number) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/staffs/${staffId}/documents`);

export const getStaffAttendances = (
  storeId: number,
  staffId: number,
  date: string,
) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/staffs/${staffId}/attendences`, {
    params: { date },
  });

export const getStaffSchedules = (
  storeId: number,
  staffId: number,
  date: string,
) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/staffs/${staffId}/schedules`, {
    params: { date },
  });

export const getStaffRegular = (storeId: number, staffId: number) =>
  axiosAuth.get(`/api/boss/stores/${storeId}/staffs/${staffId}/regular`);

export const createStaffRegular = (
  storeId: number,
  staffId: number,
  data: any,
) =>
  axiosAuth.post(`/api/boss/stores/${storeId}/staffs/${staffId}/regular`, data);

export const updateStaffRegular = (
  storeId: number,
  staffId: number,
  regularId: number,
  data: any,
) =>
  axiosAuth.put(
    `/api/boss/stores/${storeId}/staffs/${staffId}/regular/${regularId}`,
    data,
  );
