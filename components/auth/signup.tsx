"use client";

import { RegisterSchema } from "@/helpers/schemas";
import { RegisterFormType } from "@/helpers/types";
import { registerUser } from "@/services/authService";
import { Button, Input } from "@heroui/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Logo } from "../shared/logo";
import { showToast } from "@/app/utils/toastUtils";
import zxcvbn from "zxcvbn";

export const Signup = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  const initialValues: RegisterFormType = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleRegister = useCallback(
    async (values: RegisterFormType) => {
      try {
        setSubmitting(true);
        await registerUser(values);
        showToast.success("Sign up successful! Redirecting to login...");
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } catch (error: any) {
        const message = error?.response?.data?.error || error?.message;
        showToast.error(message || "Something went wrong.");
      } finally {
        setSubmitting(false);
      }
    },
    [router]
  );

  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good"];
  const strengthColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-blue-500", "bg-green-500"];
  const labelColors = ["text-red-500", "text-orange-400", "text-yellow-500", "text-blue-500", "text-green-500"];

  return (
    <main className='mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0'>
      <div className='flex'>
        <Logo />
      </div>
      <h2 className='mt-20 text-2xl font-semibold'>Sign up for a new account.</h2>

      <div className='mt-2 text-sm'>
        Already have an account?{" "}
        <Link href='/login' className='font-medium text-blue-600 hover:underline'>
          Login here
        </Link>
      </div>

      <Formik initialValues={initialValues} validationSchema={RegisterSchema} onSubmit={handleRegister}>
        {({ values, errors, touched, handleChange, handleSubmit }) => {
          const strength = zxcvbn(values.password || "").score;

          return (
            <div className='mt-10 grid grid-cols-1 gap-y-6'>
              <Input variant='bordered' label='Name' value={values.name} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} onChange={handleChange("name")} />

              <Input variant='bordered' label='Email' type='email' value={values.email} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} onChange={handleChange("email")} />

              <div>
                <Input variant='bordered' label='Password' type='password' value={values.password} isInvalid={!!errors.password && !!touched.password} errorMessage={errors.password} onChange={handleChange("password")} />

                {values.password && (
                  <div className='mt-2'>
                    <div className='w-full h-2 rounded bg-gray-200'>
                      <div className={`h-1 rounded transition-all duration-300 ${strengthColors[strength]}`} style={{ width: `${(strength + 1) * 20}%` }}></div>
                    </div>
                    <p className={`mt-1 text-xs font-medium ${labelColors[strength]}`}>Strength: {strengthLabels[strength]}</p>
                  </div>
                )}
              </div>

              <Input variant='bordered' label='Confirm Password' type='password' value={values.confirmPassword} isInvalid={!!errors.confirmPassword && !!touched.confirmPassword} errorMessage={errors.confirmPassword} onChange={handleChange("confirmPassword")} />

              <Button onPress={() => handleSubmit()} radius='full' color='primary' isLoading={isSubmitting}>
                Sign up
              </Button>
            </div>
          );
        }}
      </Formik>
    </main>
  );
};
