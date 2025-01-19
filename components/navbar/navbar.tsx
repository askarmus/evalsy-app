import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { DarkModeSwitch } from "./darkmodeswitch";
import Logo from "./logo";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden bbzgxX">
      <Navbar
        position="static"
        isBordered
        className="w-full bg-gray-900"
        classNames={{
          wrapper: "w-full max-w-full color-line",
        }}
      >
        <NavbarContent className=" pr-3" justify="center">
          <NavbarBrand>
            <Logo />
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link className="text-gray-200 hover:text-gray-100" href="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-gray-200 hover:text-gray-100" href="/jobs">
              Job
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              className="text-gray-200 hover:text-gray-100"
              href="/company/settings"
            >
              Settings
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="text-gray-200 hover:text-gray-100"
              href="/jobs/interviwers"
            >
              Interviwers
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className="w-full max-md:hidden"></NavbarContent>
        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0"
        >
          <NotificationsDropdown />

          <NavbarContent>
            <DarkModeSwitch />
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
