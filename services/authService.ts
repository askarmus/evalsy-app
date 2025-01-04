import apiClient from "@/helpers/apiClient";
import { LoginFormType, RegisterFormType } from "@/helpers/types";

export const registerUser = async (values: RegisterFormType) => {
  const response = await apiClient.post("/auth/register", values);
  return response.data;
};

export const loginUser = async (values: LoginFormType) => {
  const response = await apiClient.post("/auth/login", values);
  return response.data;
};
