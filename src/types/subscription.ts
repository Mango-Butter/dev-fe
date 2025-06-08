// src/types/subscription.ts

export type SubscriptionPlanType = "PREMIUM" | null;
export type PaymentStatus = "DONE" | "FAILED";

export interface SubscriptionInfo {
  planType: SubscriptionPlanType;
  startedAt: string | null;
  expiredAt: string | null;
  nextPaymentDate: string | null;
}

export interface SubscriptionOrderHistory {
  orderId: string;
  planType: "PREMIUM";
  amount: number;
  paymentStatus: PaymentStatus;
  failReason: string | null;
  createdAt: string;
}
