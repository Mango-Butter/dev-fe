// src/api/payment.ts
import axiosAuth from "../common/axiosAuth.ts";

export const registerBillingKey = async (
  authKey: string,
  customerKey: string,
) => {
  return axiosAuth.post("/api/payments/billing/issue", {
    authKey,
    customerKey,
  });
};
