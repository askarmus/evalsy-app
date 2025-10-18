'use client';

import { useState, useEffect } from 'react';

import { Play, TrendingUp, Users, DollarSign, Clock, CheckCircle, Star } from 'lucide-react';
import { Button, Chip } from '@heroui/react';
import RequestDemoHero from './RequestDemoHero';
import VideoModal from '@/app/interview/start/[id]/components/how-it-work-video';

export function Hero() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = ['Conversational & dynamic interview', 'AI cheat detection', 'Unbiased candidate scoring'];

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
    { icon: <CheckCircle className="h-5 w-5 text-[#3534ff]" />, value: 'Shortlist Instantly', label: 'AI screens candidates for you' },
    { icon: <Clock className="h-5 w-5 text-[#3534ff]" />, value: '24/7 Interviews', label: 'Candidates interview anytime' },
    { icon: <Star className="h-5 w-5 text-[#3534ff]" />, value: 'Smart Scoring', label: 'Review only top-ranked profiles' },
  ];

  return (
    <section className="relative w-full mt-16 sm:mt-24 md:mt-32 lg:mt-48 p-4 overflow-hidden">
      {/* Background Elements */}

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Content - 60% width on large screens */}
          <div className="w-full   flex flex-col space-y-8">
            {/* Badge */}

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight font-semibold">
                <span
                  className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% 200%',
                    backgroundPosition: '46.04% 50%',
                    willChange: 'auto',
                  }}
                >
                  AI-Powered Hiring.
                </span>
              </h1>

              <h1 className="text-4xl lg:text-4xl font-black leading-tight font-semibold" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                <span
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-5"
                  style={{
                    backgroundSize: '200% 200%',
                    backgroundPosition: '73.96% 50%',
                    willChange: 'auto',
                  }}
                >
                  90% Faster. 70% Cheaper.
                </span>
              </h1>
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-900 max-w-2xl leading-relaxed">Evalsy automatically interviews candidates 24/7 and gives you AI-powered shortlists. Focus only on the best.</p>

              {/* Typewriter Effect */}
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-semibold text-gray-700">It&apos;s</span>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent pr-1 min-w-[120px]">{currentText}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <VideoModal />
            </div>
          </div>
          <div>
            <div className="flex-center w-full">
              <img alt="image" decoding="async" data-nimg="1" src="/images/software-interview.png"></img>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
