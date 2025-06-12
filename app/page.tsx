import React from 'react';
import { Header } from '@/components/start/Header';
import { Hero } from '@/components/start/Hero';
import { Pricing } from '@/components/start/Pricing';
import { Footer } from '@/components/start/Footer';
import { FAQ } from '@/components/start/FAQ';
import { OptimizeSection } from '@/components/start/optimize-section';
import F2 from '@/components/start/feature';
import RequestDemo from '@/components/start/RequestDemo';
import { FaqHeroSection } from '@/components/start/faq1';

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-red  text-slate-700">
        <Hero />
        <F2 />

        <Pricing />
        <FAQ />
        {/* <FaqHeroSection /> */}
        <RequestDemo />
      </main>
      <Footer />
    </>
  );
}
