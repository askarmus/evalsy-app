import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { DarkModeSwitch } from "./darkmodeswitch";
import { AiOutlineHome, AiOutlineNotification, AiOutlineSetting, AiOutlineShopping, AiOutlineUser } from "react-icons/ai";
import { Logo } from "../logo";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden '>
      <Navbar
        position='static'
        isBordered
        className='w-full'
        classNames={{
          wrapper: "w-full max-w-full color-line",
        }}>
        <NavbarContent className='pr-3' justify='center'>
          <NavbarBrand>
            <Logo />
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className='hidden sm:flex gap-4' justify='center'>
          <NavbarItem>
            <Link className='flex items-center text-default-900 hover:text-gray-800 gap-2' href='/'>
              <AiOutlineHome />
              Dashbaord
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='flex items-center text-default-900  hover:text-gray-800 gap-2' href='/jobs/list'>
              <AiOutlineShopping />
              Job
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='flex items-center text-default-900 hover:text-gray-800 gap-2' href='/interview/result'>
              <AiOutlineNotification />
              Result
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link className='flex items-center text-default-900  hover:text-gray-800 gap-2' href='/company/settings'>
              <AiOutlineSetting />
              Settings
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='flex items-center text-default-900  hover:text-gray-800 gap-2' href='/jobs/interviwers'>
              <AiOutlineUser />
              Interviwers
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent className='md:hidden'>
          <BurguerButton />
        </NavbarContent>
        <NavbarContent className='w-full max-md:hidden'></NavbarContent>
        <NavbarContent justify='end' className='w-fit data-[justify=end]:flex-grow-0'>
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
