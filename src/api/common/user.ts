// src/api/user.ts
import axiosAuth from "./axiosAuth.ts";
import { User } from "../../types/user.ts";

export const fetchUserProfile = async (): Promise<User> => {
  const res = await axiosAuth.get<User>("/api/users/me");
  return res.data;
};
