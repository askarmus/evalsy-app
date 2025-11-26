'use client';

import { RegisterSchema } from '@/helpers/schemas';
import { RegisterFormType } from '@/helpers/types';
import { registerUser } from '@/services/authService';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Logo } from '../shared/logo';
import { showToast } from '@/app/utils/toastUtils';
import zxcvbn from 'zxcvbn';
import { LogoDark } from '../logo.dark';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export const Signup = () => {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  const initialValues: RegisterFormType = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const handleRegister = useCallback(
    async (values: RegisterFormType) => {
      try {
        setSubmitting(true);
        await registerUser(values);
        setTimeout(() => {
          router.push(`/confirm-message?email=${values.email}`);
        }, 2000);
      } catch (error: any) {
        const message = error?.response?.data?.error || error?.message;
        showToast.error(message || 'Something went wrong.');
      } finally {
        setSubmitting(false);
      }
    },
    [router]
  );

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good'];
  const strengthColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-blue-500', 'bg-green-500'];
  const labelColors = ['text-red-500', 'text-orange-400', 'text-yellow-500', 'text-blue-500', 'text-green-500'];

  return (
    <main className="min-h-screen flex items-center justify-center  px-4">
      <Formik initialValues={initialValues} validationSchema={RegisterSchema} onSubmit={handleRegister}>
        {({ values, errors, touched, handleChange, handleSubmit }) => {
          const strength = zxcvbn(values.password || '').score;

          return (
            <Card radius="lg" className="w-full max-w-6xl shadow-lg rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* LEFT PANEL - FEATURES */}
                <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 text-white">
                  <img src="/final-dark.png" className="max-w-[120px] " alt="evalsy logo" />

                  <h2 className="text-3xl font-bold mt-6">Hire Faster with Evalsy AI</h2>

                  <p className="mt-3 opacity-90">Automate screening. Shortlist instantly. Interview smarter.</p>

                  <ul className="mt-8 space-y-3 text-sm">
                    <li className="flex items-center">
                      <AiOutlineCheckCircle className="text-white mr-3 h-5 w-5" />
                      <span>Shortlist 1000 resumes in minutes</span>
                    </li>

                    <li className="flex items-center">
                      <AiOutlineCheckCircle className="text-white mr-3 h-5 w-5" />
                      <span>AI interview and scoring engine</span>
                    </li>

                    <li className="flex items-center">
                      <AiOutlineCheckCircle className="text-white mr-3 h-5 w-5" />
                      <span>Report generation for HR teams</span>
                    </li>
                  </ul>

                  <p className="mt-10 text-xs opacity-80">www.evalsy.com</p>
                </div>

                {/* RIGHT PANEL - FORM */}
                <div className="p-8">
                  <p className="text-sm text-right">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-600 hover:underline">
                      Login
                    </Link>
                  </p>

                  <CardHeader className="px-0">
                    <h2 className="text-2xl font-semibold">Sign in to your account</h2>
                  </CardHeader>

                  <CardBody className="px-0">
                    <div className="mt-6 grid grid-cols-1 gap-y-5">
                      <Input variant="bordered" label="Name" value={values.name} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} onChange={handleChange('name')} />

                      <Input variant="bordered" label="Email" type="email" value={values.email} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} onChange={handleChange('email')} />

                      <div>
                        <Input variant="bordered" label="Password" type="password" value={values.password} isInvalid={!!errors.password && !!touched.password} errorMessage={errors.password} onChange={handleChange('password')} />

                        {values.password && (
                          <div className="mt-2">
                            <div className="w-full h-1 rounded bg-gray-200">
                              <div className={`h-1 rounded transition-all duration-300 ${strengthColors[strength]}`} style={{ width: `${(strength + 1) * 20}%` }} />
                            </div>
                            <p className={`mt-1 text-xs font-medium ${labelColors[strength]}`}>Strength: {strengthLabels[strength]}</p>
                          </div>
                        )}
                      </div>

                      <Input variant="bordered" label="Confirm Password" type="password" value={values.confirmPassword} isInvalid={!!errors.confirmPassword && !!touched.confirmPassword} errorMessage={errors.confirmPassword} onChange={handleChange('confirmPassword')} />

                      <Button onPress={() => handleSubmit()} radius="full" color="secondary" isLoading={isSubmitting}>
                        Sign up
                      </Button>
                    </div>
                  </CardBody>
                </div>
              </div>
            </Card>
          );
        }}
      </Formik>
    </main>
  );
};
