import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { DarkModeSwitch } from "./darkmodeswitch";
import { AiOutlineHome, AiOutlineNotification, AiOutlineSetting, AiOutlineShopping } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { DarkLogo } from "../shared/dark-logo";

export const NavbarWrapper = () => {
  const currentPath = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar
      position='sticky'
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      className='w-full bg-[#1E293B] text-[#F1F5F9]'
      classNames={{
        wrapper: "w-full max-w-full",
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

        <NavbarItem isActive={currentPath === "/result"}>
          <Link className='flex items-center text-md hover:text-blue-100 gap-2' href='/result'>
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
      </NavbarContent>

      <NavbarContent justify='end' className='w-fit data-[justify=end]:flex-grow-0'>
        <NavbarContent>
          <UserDropdown />
        </NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className='sm:hidden' />
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>.</NavbarMenuItem>
        <NavbarMenuItem>
          <Link href='/dashboard' className='w-full'>
            Dashboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href='/jobs/list' className='w-full'>
            Interview
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href='/result' className='w-full'>
            Result
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href='/company/settings' className='w-full'>
            Settings
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};
