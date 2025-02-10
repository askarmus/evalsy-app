// FORMS

export type LoginFormType = {
  email: string;
  password: string;
};

export type ForgetPasswordFormType = {
  email: string;
};

export type RegisterFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordFormType = {
  newPassword: string;
  confirmPassword: string;
  token: string;
};

export type ChangePasswordFormType = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
