'use client';

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem, User } from '@heroui/react';
import { useCallback, useContext } from 'react';
import apiClient from '@/helpers/apiClient';
import { truncateText } from '@/app/utils/truncate.text';
import { DarkModeSwitch } from './darkmodeswitch';
import { useAuthContext } from '@/context/AuthContext';
import { ArrowDown } from 'lucide-react';

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
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <User
            className="cursor-pointer text-white"
            avatarProps={{
              name: getInitials(user?.name),
              className: 'bg-secondary-300 text-white  ',
            }}
            description={<span className="text-secondary-100">Signed in as</span>}
            name={!loading ? truncateText(user?.name || '', 15) || 'User' : 'Loading user......'}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions">
        <DropdownItem key="logout" color="primary" onPress={handleLogout}>
          Log Out
        </DropdownItem>
        <DropdownItem key="dark-mode" color="default">
          <DarkModeSwitch />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
