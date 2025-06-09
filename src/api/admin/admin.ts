import axiosAdmin from "../common/axiosAdmin.ts";
import {
  BossStatisticsItem,
  BossStatisticsResponse,
  StatisticsItem,
  IndustryStatisticsItem,
  IndustryStatisticsResponse,
  FAQItem,
  FAQCategory,
  FAQItemInput,
} from "../../types/admin.ts";

export const fetchBossStatistics = async (): Promise<BossStatisticsItem[]> => {
  try {
    const response = await axiosAdmin.get<BossStatisticsResponse>(
      "/api/admin/dashboard/statistics/boss"
    );

    // ✅ result가 없거나 배열이 아닌 경우 빈 배열 반환
    if (!response.data || !Array.isArray(response.data.result)) {
      return [];
    }

    return response.data.result;
  } catch (error) {
    console.error("사장 통계 API 에러:", error);
    return []; // ✅ 에러 발생 시에도 빈 배열 반환
  }
};

export const fetchStatisticsByPeriod = async (
  startDate: string,
  endDate: string
): Promise<StatisticsItem | null> => {
  try {
    const response = await axiosAdmin.get<StatisticsItem>(
      `/api/admin/dashboard/statistics/overview/period`,
      {
        params: { startDate, endDate },
      }
    );

    console.log("API 응답 전체:", response.data);

    return response.data;
  } catch (error) {
    console.error("기간별 통계 조회 에러:", error);
    return null;
  }
};

export const fetchIndustryStatisticsByPeriod = async (
  startDate: string,
  endDate: string
): Promise<IndustryStatisticsItem[]> => {
  try {
    const response = await axiosAdmin.get<IndustryStatisticsResponse>(
      `/api/admin/dashboard/statistics/industry/period`,
      {
        params: { startDate, endDate },
      }
    );

    if (!response.data || !Array.isArray(response.data.result)) {
      return [];
    }

    return response.data.result;
  } catch (error) {
    console.error("업종 통계 API 에러:", error);
    return [];
  }
};

export const fetchFAQsByCategory = async (
  category: FAQCategory = "ALL"
): Promise<FAQItem[]> => {
  try {
    const response = await axiosAdmin.get<{ result: FAQItem[] }>(
      `/api/admin/faq`,
      { params: { category } }
    );
    return response.data.result;
  } catch (error) {
    console.error("FAQ 불러오기 실패:", error);
    return [];
  }
};

export const createFAQ = (data: FAQItemInput) =>
  axiosAdmin.post(`/api/admin/faq`, data);
export const updateFAQ = (id: number, data: FAQItemInput) =>
  axiosAdmin.put(`/api/admin/faq/${id}`, data);
export const deleteFAQ = async (id: number) => {
  await axiosAdmin.delete(`/api/admin/faq/${id}`);
};
