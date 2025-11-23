'use client';

import { useState } from 'react';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Drawer, DrawerContent } from '@heroui/react';
import { Menu, X } from 'lucide-react';
import { LogoDark } from '@/components/logo.dark';
import { useAuth } from '@/hooks/useAuth';
import NextLink from 'next/link'; // 👈 alias created

export function Headerx() {
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
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="relative flex h-16 items-center justify-between gap-4 rounded-full bg-[#331a77] px-4 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Logo + Tagline */}
          <div className="flex flex-1 items-center gap-2 text-white text-sm md:text-base">
            <NextLink href="/" className="flex items-center gap-2 hover:opacity-90 transition">
              <LogoDark />
            </NextLink>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex flex-1 items-center justify-end gap-5 whitespace-nowrap">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link as={NextLink} href={item.href} onPress={closeMenu} className="text-white   hover:text-[#7FE67F] transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}

            {/* ✅ Show demo buttons while loading OR unauthenticated */}
            {loading || !user ? (
              <>
                <Link className="inline-block rounded-lg px-2 py-1 text-md text-white" href="/login">
                  Sign in
                </Link>

                <Button as={NextLink} size="sm" href="#shedule-demo" radius="full" variant="solid" className=" font-semibold  bg-[#3534ff] text-white ">
                  Schedule a Demo
                </Button>

                <Button as={NextLink} size="sm" href="/signup" radius="full" variant="solid" className="font-semibold  bg-white text-black  ">
                  Sign Up
                </Button>
              </>
            ) : (
              // ✅ Authenticated → show dashboard button
              <Button as={NextLink} size="sm" href="/dashboard" radius="full" variant="bordered" className="border-2 border-black btn-gradient text-white  font-semibold">
                Go to Dashboard
              </Button>
            )}
          </ul>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <Button className="text-white hover:bg-[#7FE67F]" onPress={() => setIsOpen(true)} aria-label="Toggle menu" size="sm" variant="light">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown (Quick Drawer) */}
        {isOpen && (
          <div className="md:hidden mt-2 rounded-lg bg-[#0B0A33] p-4 shadow-lg">
            <ul className="flex flex-col gap-3">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link as={NextLink} href={item.href} onClick={() => setIsOpen(false)} className="block text-white font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}

              {!user ? (
                <>
                  <Link className="text-white font-medium" href="/login">
                    Sign in
                  </Link>
                  <Button as={NextLink} href="#shedule-demo" radius="full" variant="bordered" className="  font-semibold bg-[#3534ff] text-white px-4 py-2 h-[40px]">
                    Schedule a Demo
                  </Button>
                </>
              ) : (
                <Button as={NextLink} href="/dashboard" variant="bordered" radius="full" className="border-2 font-semibold border-black btn-gradient text-white px-4 py-2 h-[40px]">
                  Go to Dashboard
                </Button>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Slide-in Drawer for Mobile */}
      <Drawer isOpen={isOpen} onClose={closeMenu} placement="right">
        <DrawerContent className="w-[300px] bg-[#F0FFF4] border-l-2 border-black">
          <div className="flex flex-col h-full p-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b-2 border-black">
              <NextLink href="/" onClick={closeMenu} className="flex items-center space-x-2">
                <img src="/final-light.png" className="max-h-[40px] w-auto" alt="evalsy logo" />
              </NextLink>
              <Button onPress={closeMenu} isIconOnly variant="light">
                <X className="h-5 w-5 text-black" />
              </Button>
            </div>

            {/* Drawer Nav Links */}
            <nav className="flex flex-col gap-4 py-6 px-2 flex-1 text-black">
              {navigationItems.map((item) => (
                <Link key={item.href} as={NextLink} href={item.href} onPress={closeMenu} className="text-lg font-medium text-black hover:text-gray-700 transition-colors py-2 px-4 rounded">
                  {item.label}
                </Link>
              ))}

              {/* Auth Links inside nav */}
              {!loading && user ? (
                <Link href="/dashboard" onPress={closeMenu} className="mt-4 inline-flex items-center justify-center rounded-full py-3 px-5 text-sm font-semibold bg-white text-black hover:text-white hover:bg-green-500 active:bg-green-800 focus-visible:outline-green-600">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onPress={closeMenu} className="text-lg font-medium text-black hover:text-gray-700 transition-colors py-2 px-4 rounded">
                    Sign In
                  </Link>
                  <Link href="/signup" onPress={closeMenu} className="text-lg font-medium text-black hover:text-gray-700 transition-colors py-2 px-4 rounded">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </header>
  );
}
