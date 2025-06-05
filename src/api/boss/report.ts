import { WorkReportListResponse } from "../../types/report.ts";
import axiosAuth from "../common/axiosAuth.ts";

export const getWorkReportsByDate = async (
  storeId: number,
  date: string, // YYYY-MM-DD
): Promise<WorkReportListResponse["result"]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/work-reports`,
    {
      params: { date },
    },
  );
  return response.data.result;
};

interface WorkReportDetail {}

export const getWorkReportDetail = async (
  storeId: number,
  workReportId: number,
): Promise<WorkReportDetail> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/work-reports/${workReportId}`,
  );
  return response.data;
};
