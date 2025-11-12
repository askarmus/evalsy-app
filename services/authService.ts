import apiClient from '@/helpers/apiClient';

import { ResetPasswordFormType, ChangePasswordFormType, ForgetPasswordFormType, LoginFormType, RegisterFormType } from '@/helpers/types';

export const registerUser = async (values: RegisterFormType) => {
  const response = await apiClient.post('/auth/register', values);
  return response.data;
};

export const forgetPassword = async (values: ForgetPasswordFormType) => {
  const response = await apiClient.post('/auth/forgotPassword', values);
  return response.data;
};

export const changePassword = async (values: ChangePasswordFormType) => {
  const response = await apiClient.post('/auth/changePassword', values);
  return response.data;
};

export const resetPassword = async (values: ResetPasswordFormType) => {
  const response = await apiClient.post('/auth/resetPassword', values);
  return response.data;
};
export const addUser = async (values: any) => {
  const response = await apiClient.post('/auth/add-user', values);
  return response.data;
};

export const loginUser = async (values: LoginFormType) => {
  const response = await apiClient.post('/auth/login', values, {
    withCredentials: true,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export async function getCompanyUsers() {
  const res = await apiClient.get('/auth/company/users');
  return res.data;
}

// 🔹 Toggle user enable/disable (admin/owner only)
export const toggleUserStatus = async (userId: string, isActive: boolean) => {
  const res = await apiClient.put('/auth/company/user/status', { userId, isActive });
  return res.data;
};

export const setPassword = async (values: ResetPasswordFormType) => {
  const response = await apiClient.post('/auth/set-password', values);
  return response.data;
};
