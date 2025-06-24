'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Drawer, DrawerContent } from '@heroui/react';
import { Menu, X } from 'lucide-react';
import { AiOutlineHome, AiOutlineShopping, AiOutlineNotification, AiOutlineSetting } from 'react-icons/ai';
import { LogoDark } from '@/components/logo.dark';
import { UserDropdown } from './user-dropdown';
import { CreditManager } from '../settings/components/credits/credits/CreditManager';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <AiOutlineHome /> },
    { href: '/interviews/list', label: 'Interview', icon: <AiOutlineShopping /> },
    { href: '/result', label: 'Result', icon: <AiOutlineNotification /> },
    { href: '/company/settings', label: 'Settings', icon: <AiOutlineSetting /> },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-[#98FB98] backdrop-blur supports-[backdrop-filter]:bg-[#98FB98]/95">
      <Navbar maxWidth="2xl" className="bg-transparent px-4 md:px-6" height="4rem">
        {/* Logo */}
        <NavbarBrand>
          <NextLink href="/dashboard" className="flex items-center space-x-2">
            <LogoDark />
          </NextLink>
        </NavbarBrand>

        {/* Desktop Nav */}
        <NavbarContent className="hidden md:flex gap-6 lg:gap-8" justify="center">
          {navItems.map((item) => (
            <NavbarItem key={item.href} isActive={pathname === item.href}>
              <Link as={NextLink} href={item.href} className={`flex items-center gap-2 text-sm font-medium ${pathname === item.href ? 'text-black underline' : 'text-black hover:text-gray-700'} transition-colors hover:underline underline-offset-4`}>
                {item.icon}
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Desktop Actions */}
        <NavbarContent justify="end" className="hidden md:flex gap-4">
          <CreditManager />
          <UserDropdown />
        </NavbarContent>

        {/* Mobile Toggle */}
        <Button className="md:hidden text-black hover:bg-[#7FE67F]" onPress={() => setIsOpen(true)} aria-label="Toggle menu" size="sm" variant="light">
          <Menu className="h-6 w-6" />
        </Button>
      </Navbar>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} onClose={closeMenu} placement="right">
        <DrawerContent className="w-[300px] bg-[#F0FFF4] border-l-2 border-black">
          <div className="flex flex-col h-full p-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-black">
              <NextLink href="/dashboard" onClick={closeMenu} className="flex items-center space-x-2">
                <LogoDark />
              </NextLink>
              <Button onClick={closeMenu} size="sm" variant="light" className="text-black">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-4 py-6 flex-1">
              {navItems.map((item) => (
                <Link key={item.href} as={NextLink} href={item.href} onClick={closeMenu} className="flex items-center gap-2 text-lg font-medium text-black hover:text-gray-700 transition-colors py-2 px-4 rounded hover:bg-[#98FB98] border-2 border-transparent hover:border-black">
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t-2 border-black space-y-2">
              <CreditManager />
              <UserDropdown />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
