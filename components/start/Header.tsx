"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { Logo } from "@/components/logo";

export const Header: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <header className='py-10'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <nav className='relative z-50 flex justify-between'>
          <div className='flex items-center md:gap-x-12'>
            <a aria-label='Home' href='#'>
              <Logo />
            </a>
            <div className='hidden md:flex md:gap-x-6'>
              <a className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900' href='#features'>
                Features
              </a>
              <a className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900' href='#testimonials'>
                Testimonials
              </a>
              <a className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900' href='#pricing'>
                Pricing
              </a>
            </div>
          </div>
          <div className='flex items-center gap-x-5 md:gap-x-8'>
            <div className='hidden md:block'>
              <a className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900' href='/login'>
                Sign in
              </a>
            </div>
            <a className='group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600' href='/register'>
              <span>
                Get started <span className='hidden lg:inline'>today</span>
              </span>
            </a>
            <div className='-mr-1 md:hidden'>
              <button onClick={onOpen} className='relative z-10 flex h-8 w-8 items-center justify-center focus:outline-hidden' type='button'>
                <svg aria-hidden='true' className='h-3.5 w-3.5 overflow-visible stroke-slate-700' fill='none' strokeWidth='2' strokeLinecap='round'>
                  <path d='M0 1H14M0 7H14M0 13H14' className={`origin-center transition ${isOpen ? "scale-90 opacity-0" : ""}`} />
                  <path d='M2 2L12 12M12 2L2 12' className={`origin-center transition ${isOpen ? "" : "scale-90 opacity-0"}`} />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div className='md:hidden'>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top' size='sm'>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex justify-between items-center'></ModalHeader>
                <ModalBody>
                  <nav className='flex flex-col gap-y-4'>
                    <a className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900' href='#features' onClick={onClose}>
                      Features
                    </a>
                    <a className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900' href='#testimonials' onClick={onClose}>
                      Testimonials
                    </a>
                    <a className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900' href='#pricing' onClick={onClose}>
                      Pricing
                    </a>
                    <a className='inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900' href='/login' onClick={onClose}>
                      Sign in
                    </a>
                    <a className='group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100' href='/register' onClick={onClose}>
                      Get started
                    </a>
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
