import apiClient from "@/helpers/apiClient";
import { LoginFormType, RegisterFormType } from "@/helpers/types";
import Cookies from "js-cookie";

export const registerUser = async (values: RegisterFormType) => {
  const response = await apiClient.post("/auth/register", values);
  return response.data;
};

export const loginUser = async (values) => {
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
