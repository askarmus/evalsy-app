'use client';

import React, { useEffect } from 'react';
import { Hero } from '@/components/start/Hero';
import { Pricing } from '@/components/start/Pricing';
import { Footer } from '@/components/start/Footer';
import { Testimonials } from '@/components/start/testimonials';
import RequestDemo from '@/components/start/RequestDemo';
import { OptimizationComparison } from '@/components/start/optimize-section';
import Feature from '@/components/start/Feature';
import FAQ from '@/components/start/FAQ';
import Companies from '../components/start/Company';
import HomeLayout from './home-layout';
import CookieBanner from '@/components/start/CookieBanner';
import HeroHome from '@/components/start/hero-home';
import { Headerx } from '@/components/start/Header';

export default function Home() {
  return (
    <HomeLayout>
      <div className="flex min-h-screen flex-col text-black">
        <main className="flex-1">
          <Headerx />

          <div className="bg-[url('/02.svg')] bg-cover bg-center">
            <HeroHome />

            <OptimizationComparison />
          </div>
          <Feature />
          <Pricing />
          <Testimonials />
          <FAQ />
          <RequestDemo />
          <CookieBanner />
        </main>
        <Footer />
      </div>
    </HomeLayout>
  );
}
