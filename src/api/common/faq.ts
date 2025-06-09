import { FaqCategory, FaqItem } from "../../types/faq";
import axiosAuth from "./axiosAuth.ts";

/**
 * 역할별 FAQ 조회
 * @param role "boss" | "staff"
 * @param category FAQ 카테고리 (기본값: "ALL")
 */
export const fetchFaqByRole = async (
  role: "boss" | "staff",
  category: FaqCategory = "ALL",
): Promise<FaqItem[]> => {
  const response = await axiosAuth.get<{ result: FaqItem[] }>(
    `/api/${role}/faq`,
    { params: { category } },
  );
  return response.data.result;
};
