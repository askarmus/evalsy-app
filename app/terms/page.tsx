// app/terms/page.tsx

'use client';

import HomeLayout from '../home-layout';
import { Header } from '@/components/start/Header';
import { Footer } from '@/components/start/Footer';
import CookieBanner from '@/components/start/CookieBanner';
import { useEffect, useState } from 'react';

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
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">Terms and Conditions</h1>
              <p className="text-sm text-gray-500 mb-8">Effective Date: 7/28/2025 | Last Updated: 7/28/2025</p>

              {sections.map((section, i) => (
                <section key={section} id={createId(section)}>
                  <h2 className="text-xl font-semibold mb-3">
                    {i + 1}. {section}
                  </h2>

                  {section === 'Definitions' && (
                    <p>
                      - <strong>“Platform”</strong>: Evalsy’s website and AI-powered interview services. <br />- <strong>“User”</strong>: Any individual or entity using the Platform, including candidates and employers. <br />- <strong>“Employer”</strong>: Organizations using Evalsy to evaluate candidates. <br />- <strong>“Candidate”</strong>: Individuals participating in interviews via Evalsy.
                    </p>
                  )}

                  {section === 'Eligibility' && <p>You must be at least 18 years old to use Evalsy. Employers are responsible for ensuring legal compliance with employment, data protection, and labor laws.</p>}

                  {section === 'Services Provided' && (
                    <ul className="list-disc list-inside space-y-2">
                      <li>AI-powered video screening and interviewing tools.</li>
                      <li>Candidate scoring and analytics.</li>
                      <li>Employer dashboards for reviewing interviews.</li>
                      <li>Fraud detection and anti-cheating measures.</li>
                    </ul>
                  )}

                  {section === 'User Responsibilities' && (
                    <ul className="list-disc list-inside space-y-2">
                      <li>Employers must ensure lawful use of Evalsy in compliance with applicable laws.</li>
                      <li>Candidates must provide truthful and accurate information.</li>
                      <li>Users must not use Evalsy for unlawful, fraudulent, or harmful activities.</li>
                    </ul>
                  )}

                  {section === 'Accounts and Security' && (
                    <ul className="list-disc list-inside space-y-2">
                      <li>You are responsible for keeping your account credentials confidential.</li>
                      <li>Notify us immediately of unauthorized access or breaches.</li>
                      <li>We may suspend or terminate accounts that violate these Terms.</li>
                    </ul>
                  )}

                  {section === 'Intellectual Property' && <p>All content, features, and technology on Evalsy are owned by us or our licensors. Users may not copy, modify, distribute, or reverse-engineer any part of the Platform without prior written consent.</p>}

                  {section === 'Data Protection & Privacy' && (
                    <p>
                      Evalsy processes personal data in accordance with our{' '}
                      <a href="/privacy-policy" className="text-blue-600 underline">
                        Privacy Policy
                      </a>
                      . Employers act as data controllers for candidate data, while Evalsy acts as a data processor where applicable.
                    </p>
                  )}

                  {section === 'Payment Terms' && <p>Fees for paid services will be communicated clearly. Payments must be made using approved methods. Evalsy may suspend access for overdue payments.</p>}

                  {section === 'Limitation of Liability' && <p>Evalsy provides services “as is” without warranties. We are not liable for damages arising from hiring decisions, inaccuracies in candidate data, or service interruptions. Our liability is limited to the fees paid in the last 6 months.</p>}

                  {section === 'Termination' && <p>We may suspend or terminate your account for breaches of these Terms. Upon termination, you must cease using Evalsy. Data may be deleted, subject to legal retention requirements.</p>}

                  {section === 'Governing Law' && (
                    <p>
                      These Terms are governed by the laws of <strong>Sri Lanka</strong> (or insert relevant jurisdiction) without regard to conflict of law principles.
                    </p>
                  )}

                  {section === 'Changes to Terms' && <p>We may update these Terms periodically. Updates will be posted on this page with a revised “Last Updated” date. Continued use of Evalsy indicates acceptance of the changes.</p>}

                  {section === 'Contact Us' && (
                    <p>
                      📧 Email: <strong>privacy@evalsy.com</strong>
                      <br />
                      🌐 Website:{' '}
                      <a href="https://www.evalsy.com" className="text-blue-600 underline">
                        www.evalsy.com
                      </a>
                    </p>
                  )}
                </section>
              ))}
            </div>

            {/* Sticky TOC Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 bg-gray-50 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">On This Page</h3>
                <ul className="space-y-2 text-sm">
                  {sections.map((section) => (
                    <li key={section}>
                      <a href={`#${createId(section)}`} className={`block hover:text-blue-600 transition ${activeSection === section ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                        {section}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
          <CookieBanner />
        </main>
        <Footer />
      </div>
    </HomeLayout>
  );
}
