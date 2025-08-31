'use client';

import { Button, User } from '@heroui/react';
import { useCallback } from 'react';
import apiClient from '@/helpers/apiClient';
import { truncateText } from '@/app/utils/truncate.text';

import { useAuthContext } from '@/context/AuthContext';

export const UserDropdown = () => {
  const { user, loading } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout', {}, { withCredentials: true });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, []);

  const getInitials = (name: string | undefined | null): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <User
        className="cursor-pointer  "
        avatarProps={{
          name: getInitials(user?.name),
          className: 'bg-secondary-300  ',
        }}
        description={<span>Signed in as</span>}
        name={!loading ? truncateText(user?.name || '', 15) || 'User' : 'Loading user......'}
      />

      <Button key="logout" color="secondary" size="sm" onPress={handleLogout} radius="full" variant="bordered">
        Log Out
      </Button>
    </>
  );
};
