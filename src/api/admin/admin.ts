import axiosAdmin from "../common/axiosAdmin.ts";
import {
  BossStatisticsItem,
  BossStatisticsResponse,
} from "../../types/admin.ts";

export const fetchBossStatistics = async (): Promise<BossStatisticsItem[]> => {
  const response = await axiosAdmin.get<BossStatisticsResponse>(
    "/api/admin/dashboard/statistics/boss",
  );
  return response.data.result;
};
