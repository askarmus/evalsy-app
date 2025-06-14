'use client';

import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@heroui/react';
import { LogoDark } from '@/components/logo.dark';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user, loading } = useAuth();

  return (
    <header className="py-4  " style={{ backgroundColor: '#130f1e' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <a aria-label="Home" href="#">
              <LogoDark />
            </a>
            <div className="hidden md:flex md:gap-x-6">
              <a className="inline-block rounded-lg px-2 py-1 text-md text-slate-700 text-white" href="#features">
                Features
              </a>
              <a className="inline-block rounded-lg px-2 py-1 text-md text-slate-700 text-white" href="#testimonials">
                Testimonials
              </a>
              <a className="inline-block rounded-lg px-2 py-1 text-md text-white" href="#pricing">
                Pricing
              </a>
              <a className="inline-block rounded-lg px-2 py-1 text-md text-white" href="#faq">
                FAQ
              </a>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            {!loading && user ? (
              <Link className="inline-flex items-center justify-center rounded-full py-3 px-5 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-white text-black hover:text-white hover:bg-green-500 active:bg-green-800 active:text-green-100 focus-visible:outline-green-600" href="/dashboard">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <div className="hidden md:block">
                  <Link className="inline-block rounded-lg px-2 py-1 text-md text-white" href="/login">
                    Sign in
                  </Link>
                </div>

                <a className="group inline-flex items-center justify-center rounded-full py-3 px-5 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href="#shedule-demo">
                  Let&apos;s talk
                </a>
                {/* <Link className="group inline-flex items-center justify-center rounded-full py-3 px-5 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href="/signup">
                  <span>
                    Get started <span className="hidden lg:inline">today</span>
                  </span>
                </Link> */}
              </>
            )}

            <div className="-mr-1 md:hidden">
              <button onClick={onOpen} className="relative z-10 flex h-8 w-8 items-center justify-center focus:outline-hidden" type="button">
                <svg aria-hidden="true" className="h-3.5 w-3.5 overflow-visible stroke-slate-700" fill="none" strokeWidth="2" strokeLinecap="round">
                  <path d="M0 1H14M0 7H14M0 13H14" className={`origin-center transition ${isOpen ? 'scale-90 opacity-0' : ''}`} />
                  <path d="M2 2L12 12M12 2L2 12" className={`origin-center transition ${isOpen ? '' : 'scale-90 opacity-0'}`} />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div className="md:hidden">
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top" size="sm">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex justify-between items-center"></ModalHeader>
                <ModalBody>
                  <nav className="flex flex-col gap-y-4">
                    <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" href="#features" onClick={onClose}>
                      Features
                    </a>
                    <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" href="#testimonials" onClick={onClose}>
                      Testimonials
                    </a>
                    <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" href="#pricing" onClick={onClose}>
                      Pricing
                    </a>
                    <a className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white" href="/login" onClick={onClose}>
                      Sign in
                    </a>
                    {/* <a className='group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-700' href='/signup' onClick={onClose}>
                      Get started
                    </a> */}
                  </nav>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </header>
  );
};
