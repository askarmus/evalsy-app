// app/terms/page.tsx

'use client';

import HomeLayout from '../home-layout';
import { Footer } from '@/components/start/Footer';
import CookieBanner from '@/components/start/CookieBanner';
import { useEffect, useState } from 'react';
import ResumeDropzone from './components/ResumeDropzone';
import ResumeList from './components/ResumeList';
import { Header } from '@/components/navbar/navbar';

export default function TermsPage() {
  const sections = ['Definitions', 'Eligibility', 'Services Provided', 'User Responsibilities', 'Accounts and Security', 'Intellectual Property', 'Data Protection & Privacy', 'Payment Terms', 'Limitation of Liability', 'Termination', 'Governing Law', 'Changes to Terms', 'Contact Us'];

  const createId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      sections.forEach((section) => {
        const element = document.getElementById(createId(section));
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            current = section;
          }
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <HomeLayout>
      <div className="flex min-h-screen flex-col text-black">
        <main className="flex-1">
          <Header />
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
            <ResumeDropzone />
            <ResumeList />
          </div>
          <CookieBanner />
        </main>
        <Footer />
      </div>
    </HomeLayout>
  );
}
