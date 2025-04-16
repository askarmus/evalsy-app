import { array, boolean, number, object, ref, string } from "yup";
import zxcvbn from "zxcvbn";

export const LoginSchema = object().shape({
  email: string().email("This field must be an email").required("Email is required"),
  password: string().required("Password is required"),
});

export const RegisterSchema = object().shape({
  name: string().required("Name is required"),
  email: string().email("This field must be an email").required("Email is required"),
  password: string()
    .required("Password is required")
    .test("password-strength", "Password must be stronger (at least 'Good')", (value) => {
      if (!value) return false;
      const result = zxcvbn(value);
      return result.score >= 3; // Only allow Good (3) and Strong (4)
    }),
  confirmPassword: string()
    .required("Confirm password is required")
    .oneOf([ref("password")], "Passwords must match"),
});
export const ForgetPasswordSchema = object().shape({
  email: string().email("This field must be an email").required("Email is required"),
});
export const AddJobSchema = object().shape({
  jobTitle: string().required("Title is required"),

  totalRandomQuestion: number(),

  description: string().required("Job description is required"),

  experienceLevel: string().required("Please select an experience level"),

  questions: array()
    .of(
      object().shape({
        id: string().required(),
        text: string().required("Question is required"),
        expectedScore: number().required(),
        isRandom: boolean().required(),
      })
    )
    .min(1, "At least one question is required")
    .test({
      name: "random-question-limit",
      message: "Total random question should not exceed available random questions",
      test(questions) {
        const { totalRandomQuestion } = this.parent;
        const randomCount = questions?.filter((q) => q.isRandom).length || 0;

        if (totalRandomQuestion > randomCount) {
          return this.createError({
            path: "totalRandomQuestion",
            message: "Total random question should not exceed available random questions",
          });
        }

        return true;
      },
    }),
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
  oldPassword: string().required("Current Password is required"),
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
