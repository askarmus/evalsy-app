import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem, User } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import apiClient from "@/helpers/apiClient";

export const UserDropdown = () => {
  const [user, setUser] = useState({ name: "", initials: "" });

  useEffect(() => {
    // Assuming the JWT token is stored in cookies under 'userAuth'
    const token = Cookies.get("userAuth");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const name = payload.name || "";

      // Extract initials from the name
      const initials = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      setUser({ name, initials });
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout", {}, { withCredentials: true });

      // Redirect after logout
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
