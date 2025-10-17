'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link, Drawer, DrawerContent, Spinner } from '@heroui/react';
import { Menu, X } from 'lucide-react';
import { LogoDark } from '@/components/logo.dark';
import { useAuth } from '@/hooks/useAuth';

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
    <header className="fixed top-2 z-30 w-full md:top-6 ">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="relative flex h-16 items-center justify-between gap-3 rounded-full bg-[#0B0A33] px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <LogoDark />
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex flex-1 items-center justify-end gap-3">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link as={NextLink} href={item.href} onClick={closeMenu} className="text-white font-medium">
                  {item.label}
                </Link>
              </li>
            ))}

            {loading ? (
              <Link className="inline-block rounded-lg px-2 py-1 text-md text-white" href="/login">
                Sign in
              </Link>
            ) : user ? (
              <Button as={NextLink} href="/dashboard" variant="bordered" radius="full" className="border-2 font-bold border-black btn-gradient text-white">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link className="inline-block rounded-lg px-2 py-1 text-md text-white" href="/login">
                  Sign in
                </Link>
                <Button as={NextLink} href="#shedule-demo" radius="full" variant="bordered" className="border-2 font-bold border-black bg-[#3534ff] text-white">
                  Schedule a Demo
                </Button>
              </>
            )}
          </ul>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <Button className="text-white hover:bg-[#7FE67F]" onPress={() => setIsOpen(true)} aria-label="Toggle menu" size="sm" variant="light">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Drawer (optional) */}
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
                  <Button as={NextLink} href="#shedule-demo" radius="full" variant="bordered" className="border-2 font-bold border-black bg-[#3534ff] text-white">
                    Schedule a Demo
                  </Button>
                </>
              ) : (
                <Button as={NextLink} href="/dashboard" variant="bordered" radius="full" className="border-2 font-bold border-black btn-gradient text-white">
                  Go to Dashboard
                </Button>
              )}
            </ul>
          </div>
        )}
      </div>

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
                <Link key={item.href} as={NextLink} href={item.href} onPress={closeMenu} className="text-lg font-medium text-black hover:text-gray-700 transition-colors py-2 px-4 rounded  ">
                  {item.label}
                </Link>
              ))}
            </nav>

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
