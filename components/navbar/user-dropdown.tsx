import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem, User } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import apiClient from "@/helpers/apiClient";
import { getUser } from "@/services/authService";

export const UserDropdown = () => {
  const [user, setUser] = useState({ name: "", initials: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser();

      // Assuming `user.user.name` exists and you want initials
      const initials = data.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      setUser({ name: data.user.name || "", initials });
    };

    fetchUser();
  }, []);
  const handleLogout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <User
            className='cursor-pointer'
            avatarProps={{
              name: user.initials,
              color: "primary",
            }}
            description='Signed in as'
            name={user.name || "User"}
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label='User menu actions' onAction={(actionKey) => console.log({ actionKey })}>
        <DropdownItem key='logout' color='danger' className='text-danger' onPress={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
