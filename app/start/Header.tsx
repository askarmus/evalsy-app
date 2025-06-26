'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Drawer, DrawerContent } from '@heroui/react';
import { Menu, X } from 'lucide-react';
import { LogoDark } from '@/components/logo.dark';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  const navigationItems = [
    { href: '#how-it-work', label: 'How It Works' },
    { href: '#cost-analysis', label: 'Cost Analysis' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-[#0B0A33]  ">
      <Navbar maxWidth="xl" className="bg-transparent px-4 md:px-6" height="3.5rem">
        {/* Brand / Logo */}
        <NavbarBrand>
          <NextLink href="/" className="flex items-center space-x-2">
            <LogoDark />
          </NextLink>
        </NavbarBrand>

        {/* Desktop Links */}
        <NavbarContent className="hidden md:flex  " justify="center">
          {navigationItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link as={NextLink} href={item.href} className="text-sm font-medium text-white hover:text-gray-200 transition-colors hover:underline underline-offset-4">
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Desktop CTA / Auth Section */}
        <NavbarContent justify="end" className="hidden md:flex items-center gap-4">
          {!loading && user ? (
            <Button as={NextLink} href="/dashboard" variant="bordered" className="border-2 border-black bg-[#3534ff] text-white hover:bg-gray-100">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Link className="inline-block rounded-lg px-2 py-1 text-md text-white" href="/login">
                Sign in
              </Link>
              <Button as={NextLink} href="#shedule-demo" variant="bordered" className="border-2 border-black  bg-[#3534ff]  text-white hover:bg-gray-100">
                Shedule a Demo
              </Button>
            </>
          )}
        </NavbarContent>

        {/* Mobile Menu Button */}
        <Button className="md:hidden text-white hover:bg-[#7FE67F]" onPress={() => setIsOpen(true)} aria-label="Toggle menu" size="sm" variant="light">
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
                <img src="/final-light.png" className="max-h-[40px] w-auto   dark:block" alt="evalsy logo" />
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

            {/* CTA / Auth Section */}
            <div className="pt-6 border-t-2 border-black flex flex-col gap-4">
              {!loading && user ? (
                <Link href="/dashboard" onClick={closeMenu} className="inline-flex items-center justify-center rounded-full py-3 px-5 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-white text-black hover:text-white hover:bg-green-500 active:bg-green-800 active:text-green-100 focus-visible:outline-green-600">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenu} className="text-md text-black underline text-center">
                    Sign in
                  </Link>
                  <a className="group inline-flex items-center justify-center rounded-full py-3 px-5 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href="#shedule-demo" onClick={closeMenu}>
                    Let&apos;s talk
                  </a>
                </>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
