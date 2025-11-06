'use client';
import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Input, Button, Select, SelectItem } from '@heroui/react';
import { Formik, Form } from 'formik';
import { showToast } from '@/app/utils/toastUtils';
import { UserPlus } from 'lucide-react';
import * as Yup from 'yup';
import { addUser } from '@/services/authService';

const AddUserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().oneOf(['member', 'admin'], 'Invalid role').required('Role is required'),
});

const AddCompanyUser = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    role: 'member',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setIsLoading(true);
      await addUser(values);
      showToast.success('✅ User added successfully!');
    } catch (error: any) {
      console.error('Add user error:', error);
      showToast.error(error.message ?? 'Error adding user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={AddUserSchema} onSubmit={handleSubmit}>
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form>
          <Card radius="md">
            <CardBody>
              <div className="mb-6 flex items-center gap-[5px] mb-3 md:mb-4">
                <UserPlus className="w-5 h-5 text-xl text-secondary-400" />
                <h1 className="text-xl/[24px] font-semibold text-tertiary md:text-[20px]/[24px]">Add New User</h1>
              </div>
              <p className="text-sm text-secondary-500 mb-6">Invite a new team member to your company account.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input variant="bordered" size="sm" label="Name" name="name" value={values.name} onChange={handleChange} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} />
                <Input variant="bordered" size="sm" label="Email" name="email" type="email" value={values.email} onChange={handleChange} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} />
                <Input variant="bordered" size="sm" label="Password" name="password" type="password" value={values.password} onChange={handleChange} isInvalid={!!errors.password && !!touched.password} errorMessage={errors.password} />

                <Select label="Role" selectedKeys={[values.role]} onChange={(e) => setFieldValue('role', e.target.value)} size="sm">
                  <SelectItem key="member">Member</SelectItem>
                  <SelectItem key="admin">Admin</SelectItem>
                </Select>
              </div>
            </CardBody>
            <CardFooter>
              <Button type="submit" color="secondary" variant="flat" radius="full" isLoading={isLoading} startContent={<UserPlus />}>
                Add User
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default AddCompanyUser;
