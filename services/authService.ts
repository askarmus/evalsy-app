import apiClient from "@/helpers/apiClient";

import { ResetPasswordFormType, ChangePasswordFormType, ForgetPasswordFormType, LoginFormType, RegisterFormType } from "@/helpers/types";
import axios from "axios";

export const registerUser = async (values: RegisterFormType) => {
  const response = await apiClient.post("/auth/register", values);
  return response.data;
};

export const forgetPassword = async (values: ForgetPasswordFormType) => {
  const response = await apiClient.post("/auth/forgotPassword", values);
  return response.data;
};

export const changePassword = async (values: ChangePasswordFormType) => {
  const response = await apiClient.post("/auth/changePassword", values);
  return response.data;
};

export const resetPassword = async (values: ResetPasswordFormType) => {
  const response = await apiClient.post("/auth/resetPassword", values);
  return response.data;
};
export const loginUser = async (values: LoginFormType) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, values, {
    withCredentials: true,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};
