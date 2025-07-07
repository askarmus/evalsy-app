'use client';

import React, { useEffect } from 'react';
import { Header } from '@/app/home/start/Header';
import { Hero } from '@/app/home/start/Hero';
import { Pricing } from '@/app/home/start/Pricing';
import { Footer } from '@/app/home/start/Footer';
import { Testimonials } from '@/app/home/start/testimonials';
import RequestDemo from '@/app/home/start/RequestDemo';
import { OptimizationComparison } from '@/app/home/start/optimize-section';
import Feature from '@/app/home/start/Feature';
import FAQ from '@/app/home/start/FAQ';
import Companies from './start/Company';
import TidioChat from './start/TidioChat';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col text-black">
      <main className="flex-1">
        <Header />
        <TidioChat />

        <div className="bg-[url('/02.svg')] bg-cover bg-center">
          <Hero />
          <Companies />
          <OptimizationComparison />
        </div>
        <Feature />
        <Pricing />
        <Testimonials />
        <FAQ />
        <RequestDemo />
      </main>
      <Footer />
    </div>
  );
}
