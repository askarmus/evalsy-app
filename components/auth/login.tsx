'use client';

import { LoginSchema } from '@/helpers/schemas';
import { LoginFormType } from '@/helpers/types';
import { getCurrentUser, loginUser } from '@/services/authService';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Logo } from '../shared/logo';
import { showToast } from '@/app/utils/toastUtils';

export const Login = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  const initialValues: LoginFormType = {
    email: '',
    password: '',
  };

  const handleLogin = useCallback(
    async (values: LoginFormType) => {
      try {
        setSubmitting(true);

        const response = await loginUser(values);

        if (response?.user) {
          await new Promise((r) => setTimeout(r, 100)); // slight wait for cookie propagation

          await getCurrentUser();

          router.replace('/dashboard');
        } else {
          showToast.error('Login failed: Incomplete token or user data.');
        }
      } catch (error: any) {
        console.error('Login error:', error);
        showToast.error([401, 404].includes(error?.response?.status) ? 'Invalid email or password' : error?.response?.data?.error || 'Login failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [router]
  );

  return (
    <>
      <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
        <div className="flex">
          <Logo />
        </div>

        {/* <p className='mt-2 text-sm  '>
          Don’t have an account?{" "}
          <Link href='/signup' className='font-medium text-blue-600 hover:underline'>
            Signup here
          </Link>{" "}
          for a free trial.
        </p> */}

        <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleLogin}>
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Card shadow="sm" radius="md" className="p-4 mt-6">
              <CardHeader>
                <h2 className=" text-2xl font-semibold ">Sign in to your account</h2>
              </CardHeader>
              <CardBody>
                <div className="mt-10 grid grid-cols-1 gap-y-8">
                  <Input variant="bordered" label="Email" type="email" value={values.email} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} onChange={handleChange('email')} />
                  <Input variant="bordered" label="Password" type="password" value={values.password} isInvalid={!!errors.password && !!touched.password} errorMessage={errors.password} onChange={handleChange('password')} />

                  <Button onPress={() => handleSubmit()} radius="full" isLoading={isSubmitting} color="primary">
                    Login
                  </Button>
                  <p className="mt-2 text-sm text-gray-700">
                    <Link href="/forgetpassword" className="font-medium text-blue-600 hover:underline">
                      Forget Password?
                    </Link>
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </Formik>
      </main>
    </>
  );
};
