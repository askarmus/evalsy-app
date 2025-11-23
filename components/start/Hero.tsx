'use client';

import { useState, useEffect } from 'react';

import { Play, TrendingUp, Users, DollarSign, Clock, CheckCircle, Star, CheckCircle2, ArrowRight } from 'lucide-react';
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
    <section className="relative w-full mt-8 sm:mt-12 md:mt-16 lg:mt-24 p-4 overflow-hidden">
      <div className="relative flex flex-col items-center justify-center  px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl mx-auto space-y-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-full border border-purple-200 shadow-sm">
            <span className="text-purple-600 text-xs sm:text-sm font-medium">Hire 90% Faster. Pay 70% Less</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold tracking-tight leading-[1.15]">
              <span className="block bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 bg-clip-text text-transparent pb-4">AI interview automation,</span>

              <span className="block bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent  pb-4">done right</span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">Evalsy automatically interviews candidates 24/7 and gives you AI-powered shortlists. Focus only on the best.</p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <VideoModal />
          </div>
        </div>
      </div>
    </section>
  );
}
