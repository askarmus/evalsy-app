'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, Input, Button, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@heroui/react';
import { Formik, Form } from 'formik';
import { showToast } from '@/app/utils/toastUtils';
import { UserPlus, Users, Mail, Crown, User, UserCog, Power } from 'lucide-react';
import * as Yup from 'yup';
import { addUser, getCompanyUsers, toggleUserStatus } from '@/services/authService';

const AddUserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().oneOf(['member', 'admin'], 'Invalid role').required('Role is required'),
});

export default function AddCompanyUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const initialValues = { name: '', email: '', role: 'member' };

  // 🔹 Load all users
  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const data = await getCompanyUsers();
      setUsers(data.data);
    } catch {
      showToast.error('Failed to load users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔹 Handle Add User
  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
      setIsLoading(true);
      await addUser(values);
      showToast.success('✅ User added successfully! A password setup email has been sent.');
      resetForm();
      await loadUsers();
    } catch (error: any) {
      showToast.error(error.message ?? 'Error adding user');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Enable/disable user
  const handleToggle = async (userId: string, currentState: boolean) => {
    try {
      await toggleUserStatus(userId, !currentState);
      showToast.success(`User ${!currentState ? 'enabled' : 'disabled'} successfully!`);
      await loadUsers();
    } catch (error: any) {
      showToast.error(error.message ?? 'Error updating user status');
    }
  };

  // 🔹 Icon by role
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <UserCog className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Formik initialValues={initialValues} validationSchema={AddUserSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <Card radius="md">
              <CardBody>
                <div className="mb-6 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-secondary-400" />
                  <h1 className="text-xl font-semibold text-tertiary">Add New User</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="Name" name="name" variant="bordered" size="sm" value={values.name} onChange={handleChange} isInvalid={!!errors.name && !!touched.name} errorMessage={errors.name} />
                  <Input label="Email" name="email" type="email" variant="bordered" size="sm" value={values.email} onChange={handleChange} isInvalid={!!errors.email && !!touched.email} errorMessage={errors.email} />
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

      {/* 🔹 User List */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-secondary-400" />
            <h2 className="text-lg font-semibold">Company Users</h2>
          </div>

          {isLoadingUsers ? (
            <div className="flex justify-center py-6">
              <Spinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500">No users found.</p>
          ) : (
            <Table aria-label="Company Users" isStriped shadow="none" className="mt-4">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn className="text-right">Status</TableColumn>
              </TableHeader>

              <TableBody emptyContent="No users found">
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(u.role)}
                        <span>{u.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-secondary-400" />
                        <span>{u.email}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="capitalize">{u.role}</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end">
                        <Button size="sm" radius="full" color={u.is_active ? 'success' : 'danger'} variant="flat" startContent={<Power className="w-4 h-4" />} onPress={() => handleToggle(u.id, u.is_active)}>
                          {u.is_active ? 'Active' : 'Disabled'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
