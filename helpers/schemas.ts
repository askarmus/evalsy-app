import { array, boolean, number, object, ref, string } from "yup";
import zxcvbn from "zxcvbn";
import * as Yup from "yup";
import { freeEmailDomains } from "@/lib/data/freeEmailDomains";

export const LoginSchema = object().shape({
  email: string().email("This field must be an email").required("Email is required"),
  password: string().required("Password is required"),
});

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),

  email: string()
    .email("This field must be an email")
    .required("Email is required")
    .test("is-work-email", "Only work email addresses are allowed", (value: any) => {
      if (!value) return false;
      const domain = value.split("@")[1]?.toLowerCase().trim();
      console.log("TEST domain:", domain);
      return domain && !freeEmailDomains.includes(domain);
      // Block only hotmail.com for now
    }),

  password: Yup.string()
    .required("Password is required")
    .test("password-strength", "Password must be stronger (at least 'Fair')", (value) => {
      if (!value) return false;
      const result = zxcvbn(value);
      return result.score >= 2;
    }),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([ref("password")], "Passwords must match"),
});

export const ForgetPasswordSchema = object().shape({
  email: string().email("This field must be an email").required("Email is required"),
});

export const AddJobSchema = object().shape({
  jobTitle: string().required("Title is required"),
  totalRandomVerbalQuestion: number(),
  totalRandomCodingQuestion: number(),
  description: string().required("Job description is required"),
  experienceLevel: string().required("Please select an experience level"),

  questions: array()
    .of(
      object().shape({
        id: string().required(),
        text: string().required("Question is required"),
        expectedScore: number().required(),
        isRandom: boolean().required(),
        type: string().required(),
        timeLimit: number().when("type", {
          is: "coding",
          then: (schema) => schema.required("Time limit is required for coding questions").min(1, "Time limit must be at least 1 minute"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
        language: string().when("type", {
          is: "coding",
          then: (schema) => schema.required("Language is required for coding questions"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
      })
    )
    .min(1, "At least one question is required")
    .test({
      name: "random-question-limit",
      message: "Total random question should not exceed available random questions",
      test(questions) {
        const { totalRandomVerbalQuestion } = this.parent;
        const randomCount = questions?.filter((q) => q.isRandom).length || 0;

        if (totalRandomVerbalQuestion > randomCount) {
          return this.createError({
            path: "totalRandomVerbalQuestion",
            message: "Total random verbal question should not exceed available random questions",
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
