import React from 'react';
import { Header } from '@/app/start/Header';
import { Hero } from '@/app/start/Hero';
import { Pricing } from '@/app/start/Pricing';
import { Footer } from '@/app/start/Footer';
import { Testimonials } from '@/app/start/testimonials';
import RequestDemo from '@/app/start/RequestDemo';
import { OptimizationComparison } from '@/app/start/optimize-section';
import Feature from '@/app/start/Feature';
import FAQ from '@/app/start/FAQ';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f0fff4] text-black">
      <Header />
      <main className="flex-1">
        <Hero />
        <OptimizationComparison />
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
