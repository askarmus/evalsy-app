import { array, boolean, number, object, ref, string } from 'yup';
import zxcvbn from 'zxcvbn';
import * as Yup from 'yup';
import { freeEmailDomains } from '@/lib/data/freeEmailDomains';

export const LoginSchema = object().shape({
  email: string().email('This field must be an email').required('Email is required'),
  password: string().required('Password is required'),
});

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),

  email: string()
    .email('This field must be an email')
    .required('Email is required')
    .test('is-work-email', 'Only work email addresses are allowed', (value: any) => {
      if (!value) return false;
      const domain = value.split('@')[1]?.toLowerCase().trim();
      console.log('TEST domain:', domain);
      return domain && !freeEmailDomains.includes(domain);
      // Block only hotmail.com for now
    }),

  password: Yup.string()
    .required('Password is required')
    .test('password-strength', "Password must be stronger (at least 'Fair')", (value) => {
      if (!value) return false;
      const result = zxcvbn(value);
      return result.score >= 2;
    }),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([ref('password')], 'Passwords must match'),
});

export const ForgetPasswordSchema = object().shape({
  email: string().email('This field must be an email').required('Email is required'),
});

export const AddJobSchema = Yup.object()
  .shape({
    jobTitle: Yup.string().required('Title is required'),
    totalRandomVerbalQuestion: Yup.number().required(),
    description: Yup.string().required('Job description is required'),
    experienceLevel: Yup.string().required('Please select an experience level'),

    questions: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.string().required(),
          text: Yup.string().required('Question is required'),
          expectedScore: Yup.number().required(),
          isRandom: Yup.boolean().required(),
        })
      )
      .min(1, 'At least one question is required'),
  })
  .test('random-question-limit', 'Total random verbal question should not exceed available random verbal questions', function (values) {
    const { totalRandomVerbalQuestion, questions } = values;
    const randomVerbalCount = questions?.length || 0;
    return totalRandomVerbalQuestion <= randomVerbalCount;
  });

export const SendInvitationSchema = object().shape({
  name: string().required('Name is required'),
  email: string().email('Invalid email address').required('Email is required'),
});

export const CompanySettingsSchema = object().shape({
  name: string().required('Name is required'),
  address: string().nullable(),
  website: string().url('Invalid website URL').nullable(),
  linkedin: string().url('Invalid LinkedIn URL').nullable(),
  facebook: string().url('Invalid Facebook URL').nullable(),
  twitter: string().url('Invalid Twitter URL').nullable(),
  logo: string().url('Invalid logo URL').nullable(),
  phone: string().nullable(),
});

export const ChangePasswordSchema = object().shape({
  oldPassword: string().required('Current Password is required'),
  newPassword: string().min(8, 'Password must be at least 8 characters long').required('New Password is required'),
  confirmPassword: string()
    .oneOf([ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const ChangePasswordSettingSchema = object().shape({
  currentPassword: string().required('Current Password is required'),
  newPassword: string().min(8, 'Password must be at least 8 characters long').required('New Password is required'),
  confirmPassword: string()
    .oneOf([ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});
