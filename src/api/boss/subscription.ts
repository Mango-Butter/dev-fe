import axiosAuth from "../common/axiosAuth.ts";

export const fetchCustomerKey = async () => {
  const response = await axiosAuth.get("/api/payments/customer-key");
  return response.data;
};