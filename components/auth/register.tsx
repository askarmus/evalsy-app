"use client";

import { RegisterSchema } from "@/helpers/schemas";
import { RegisterFormType } from "@/helpers/types";
import { registerUser } from "@/services/authService";
import { Button, Input } from "@heroui/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Logo } from "../logo";
import { showToast } from "@/app/utils/toastUtils";

export const Register = () => {
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
        showToast.success("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } catch (error: any) {
      } finally {
        setSubmitting(false);
      }
    },
    [router]
  );

  return (
    <>
      <main className='mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0'>
        <div className='flex'>
          <Logo />
        </div>
        <h2 className='mt-20 text-lg font-semibold text-gray-900'>Sign up for a new account.</h2>

        <div className='mt-2 text-sm  '>
          Already have an account ?{" "}
          <Link href='/login' className='font-medium text-blue-600 hover:underline'>
            Login here
          </Link>
        </div>

        <Formik initialValues={initialValues} validationSchema={RegisterSchema} onSubmit={handleRegister}>
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <>
              <div className='mt-10 grid grid-cols-1 gap-y-8'>
                <Input variant='bordered' label='Name' value={values.name} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} onChange={handleChange("name")} />
                <Input variant='bordered' label='Email' type='email' value={values.email} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} onChange={handleChange("email")} />
                <Input variant='bordered' label='Password' type='password' value={values.password} isInvalid={!!errors.password && !!touched.password} errorMessage={errors.password} onChange={handleChange("password")} />
                <Input variant='bordered' label='Confirm password' type='password' value={values.confirmPassword} isInvalid={!!errors.confirmPassword && !!touched.confirmPassword} errorMessage={errors.confirmPassword} onChange={handleChange("confirmPassword")} />

                <Button onPress={() => handleSubmit()} radius='full' color='primary' isLoading={isSubmitting}>
                  Sign up
                </Button>
              </div>
            </>
          )}
        </Formik>
      </main>
    </>
  );
};
