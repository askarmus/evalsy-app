import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { DarkModeSwitch } from "./darkmodeswitch";
import { AiOutlineHome, AiOutlineNotification, AiOutlineSetting, AiOutlineShopping, AiOutlineUser } from "react-icons/ai";
import { Logo } from "../logo";
import { usePathname } from "next/navigation";

export const NavbarWrapper = () => {
  const currentPath = usePathname();

  return (
    <Navbar
      position='sticky'
      isBordered
      className='w-full'
      classNames={{
        wrapper: "w-full max-w-full color-line",
      }}>
      <NavbarContent className='pr-3' justify='center'>
        <NavbarBrand>
          <Link className='flex items-center text-default-800 hover:text-blue-900 gap-2' href='/dashboard'>
            <Logo />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem isActive={currentPath === "/dashboard"}>
          <Link className='flex items-center text-md text-default-800 hover:text-blue-900 gap-2' href='/dashboard'>
            <AiOutlineHome />
            Dashboard
          </Link>
        </NavbarItem>

        <NavbarItem isActive={currentPath === "/jobs/list"}>
          <Link className='flex items-center text-md text-default-800 hover:text-blue-900 gap-2' href='/jobs/list'>
            <AiOutlineShopping />
            Job
          </Link>
        </NavbarItem>

        <NavbarItem isActive={currentPath === "/interview/result"}>
          <Link className='flex items-center text-md text-default-800 hover:text-blue-900 gap-2' href='/interview/result'>
            <AiOutlineNotification />
            Result
          </Link>
        </NavbarItem>

        <NavbarItem isActive={currentPath === "/company/settings"}>
          <Link className='flex items-center text-md text-default-800 hover:text-blue-900 gap-2' href='/company/settings'>
            <AiOutlineSetting />
            Settings
          </Link>
        </NavbarItem>

        <NavbarItem isActive={currentPath === "/jobs/interviwers"}>
          <Link className='flex items-center text-md text-default-800 hover:text-blue-900 gap-2' href='/jobs/interviwers'>
            <AiOutlineUser />
            Interviewers
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className='md:hidden'>
        <BurguerButton />
      </NavbarContent>

      <NavbarContent justify='end' className='w-fit data-[justify=end]:flex-grow-0'>
        <NavbarContent>
          {/* <NotificationsDropdown /> */}
          <DarkModeSwitch />
          <UserDropdown />
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
};
