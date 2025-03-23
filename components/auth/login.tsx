"use client";

import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { loginUser } from "@/services/authService";
import { Button, Input } from "@heroui/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Logo } from "../logo";

export const Login = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  const initialValues: LoginFormType = {
    email: "",
    password: "",
  };

  const handleLogin = useCallback(
    async (values: LoginFormType) => {
      try {
        setSubmitting(true);

        const response = await loginUser(values);

        if (response?.user) {
          router.replace("/dashboard");
        } else {
          console.error("Login failed: No user data received");
        }
      } catch (error: any) {
        console.error("Login failed:", error);
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
        <h2 className='mt-20 text-lg font-semibold '>Sign in to your account</h2>
        <p className='mt-2 text-sm  '>
          Don’t have an account?{" "}
          <Link href='/register' className='font-medium text-blue-600 hover:underline'>
            Register here
          </Link>{" "}
          for a free trial.
        </p>

        <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleLogin}>
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <>
              <div className='mt-10 grid grid-cols-1 gap-y-8'>
                <Input variant='bordered' label='Email' type='email' value={values.email} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} onChange={handleChange("email")} />
                <Input variant='bordered' label='Password' type='password' value={values.password} isInvalid={!!errors.password && !!touched.password} errorMessage={errors.password} onChange={handleChange("password")} />

                <Button onPress={() => handleSubmit()} radius='full' isLoading={isSubmitting} color='primary'>
                  Login
                </Button>
                <p className='mt-2 text-sm text-gray-700'>
                  <Link href='/forgetpassword' className='font-medium text-blue-600 hover:underline'>
                    Forget Password?
                  </Link>
                </p>
              </div>
            </>
          )}
        </Formik>
      </main>
    </>
  );
};
