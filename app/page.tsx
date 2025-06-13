import React from 'react';
import { Header } from '@/app/start/Header';
import { Hero } from '@/app/start/Hero';
import { Pricing } from '@/app/start/Pricing';
import { Footer } from '@/app/start/Footer';
import { Testimonials } from '@/app/start/testimonials';
import RequestDemo from '@/app/start/RequestDemo';
import OptimizeSection from '@/app/start/optimize-section';
import Feature from '@/app/start/Feature';
import FAQ from '@/app/start/FAQ';

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
