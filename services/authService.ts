import apiClient from "@/helpers/apiClient";
import { ResetPasswordFormType, ChangePasswordFormType, ForgetPasswordFormType, LoginFormType, RegisterFormType } from "@/helpers/types";
import Cookies from "js-cookie";

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
  const response = await apiClient.post("/auth/login", values);

  if (response.data?.token) {
    // Store the token in cookies for secure storage
    Cookies.set("userAuth", response.data.token, {
      expires: 1, // 1 day expiration
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict", // Prevent CSRF attacks
    });
  }

  return response.data;
};
