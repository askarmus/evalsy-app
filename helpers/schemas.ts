import { array, object, ref, string } from "yup";

export const LoginSchema = object().shape({
  email: string().email("This field must be an email").required("Email is required"),
  password: string().required("Password is required"),
});

export const RegisterSchema = object().shape({
  name: string().required("Name is required"),
  email: string().email("This field must be an email").required("Email is required"),
  password: string().required("Password is required"),
  confirmPassword: string()
    .required("Confirm password is required")
    .oneOf([ref("password")], "Passwords must match"),
});

export const ForgetPasswordSchema = object().shape({
  email: string().email("This field must be an email").required("Email is required"),
});
export const AddJobSchema = object().shape({
  jobTitle: string().required("Title is required"),
  description: string().required("Description is required"),
  welcomeMessage: string().required("Welcome message is required").min(100, "Welcome message must be at least 100 characters long"),
  experienceLevel: string().required("Please select a experience Level"),

  questions: array()
    .of(
      object().shape({
        text: string().required("Question is required"),
      })
    )
    .min(1, "At least one question is required"),
});

export const SendInvitationSchema = object().shape({
  name: string().required("Name is required"),
  email: string().email("Invalid email address").required("Email is required"),
  expires: string().required("Expiration date is required"),
  interviewerId: string().required("Interviewer is required"),
});

export const AddInterviewerSchema = object().shape({
  name: string().required("Name is required"),
  jobTitle: string().required("Job Title is required"),
  biography: string().required("Biography is required"),
});

export const CompanySettingsSchema = object().shape({
  name: string().required("Name is required"),
  address: string().nullable(),
  website: string().url("Invalid website URL").nullable(),
  linkedin: string().url("Invalid LinkedIn URL").nullable(),
  facebook: string().url("Invalid Facebook URL").nullable(),
  twitter: string().url("Invalid Twitter URL").nullable(),
  logo: string().url("Invalid logo URL").nullable(),
  phone: string().nullable(),
});

export const ChangePasswordSchema = object().shape({
  newPassword: string().min(8, "Password must be at least 8 characters long").required("New Password is required"),
  confirmPassword: string()
    .oneOf([ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

export const ChangePasswordSettingSchema = object().shape({
  currentPassword: string().required("Current Password is required"),
  newPassword: string().min(8, "Password must be at least 8 characters long").required("New Password is required"),
  confirmPassword: string()
    .oneOf([ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});
