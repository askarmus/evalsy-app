import type React from 'react';
import Image from 'next/image';
import { Button } from '@heroui/react';

export const Hero: React.FC = () => {
  return (
    <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-36 text-center lg:pt-32 overflow-hidden bg-slate-900">
      {/* Enhanced glowing elements for dark background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Digital grid pattern overlay */}
      <div className="absolute inset-0 -z-10 opacity-[0.07]">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Digital grid pattern" fill className="object-cover" priority />
      </div>

      {/* Animated particles effect (decorative) */}
      <div className="absolute inset-0 -z-5">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* AI badge */}

        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight leading-[1.5] text-white sm:text-7xl text-center">
          AI-Powered Intelligent
          <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 px-2">
            <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-2/3 left-0 h-[0.58em] w-full fill-purple-500/30" preserveAspectRatio="none">
              <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
            </svg>
            <span className="relative text-white"> Interviewer</span>
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-300">From resume-to-role matching to dynamic interview creation, Evalsy helps you zero in on top talent instantly—boosting efficiency and reducing hiring friction.</p>

        {/* AI metrics with glowing effect */}
        <div className="mt-16 grid grid-cols-1 gap-y-8 sm:grid-cols-4  ms:grid-cols-2 sm:gap-x-12">
          <div className="flex flex-col items-center p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
            <span className="text-1xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">75% Faster Hiring</span>
            <span className="mt-2 text-sm text-slate-400">Streamline. Accelerate. Win.</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
            <span className="text-1xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">80% Cost Savings</span>
            <span className="mt-2 text-sm text-slate-400">Automate. Cut. Save.</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
            <span className="text-1xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">100 Candidates Sorted</span>
            <span className="mt-2 text-sm text-slate-400">Instant. Smart. Precise.</span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
            <span className="text-1xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">99% Match Accuracy</span>
            <span className="mt-2 text-sm text-slate-400">Analyze. Learn. Hire.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
