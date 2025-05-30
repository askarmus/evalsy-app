import React from 'react';
import { Header } from '@/components/start/Header';
import { Hero } from '@/components/start/Hero';
import { Pricing } from '@/components/start/Pricing';
import { Footer } from '@/components/start/Footer';
import { FAQ } from '@/components/start/FAQ';
import { OptimizeSection } from '@/components/start/optimize-section';
import F2 from '@/components/start/feature copy';
import RequestDemo from '@/components/start/RequestDemo';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <OptimizeSection />
        <F2 />
        <Pricing />
        <FAQ />
        <RequestDemo />
      </main>
      <Footer />
    </>
  );
}
