'use client';

import { useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Formik } from 'formik';
import { Button, Card, CardBody, CardHeader, Input } from '@heroui/react';
import { showToast } from '@/app/utils/toastUtils';
import { setPassword } from '@/services/authService';
import { Logo } from '@/components/shared/logo';
import { SetPasswordSchema } from '@/helpers/schemas';

export default function SetPassword() {
  const { token } = useParams() as { token: string };
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const initialValues = {
    newPassword: '',
    confirmPassword: '',
    token: token || '',
  };

  const handleSetPassword = useCallback(async (values: typeof initialValues) => {
    try {
      setSubmitting(true);
      const response = await setPassword(values);

      if (response?.message) {
        setSuccess(true);
        showToast.success('Password set successfully! You can now log in.');
      } else {
        showToast.error('Failed to set password. Please try again.');
      }
    } catch (error: any) {
      console.error('Set password error:', error);
      showToast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>

      {isSuccess ? (
        <Card radius="lg" className="p-4 mt-10 rounded-xl">
          <CardBody>
            <div className=" text-center">
              <h2 className="text-lg font-semibold text-green-600">Password Set Successfully!</h2>
              <p className="mt-2 text-sm text-gray-700">You can now sign in with your new password.</p>

              <Button className="mt-6" radius="full" color="secondary" onPress={() => router.push('/login')}>
                Back to Login
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Formik initialValues={initialValues} validationSchema={SetPasswordSchema} onSubmit={handleSetPassword}>
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Card radius="lg" className="p-4 mt-10 rounded-xl">
              <CardHeader>
                <h2 className="text-xl font-semibold">Set Your Password</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 gap-y-8">
                  <Input variant="bordered" label="New Password" type="password" value={values.newPassword} isInvalid={!!errors.newPassword && !!touched.newPassword} errorMessage={errors.newPassword} onChange={handleChange('newPassword')} />

                  <Input variant="bordered" label="Confirm Password" type="password" value={values.confirmPassword} isInvalid={!!errors.confirmPassword && !!touched.confirmPassword} errorMessage={errors.confirmPassword} onChange={handleChange('confirmPassword')} />

                  <Button onPress={() => handleSubmit()} isLoading={isSubmitting} radius="full" color="primary" className="bg-[#100145] text-white">
                    Set Password
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </Formik>
      )}
    </main>
  );
}
