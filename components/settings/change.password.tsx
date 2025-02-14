"use client";
import React, { useState } from "react";
import { Button, CardFooter, Input, Card, CardBody } from "@heroui/react";
import { Formik, Form } from "formik";
import { showToast } from "@/app/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import { ChangePasswordSchema } from "@/helpers/schemas";
import { ChangePasswordFormType } from "@/helpers/types";
import { changePassword } from "@/services/authService";
import Cookies from "js-cookie";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues: ChangePasswordFormType = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: ChangePasswordFormType) => {
    try {
      setIsLoading(true);
      var result = await changePassword(values);
      console.log(result);

      showToast.success("Password updated successfully! Logging out...");

      // Clear authentication tokens (adjust based on your auth system)
      localStorage.removeItem("userAuth");
      sessionStorage.removeItem("userAuth");
      Cookies.remove("userAuth");
      Cookies.remove("refreshToken");

      // Redirect to login page after a delay
      setTimeout(() => {
        window.location.href = "/login"; // Adjust this to your login route
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
          <Card className='p-5'>
            <CardBody>
              <h1 className='text-xl font-semibold mb-1'>Change Password</h1>
              <p className='text-sm mb-6'>Please note, After updating, you will be logged out and need to log in again.</p>
              <div className='grid grid-cols-1 gap-4'>
                <Input label='Current Password' name='oldPassword' type='password' value={values.oldPassword} onChange={handleChange} isInvalid={!!errors.oldPassword && !!touched.oldPassword} errorMessage={errors.oldPassword} />
                <Input label='New Password' name='newPassword' type='password' value={values.newPassword} onChange={handleChange} isInvalid={!!errors.newPassword && !!touched.newPassword} errorMessage={errors.newPassword} />
                <Input label='Confirm New Password' name='confirmPassword' type='password' value={values.confirmPassword} onChange={handleChange} isInvalid={!!errors.confirmPassword && !!touched.confirmPassword} errorMessage={errors.confirmPassword} />
              </div>
              <ToastContainer />
            </CardBody>
            <CardFooter>
              <Button type='submit' isLoading={isLoading} color='primary'>
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePassword;
