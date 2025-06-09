export type FaqCategory = "SERVICE" | "PAYMENT" | "ACCOUNT" | "ALL";
export const categoryLabelMap: Record<FaqCategory, string> = {
  ALL: "전체",
  SERVICE: "서비스",
  PAYMENT: "결제",
  ACCOUNT: "계정",
};

export interface FaqItem {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
}
