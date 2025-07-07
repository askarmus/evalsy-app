'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/start/Header';
import { Hero } from '@/components/start/Hero';
import { Pricing } from '@/components/start/Pricing';
import { Footer } from '@/components/start/Footer';
import { Testimonials } from '@/components/start/testimonials';
import RequestDemo from '@/components/start/RequestDemo';
import { OptimizationComparison } from '@/components/start/optimize-section';
import Feature from '@/components/start/Feature';
import FAQ from '@/components/start/FAQ';
import Companies from '../components/start/Company';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col text-black">
      <main className="flex-1">
        <Header />

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
