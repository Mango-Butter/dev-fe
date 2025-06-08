// src/api/subscription.ts
import axiosAuth from "../common/axiosAuth.ts";
import {
  SubscriptionInfo,
  SubscriptionOrderHistory,
} from "../../types/subscription.ts";

export const fetchSubscriptionInfo = async (): Promise<SubscriptionInfo> => {
  const response = await axiosAuth.get<SubscriptionInfo>("/api/subscription");
  return response.data;
};

export const createSubscription = async (planType: "PREMIUM") => {
  return axiosAuth.post("/api/subscription", { planType });
};

export const deleteSubscription = async () => {
  return axiosAuth.delete("/api/subscription");
};

export const fetchSubscriptionOrderHistory = async (): Promise<
  SubscriptionOrderHistory[]
> => {
  const response = await axiosAuth.get<{ result: SubscriptionOrderHistory[] }>(
    "/api/subscription/order-history",
  );
  return response.data.result;
};
