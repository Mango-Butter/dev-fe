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

export const fetchCustomerKey = async () => {
  const response = await axiosAuth.get("/api/payments/customer-key");
  return response.data;
};

export const fetchPaymentMethod = async () => {
  const response = await axiosAuth.get<{
    cardCompany: string | null;
    cardNumber: string | null;
    cardType: "체크" | "신용" | null;
    ownerType: "개인" | "법인" | null;
  }>("/api/payments");

  return response.data;
};
