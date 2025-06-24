'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Drawer, DrawerContent } from '@heroui/react';
import { Menu, X } from 'lucide-react';
import { LogoDark } from '@/components/logo.dark';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: '#how-it-work', label: 'How It Works' },
    { href: '#cost-analysis', label: 'Cost Analysis' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-[#98FB98] backdrop-blur supports-[backdrop-filter]:bg-[#98FB98]/95">
      <Navbar maxWidth="2xl" className="bg-transparent px-4 md:px-6" height="4rem">
        {/* Brand / Logo */}
        <NavbarBrand>
          <NextLink href="/" className="flex items-center space-x-2">
            <LogoDark />
          </NextLink>
        </NavbarBrand>

        {/* Desktop Links */}
        <NavbarContent className="hidden md:flex gap-6 lg:gap-8" justify="center">
          {navigationItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link as={NextLink} href={item.href} className="text-sm font-medium text-black hover:text-gray-700 transition-colors hover:underline underline-offset-4">
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Desktop CTA */}
        <NavbarContent justify="end" className="hidden md:flex">
          <Button as={NextLink} href="#shedule-demo" variant="bordered" className="border-2 border-black bg-white text-black hover:bg-gray-100">
            Shedule a Demo
          </Button>
        </NavbarContent>

        {/* Mobile Menu Button */}
        <Button className="md:hidden text-black hover:bg-[#7FE67F]" onPress={() => setIsOpen(true)} aria-label="Toggle menu" size="sm" variant="light">
          <Menu className="h-6 w-6" />
        </Button>
      </Navbar>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} onClose={closeMenu} placement="right">
        <DrawerContent className="w-[300px] bg-[#F0FFF4] border-l-2 border-black">
          <div className="flex flex-col h-full p-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-black">
              <NextLink href="/" onClick={closeMenu} className="flex items-center space-x-2">
                <LogoDark />
              </NextLink>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-4 py-6 flex-1">
              {navigationItems.map((item) => (
                <Link key={item.href} as={NextLink} href={item.href} onClick={closeMenu} className="text-lg font-medium text-black hover:text-gray-700 transition-colors py-2 px-4 rounded hover:bg-[#98FB98] border-2 border-transparent hover:border-black">
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="pt-6 border-t-2 border-black">
              <Button as={NextLink} href="#shedule-demo" className="w-full bg-[#98FB98] text-black border-2 border-black hover:bg-[#7FE67F]" onClick={closeMenu}>
                Shedule a Demo
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
