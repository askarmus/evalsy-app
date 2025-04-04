"use client";

import { ChangePasswordSchema } from "@/helpers/schemas";
import { resetPassword } from "@/services/authService";
import { Button, Input } from "@heroui/react";
import { Formik } from "formik";
import { useCallback, useState } from "react";
import { Logo } from "../logo";
import { ResetPasswordFormType } from "@/helpers/types";
import { useParams, useRouter } from "next/navigation";

export const ResetPassword = () => {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const { token } = useParams() as { token: string };

  const initialValues: ResetPasswordFormType = {
    newPassword: "",
    confirmPassword: "",
    token: token || "",
  };

  const handleChangePassword = useCallback(
    async (values: ResetPasswordFormType) => {
      try {
        setSubmitting(true);
        await resetPassword(values);
        setSuccess(true);
      } catch (error: any) {
      } finally {
        setSubmitting(false);
      }
    },
    [token]
  );

  return (
    <main className='mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0'>
      <div className='flex justify-center'>
        <Logo />
      </div>

      {isSuccess ? (
        <div className='mt-20 text-center'>
          <h2 className='text-lg font-semibold text-green-600'>Password Changed Successfully!</h2>
          <p className='mt-2 text-sm text-gray-700'>Your password has been updated. You can now sign in with your new password.</p>

          <Button className='mt-6' radius='full' color='primary' onPress={() => router.push("/login")}>
            Back to Login
          </Button>
        </div>
      ) : (
        <>
          <h2 className='mt-20 text-lg font-semibold text-gray-900'>Set Your New Password</h2>
          <p className='mt-2 text-sm text-gray-700'>Please enter your new password below.</p>

          <Formik initialValues={initialValues} validationSchema={ChangePasswordSchema} onSubmit={handleChangePassword}>
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <form className='mt-10 grid grid-cols-1 gap-y-8' onSubmit={handleSubmit}>
                <Input variant='bordered' label='New Password' type='password' value={values.newPassword} isInvalid={!!errors.newPassword && !!touched.newPassword} errorMessage={errors.newPassword} onChange={handleChange("newPassword")} />

                <Input variant='bordered' label='Confirm New Password' type='password' value={values.confirmPassword} isInvalid={!!errors.confirmPassword && !!touched.confirmPassword} errorMessage={errors.confirmPassword} onChange={handleChange("confirmPassword")} />

                <Button type='submit' radius='full' isLoading={isSubmitting} color='primary'>
                  Change Password
                </Button>
              </form>
            )}
          </Formik>
        </>
      )}
    </main>
  );
};
