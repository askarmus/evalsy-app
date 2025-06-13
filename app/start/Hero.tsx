'use client';

import { Chip, cn } from '@heroui/react';
import Image from 'next/image';
import TypewriterEffect from './TypewriterEffect';

export function Hero() {
  return (
    <section className={cn('relative pb-12 md:pb-24 bg-[#14101f] overflow-hidden min-h-[calc(100vh-20rem)] flex items-center', 'transition-opacity duration-1000 ease-out')}>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-[#1c1829] mt-4 md:mt-8 p-6 sm:p-10 md:p-28 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
          {/* Polygon Overlay */}
          <svg className="absolute top-0 left-0 w-4/5 h-auto text-white/5 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
            <polygon points="0,0 100,0 0,100" />
          </svg>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left transition-all duration-1000 ease-out delay-200 opacity-100 translate-x-0">
              <div className="inline-block px-4 py-1.5 bg-[#1e1e24] rounded-full text-sm font-medium text-gray-300 mb-6">Welcome</div>
              <h1 className="mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[2.5rem] sm:leading-[3rem] md:leading-[3.5rem]">Tired of one-on-one interviews?</h1>
              <div className="mb-6 md:mb-8 max-w-xl text-base sm:text-lg md:text-xl text-white/80 mx-auto lg:mx-0 leading-relaxed">
                <div>
                  Let AI Interviewer handle video screenings on autopilot - <TypewriterEffect />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a className="group inline-flex items-center justify-center rounded-full py-3 px-5 text-sm font-semibold bg-white text-black hover:bg-gray-200 transition" href="#get-started">
                  Let’s get started
                </a>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-video lg:aspect-[4/3] transition-all duration-1000 ease-out delay-300 opacity-100 translate-x-0">
              <Image
                src="/hero-home.png" // Use your actual image path here
                alt="Team collaborating on a project in a modern office"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
