'use client';

import { Chip, cn } from '@heroui/react';
import Image from 'next/image';

export function Hero() {
  return (
    <section className={cn('relative pb-12 md:pb-24 bg-darkbase overflow-hidden min-h-[calc(100vh-20rem)] flex items-center', 'transition-opacity duration-1000 ease-out')}>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-darkbase-sec mt-4 md:mt-8 p-6 sm:p-10 md:p-28 rounded-3xl shadow-2xl border-[hsla(0,0%,100%,.05)] relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className={cn('text-center lg:text-left transition-all duration-1000 ease-out delay-200', true ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10')}>
              <Chip className="mb-4 md:mb-6 py-1 px-2 md:py-1.5 md:px-3 text-xs font-medium border-primary/30 bg-primary/10 text-white mx-auto lg:mx-0">Welcome</Chip>
              <h1 className="mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-snug sm:leading-tight">Next-Generation AI Interviewer</h1>
              <p className="mb-6 md:mb-8 max-w-xl text-base sm:text-lg md:text-xl text-white/80 mx-auto lg:mx-0 leading-relaxed">Transform your hiring process with AI-driven candidate evaluation, automated screening, and intelligent matching that finds the perfect talent in minutes, not months.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a className="group inline-flex items-center justify-center rounded-full py-3 px-5 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600" href="#shedule-demo">
                  Book a demo
                </a>
                <a className=" inline-flex items-center justify-center rounded-full bg-white py-2 px-6 font-medium   hover:text-white   hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700" href="#features">
                  Learn more
                </a>
              </div>
            </div>
            <div className={cn('relative aspect-video lg:aspect-[4/3] transition-all duration-1000 ease-out delay-300', true ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10')}>
              <Image src="/hero-home.png" alt="Team collaborating on a project in a modern office" layout="fill" objectFit="cover" className="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
