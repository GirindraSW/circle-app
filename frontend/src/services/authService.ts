import api from "./api";
import type { AuthUser } from "../features/auth/authSlice";

type RegisterPayload = {
  username: string;
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  identifier: string;
  password: string;
};

export type AuthApiResponse = {
  code: number;
  status: string;
  message: string;
  data: AuthUser & { token: string };
};

export type ProfileData = {
  user_id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
};

export type ProfileApiResponse = {
  code: number;
  status: string;
  message: string;
  data: ProfileData;
};

export type UpdateProfilePayload = {
  username?: string;
  name?: string;
  bio?: string;
};

export const registerRequest = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/register", payload);
  return response.data as AuthApiResponse;
};

export const loginRequest = async (payload: LoginPayload) => {
  const response = await api.post("/auth/login", payload);
  return response.data as AuthApiResponse;
};

export const meRequest = async () => {
  const response = await api.get("/auth/me");
  return response.data as ProfileApiResponse;
};

export const updateMeRequest = async (payload: FormData) => {
  const response = await api.patch("/auth/me", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data as ProfileApiResponse;
};
