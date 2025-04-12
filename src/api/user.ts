// src/api/user.ts
import axiosAuth from "./axiosAuth";

export const fetchUserProfile = async () => {
  const res = await axiosAuth.get("/api/users/me");
  return res.data;
};
