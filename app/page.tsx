import React from "react";
import { Header } from "@/components/start/Header";
import { Hero } from "@/components/start/Hero";
import { Features } from "@/components/start/Features";
import { Pricing } from "@/components/start/Pricing";
import { Footer } from "@/components/start/Footer";
import { FAQ } from "@/components/start/FAQ";
import { OptimizeSection } from "@/components/start/optimize-section";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <OptimizeSection />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
