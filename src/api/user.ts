// src/api/user.ts
import axiosAuth from "./axiosAuth";
import { User } from "../types/user";

export const fetchUserProfile = async (): Promise<User> => {
  const res = await axiosAuth.get<User>("/api/users/me");
  return res.data;
};
