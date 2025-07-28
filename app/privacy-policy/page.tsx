// app/privacy-policy/page.tsx

'use client';

import HomeLayout from '../home-layout';
import { Header } from '@/components/start/Header';
import { Footer } from '@/components/start/Footer';
import CookieBanner from '@/components/start/CookieBanner';
import { useEffect, useState } from 'react';

export default function PrivacyPolicyPage() {
  const sections = ['Who We Are', 'Data We Collect', 'How We Use Your Data', 'Legal Basis for Processing', 'Sharing Your Data', 'Data Retention', 'Your GDPR Rights', 'International Data Transfers', 'Security Measures', 'Cookies & Tracking', 'Breach Notification', 'Contact Us'];

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
              <h1 className="text-3xl font-bold mb-4 text-gray-900">Privacy Policy</h1>
              <p className="text-sm text-gray-500 mb-8">Effective Date: 7/28/2025 | Last Updated: 7/28/2025</p>

              {sections.map((section, i) => (
                <section key={section} id={createId(section)}>
                  <h2 className="text-xl font-semibold mb-3">
                    {i + 1}. {section}
                  </h2>
                  {section === 'Who We Are' && (
                    <p>
                      Evalsy (“we,” “our,” or “us”) is an AI-powered video screening and interview platform that helps employers assess and shortlist candidates efficiently.
                      <br />
                      <br />- <strong>Data Controller:</strong> For candidate data collected directly through our platform.
                      <br />- <strong>Data Processor:</strong> When processing data on behalf of employers who use Evalsy.
                      <br />
                      <br />
                      Contact us: <strong>privacy@evalsy.com</strong>
                    </p>
                  )}
                  {section === 'Data We Collect' && (
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        <strong>Candidate Information:</strong> Name, email, phone, resume/CV, employment history, video/audio recordings, interview responses, IP address, device details.
                      </li>
                      <li>
                        <strong>Employer Information:</strong> Company details, account credentials, contact info, billing and payment details.
                      </li>
                      <li>
                        <strong>Website & Usage Data:</strong> Cookies, analytics, browser type, session data, IP address.
                      </li>
                    </ul>
                  )}
                  {section === 'How We Use Your Data' && (
                    <ul className="list-disc list-inside space-y-2">
                      <li>Provide and improve the Evalsy platform.</li>
                      <li>Facilitate video interviews and assessments.</li>
                      <li>Enable employers to evaluate candidate suitability.</li>
                      <li>Ensure security and prevent fraudulent activity.</li>
                      <li>Provide customer support and service updates.</li>
                      <li>Conduct analytics and reporting (with your consent).</li>
                    </ul>
                  )}
                  {section === 'Legal Basis for Processing' && (
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        <strong>Consent:</strong> For cookies, analytics, and video recordings.
                      </li>
                      <li>
                        <strong>Contractual Necessity:</strong> To provide services to employers and candidates.
                      </li>
                      <li>
                        <strong>Legitimate Interests:</strong> Improving our platform and ensuring system security.
                      </li>
                      <li>
                        <strong>Legal Obligation:</strong> Where required by law.
                      </li>
                    </ul>
                  )}
                  {section === 'Sharing Your Data' && (
                    <p>
                      We may share your data only with:
                      <br />
                      - Employers who invited you to interviews. <br />
                      - Third-party service providers (e.g., hosting, analytics, payment gateways) under strict Data Processing Agreements. <br />
                      - Legal authorities where required by law.
                      <br />
                      <br />
                      <strong>We do not sell or trade your personal data.</strong>
                    </p>
                  )}
                  {section === 'Data Retention' && (
                    <p>
                      Candidate interview recordings are stored for <strong>90 days</strong> unless otherwise agreed with the employer. Employer account data is retained while the account remains active or as required by law. Data may be deleted earlier upon request.
                    </p>
                  )}
                  {section === 'Your GDPR Rights' && (
                    <>
                      <p>You have the right to:</p>
                      <ul className="list-disc list-inside mt-2 space-y-2">
                        <li>Access a copy of your personal data.</li>
                        <li>Request correction of inaccurate information.</li>
                        <li>Request deletion (“Right to be Forgotten”).</li>
                        <li>Restrict processing or object to specific processing activities.</li>
                        <li>Request data portability in a structured, machine-readable format.</li>
                      </ul>
                      <p className="mt-2">
                        To exercise your rights, contact: <strong>privacy@evalsy.com</strong>. We will respond within 30 days.
                      </p>
                    </>
                  )}
                  {section === 'International Data Transfers' && <p>If your data is transferred outside the European Economic Area (EEA), we implement safeguards such as EU Standard Contractual Clauses (SCCs) or ensure the recipient country has an adequacy decision from the European Commission.</p>}
                  {section === 'Security Measures' && (
                    <ul className="list-disc list-inside space-y-2">
                      <li>End-to-end encryption for interview recordings.</li>
                      <li>TLS/HTTPS for all web communications.</li>
                      <li>Strict access control and audit logging.</li>
                      <li>Regular system monitoring and vulnerability scans.</li>
                    </ul>
                  )}
                  {section === 'Cookies & Tracking' && (
                    <p>
                      Evalsy uses cookies to improve your experience and analyze traffic. <br />- <strong>Essential Cookies:</strong> Required for platform functionality. <br />- <strong>Analytics Cookies:</strong> Only used with your consent. <br />- <strong>Marketing Cookies:</strong> Not used unless you explicitly agree. <br />
                      <br />
                      You can manage preferences at any time via our Cookie Banner.
                    </p>
                  )}
                  {section === 'Breach Notification' && (
                    <p>
                      In the event of a personal data breach, Evalsy will notify the relevant Data Protection Authority within <strong>72 hours</strong> and inform affected individuals without undue delay.
                    </p>
                  )}
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
