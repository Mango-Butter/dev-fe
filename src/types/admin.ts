export interface BossStatisticsItem {
  bossName: string;
  storeCount: number;
  staffCount: number;
}

export interface BossStatisticsResponse {
  result: BossStatisticsItem[];
}

export interface StatisticsItem {
  bossCount: number;
  storeCount: number;
  totalUserCount: number;
  staffCount: number;
  storeTypeCount: number;
}

export interface IndustryStatisticsItem {
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
  storeCount: number;
}

export interface IndustryStatisticsResponse {
  result: IndustryStatisticsItem[];
}

export type FAQCategory = "SERVICE" | "PAYMENT" | "ACCOUNT" | "ALL";

export interface FAQItem {
  id: number;
  category: FAQCategory;
  question: string;
  answer: string;
}

export interface FAQItemInput {
  category: Exclude<FAQCategory, "ALL">;
  question: string;
  answer: string;
}
