'use client';
import React, { useState } from 'react';
import { Button, CardFooter, Input, Card, CardBody } from '@heroui/react';
import { Formik, Form } from 'formik';
import { showToast } from '@/app/utils/toastUtils';
import { ChangePasswordSchema } from '@/helpers/schemas';
import { ChangePasswordFormType } from '@/helpers/types';
import { changePassword } from '@/services/authService';
import Cookies from 'js-cookie';
import { KeyRound, Lock } from 'lucide-react';

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: ChangePasswordFormType = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = async (values: ChangePasswordFormType) => {
    try {
      setIsLoading(true);
      var result = await changePassword(values);

      showToast.success('Password updated successfully! Logging out...');

      // Clear authentication tokens (adjust based on your auth system)
      localStorage.removeItem('userAuth');
      sessionStorage.removeItem('userAuth');
      Cookies.remove('userAuth');
      Cookies.remove('refreshToken');

      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = '/login'; // Adjust this to your login route
      }, 2000);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={ChangePasswordSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange }) => (
        <Form>
          <Card radius="md">
            <CardBody>
              <div className="mb-6 flex items-center gap-[5px] mb-3 md:mb-4 ">
                <Lock className="w-5 h-5 text-xl text-secondary-400" />
                <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Change Password</h1>
              </div>
              <p className="text-sm text-secondary-500 mb-6">Please note: After the update, you will be logged out and will need to log in again.</p>

              <div className="grid grid-cols-1 gap-4">
                <Input variant="bordered" size="sm" label="Current Password" name="oldPassword" type="password" value={values.oldPassword} onChange={handleChange} isInvalid={!!errors.oldPassword && !!touched.oldPassword} errorMessage={errors.oldPassword} />
                <Input variant="bordered" size="sm" label="New Password" name="newPassword" type="password" value={values.newPassword} onChange={handleChange} isInvalid={!!errors.newPassword && !!touched.newPassword} errorMessage={errors.newPassword} />
                <Input variant="bordered" size="sm" label="Confirm New Password" name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} isInvalid={!!errors.confirmPassword && !!touched.confirmPassword} errorMessage={errors.confirmPassword} />
              </div>
            </CardBody>
            <CardFooter>
              <Button type="submit" startContent={<KeyRound />} isLoading={isLoading} color="secondary" variant="flat" radius="full">
                Update password
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePassword;
