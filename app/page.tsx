import React from 'react';
import { Header } from '@/components/start/Header';
import { Hero } from '@/components/start/Hero';
import { Pricing } from '@/components/start/Pricing';
import { Footer } from '@/components/start/Footer';
import { Testimonials } from '@/components/start/testimonials';
import RequestDemo from '@/components/start/RequestDemo';
import Feature from '@/components/start/feature';
import OptimizeSection from '@/components/start/optimize-section';
import FAQ from '@/components/start/faq';

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-red  text-slate-700">
        <Hero />
        <OptimizeSection />
        <Feature />
        <Pricing />
        <Testimonials />
        <FAQ />
        <RequestDemo />
      </main>
      <Footer />
    </>
  );
}
