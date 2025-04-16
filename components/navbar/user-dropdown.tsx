"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem, User } from "@heroui/react";
import { useCallback, useContext } from "react";
import apiClient from "@/helpers/apiClient";
import { truncateText } from "@/app/utils/truncate.text";
import { AuthContext } from "@/context/AuthContext";

export const UserDropdown = () => {
  const { user, loading } = useContext(AuthContext); // 👈 use the context here

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  const getInitials = (name: string | undefined | null): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <User
            className='cursor-pointer'
            avatarProps={{
              name: getInitials(user?.name),
              color: "primary",
            }}
            description='Signed in as'
            name={!loading ? truncateText(user?.name || "", 15) || "User" : "Loading user......"}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label='User menu actions'>
        <DropdownItem key='logout' color='danger' className='text-danger' onPress={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
