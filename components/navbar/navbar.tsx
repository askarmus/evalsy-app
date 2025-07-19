'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenu, NavbarMenuToggle } from '@heroui/react';
import { Menu, X } from 'lucide-react';
import { AiOutlineHome, AiOutlineShopping, AiOutlineNotification, AiOutlineSetting, AiOutlineMail } from 'react-icons/ai';
import { LogoDark } from '@/components/logo.dark';
import { UserDropdown } from './user-dropdown';
import { CreditManager } from '../settings/components/credits/credits/CreditManager';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <AiOutlineHome /> },
    { href: '/interviews/list', label: 'Interview', icon: <AiOutlineShopping /> },
    { href: '/result', label: 'Result', icon: <AiOutlineNotification /> },
    { href: '/invitations', label: 'Invitations', icon: <AiOutlineMail /> },
    { href: '/company/settings', label: 'Settings', icon: <AiOutlineSetting /> },
  ];

  return (
    <Navbar
      maxWidth="xl"
      shouldHideOnScroll={false}
      className="bg-[#0B0A33] sticky top-0 z-50"
      isBordered
      isMenuOpen={menuOpen} // controlled
      onMenuOpenChange={setMenuOpen} // updated state
    >
      <NavbarBrand>
        <NextLink href="/dashboard" className="flex items-center space-x-2">
          <LogoDark />
        </NextLink>
      </NavbarBrand>

      {/* Mobile toggle */}
      <NavbarContent className="md:hidden" justify="end">
        <NavbarMenuToggle className="text-white" aria-label={menuOpen ? 'Close menu' : 'Open menu'} icon={menuOpen ? <X /> : <Menu />} />
      </NavbarContent>

      {/* Desktop nav */}
      <NavbarContent className="hidden md:flex" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link as={NextLink} href={item.href} className={`flex items-center gap-2 text-sm font-medium ${pathname === item.href ? 'text-white underline' : 'text-white hover:text-gray-300'}`}>
              {item.icon}
              {item.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Desktop actions */}
      <NavbarContent justify="end" className="hidden md:flex gap-4">
        <CreditManager />
        <UserDropdown />
      </NavbarContent>

      {/* Mobile Menu content */}
      <NavbarMenu>
        {navItems.map((item) => (
          <NavbarItem key={item.href}>
            <NextLink href={item.href} passHref legacyBehavior>
              <Link className="flex items-center gap-3 py-2 px-4" onClick={() => setMenuOpen(false)}>
                {item.icon}
                {item.label}
              </Link>
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
