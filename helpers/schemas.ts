import { array, object, ref, string } from "yup";

export const LoginSchema = object().shape({
  email: string()
    .email("This field must be an email")
    .required("Email is required"),
  password: string().required("Password is required"),
});

export const RegisterSchema = object().shape({
  name: string().required("Name is required"),
  email: string()
    .email("This field must be an email")
    .required("Email is required"),
  password: string().required("Password is required"),
  confirmPassword: string()
    .required("Confirm password is required")
    .oneOf([ref("password")], "Passwords must match"),
});

export const AddJobSchema = object().shape({
  title: string().required("Title is required"),
  description: string().required("Description is required"),
  aiLevel: string().required("Please select a level"),

  questions: array()
    .of(
      object().shape({
        text: string().required("Question is required"),
      })
    )
    .min(1, "At least one question is required"),
});
