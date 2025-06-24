'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Play, ArrowRight, Sparkles, TrendingUp, Users, Zap, Bot, Video, MessageSquare, DollarSign } from 'lucide-react';
import { Button, Chip } from '@heroui/react';
import RequestDemoHero from './RequestDemoHero';

export function Hero() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = ['conversational & dynamic interview', 'AI cheat detection', 'AI cheat detection'];

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const current = phrases[currentIndex];

        if (isDeleting) {
          setCurrentText(current.substring(0, currentText.length - 1));
        } else {
          setCurrentText(current.substring(0, currentText.length + 1));
        }

        if (!isDeleting && currentText === current) {
          setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, phrases]);

  const stats = [
    { icon: <Users className="h-5 w-5" />, value: '10K+', label: 'Interviews completed' },
    { icon: <TrendingUp className="h-5 w-5" />, value: '254858', label: 'HR manhours saved' },
    { icon: <DollarSign className="h-5 w-5" />, value: '1M', label: 'Cost Saved' },
  ];

  return (
    <section
      className="relative w-full py-12 md:py-24 lg:py-32 xl:py-32   p-4 overflow-hidden "
      style={{
        background: 'linear-gradient(77.27deg, #fff5ed 0%, rgba(255, 245, 237, 0.5) 51.71%, rgba(255, 245, 237, 0) 100%)',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col space-y-8">
            {/* Badge */}

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight" style={{ fontFamily: 'Courier, monospace' }}>
                Tired of manuall
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#98FB98]/30" viewBox="0 0 200 12" fill="currentColor">
                  <path d="M0,8 Q50,0 100,8 T200,8 L200,12 L0,12 Z" />
                </svg>
                <span className=" relative">
                  interviews?
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#98FB98]/60" viewBox="0 0 200 12" fill="currentColor">
                    <path d="M0,8 Q50,0 100,8 T200,8 L200,12 L0,12 Z" />
                  </svg>
                </span>
              </h1>
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed">Let AI Interviewer handle video screenings on autopilot.</p>

              {/* Typewriter Effect */}
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-semibold text-gray-700">It&apos;s</span>
                <span className="text-xl md:text-2xl font-bold text-[#598b59] border-r-2 border-[#98FB98] pr-1 min-w-[120px]">{currentText}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="bordered" size="lg" className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-full text-lg font-semibold group">
                <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-200">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-[#98FB98] rounded-full border border-black">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-black">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - AI Interview Platform */}
          <div className="relative lg:pl-36">
            <RequestDemoHero />
          </div>
        </div>
      </div>
    </section>
  );
}
