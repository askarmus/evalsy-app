'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header, navItems } from '../navbar/navbar';
import { UserDropdown } from '../navbar/user-dropdown';
import { DarkModeSwitch } from '../navbar/darkmodeswitch';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const pathname = usePathname();

  // Find current item
  const currentItem = navItems.find((item) => pathname?.startsWith(item.href));

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-[#3f3f46] px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left section (hide on xs) */}
            <div className="hidden sm:flex items-center text-purple-600">
              {currentItem?.icon}
              <h1 className="text-lg font-medium">{currentItem?.label || 'Evalsy'}</h1>
            </div>

            {/* Right section (always visible, stays right-aligned) */}
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-3">
                <UserDropdown />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
