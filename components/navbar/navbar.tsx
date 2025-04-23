import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { DarkModeSwitch } from "./darkmodeswitch";
import { AiOutlineHome, AiOutlineNotification, AiOutlineSetting, AiOutlineShopping, AiOutlineUser } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { DarkLogo } from "../shared/dark-logo";

export const NavbarWrapper = () => {
  const currentPath = usePathname();

  return (
    <Navbar
      position='sticky'
      isBordered
      className='w-full bg-[#1E293B] text-[#F1F5F9]'
      classNames={{
        wrapper: "w-full max-w-full  ",
      }}>
      <NavbarContent className='pr-3' justify='center'>
        <NavbarBrand>
          <Link className='flex items-center hover:text-blue-200 gap-2' href='/dashboard'>
            <DarkLogo />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem isActive={currentPath === "/dashboard"}>
          <Link className='flex items-center text-md hover:text-blue-100 gap-2' href='/dashboard'>
            <AiOutlineHome />
            Dashboard
          </Link>
        </NavbarItem>

        <NavbarItem isActive={currentPath === "/jobs/list"}>
          <Link className='flex items-center text-md hover:text-blue-100 gap-2' href='/jobs/list'>
            <AiOutlineShopping />
            Interview
          </Link>
        </NavbarItem>

        <NavbarItem isActive={currentPath === "/interview/result"}>
          <Link className='flex items-center text-md hover:text-blue-100 gap-2' href='/interview/result'>
            <AiOutlineNotification />
            Result
          </Link>
        </NavbarItem>

        <NavbarItem isActive={currentPath === "/company/settings"}>
          <Link className='flex items-center text-md hover:text-blue-100 gap-2' href='/company/settings'>
            <AiOutlineSetting />
            Settings
          </Link>
        </NavbarItem>

        <NavbarItem isActive={currentPath === "/jobs/interviwers"}>
          <Link className='flex items-center text-md hover:text-blue-100 gap-2' href='/jobs/interviwers'>
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
          <DarkModeSwitch />
          <UserDropdown />
        </NavbarContent>
      </NavbarContent>
    </Navbar>
  );
};
