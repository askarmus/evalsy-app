"use client";

import { ForgetPasswordSchema } from "@/helpers/schemas";
import { ForgetPasswordFormType } from "@/helpers/types";
import { forgetPassword } from "@/services/authService";
import { Button, Input } from "@heroui/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Logo } from "../logo";

export const ForgetPassword = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccess, setSuccess] = useState(false); // Track if the email was successfully sent

  const initialValues: ForgetPasswordFormType = {
    email: "",
  };

  const handleForgetPassword = useCallback(async (values: ForgetPasswordFormType) => {
    try {
      setSubmitting(true);
      const response = await forgetPassword(values);
      if (response) {
        setSuccess(true); // Set success state when the email is sent
      }
    } catch (error: any) {
      // Optionally handle errors here
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <main className='mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0'>
      <div className='flex justify-center'>
        <Logo />
      </div>

      {isSuccess ? (
        // Success message after the password reset email is sent
        <div className='mt-20 text-center'>
          <h2 className='text-lg font-semibold text-green-600'>Check your email!</h2>
          <p className='mt-2 text-sm text-gray-700'>We have sent a password reset link to your email. Please follow the instructions to reset your password.</p>

          <Button className='mt-6' radius='full' color='primary' onPress={() => router.push("/login")}>
            Back to Login
          </Button>
        </div>
      ) : (
        // Forget Password Form
        <>
          <h2 className='mt-20 text-lg font-semibold text-gray-900'>Forgot your password?</h2>
          <p className='mt-2 text-sm text-gray-700'>Enter your email address below and we will send you instructions to reset your password.</p>

          <Formik initialValues={initialValues} validationSchema={ForgetPasswordSchema} onSubmit={handleForgetPassword}>
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <form className='mt-10 grid grid-cols-1 gap-y-8' onSubmit={handleSubmit}>
                <Input variant='bordered' label='Email' type='email' value={values.email} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} onChange={handleChange("email")} />

                <Button type='submit' radius='full' isLoading={isSubmitting} color='primary'>
                  Reset Password
                </Button>
              </form>
            )}
          </Formik>

          <p className='mt-4 text-center text-sm text-gray-700'>
            Remember your password?{" "}
            <Link href='/login' className='font-medium text-blue-600 hover:underline'>
              Sign in here
            </Link>
          </p>
        </>
      )}
    </main>
  );
};
