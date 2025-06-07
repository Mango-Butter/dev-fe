import { WorkReportItem } from "../../types/report.ts";
import axiosAuth from "../common/axiosAuth.ts";

export const getBpssWorkReportsByDate = async (
  storeId: number,
  date: string, // YYYY-MM-DD
): Promise<WorkReportItem[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/work-reports`,
    {
      params: { date },
    },
  );
  return response.data.result;
};

export const getBossWorkReportDetail = async (
  storeId: number,
  workReportId: number,
): Promise<WorkReportItem> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/work-reports/${workReportId}`,
  );
  return response.data;
};
