import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarItem, User } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

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

  const handleLogout = useCallback(() => {
    Cookies.remove("userAuth");
    window.location.href = "/login";
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
