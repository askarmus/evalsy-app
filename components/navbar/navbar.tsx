'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button, cn } from '@heroui/react';
import { Menu, X } from 'lucide-react';
import { AiOutlineHome, AiOutlineShopping, AiOutlineNotification, AiOutlineSetting, AiOutlineMail } from 'react-icons/ai';

import { CreditManager } from '../settings/components/credits/credits/CreditManager';
import { Logo } from '../shared/logo';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <AiOutlineHome className="w-4 h-4 mr-3" /> },
  { href: '/interviews/list', label: 'AI Interview Manager', icon: <AiOutlineShopping className="w-4 h-4 mr-3" /> },
  { href: '/result', label: 'Candidate Reports', icon: <AiOutlineNotification className="w-4 h-4 mr-3" /> },
  { href: '/ai-shortlist', label: 'AI Shortlist', icon: <AiOutlineNotification className="w-4 h-4 mr-3" /> },
  { href: '/invitations', label: 'Interview Invites', icon: <AiOutlineMail className="w-4 h-4 mr-3" /> },
  { href: '/company/settings', label: 'Company Settings', icon: <AiOutlineSetting className="w-4 h-4 mr-3" /> },
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Mobile menu button */}
      <Button isIconOnly variant="ghost" className="fixed top-4 left-4 z-50 md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div className={cn('fixed left-0 top-0 z-40 h-full w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-[#3f3f46] transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0', isOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 dark:border-[#3f3f46]">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href); // highlight based on current route
                return (
                  <li key={item.label}>
                    <Button variant="bordered" color="secondary" onPress={() => router.push(item.href)} className={cn('w-full justify-start', isActive && 'bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300')}>
                      {item.icon}
                      {item.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Credits section */}
          <CreditManager />
        </div>
      </div>
    </>
  );
}
