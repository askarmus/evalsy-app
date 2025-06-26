import Link from 'next/link';
import { Brain, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Logo } from '../../components/shared/logo';
import { LogoDark } from '../../components/logo.dark';
import PoweredBy from '../interview/start/[id]/components/PoweredBy';
import { LogoDarkWhite } from '@/components/logo.dark.white';

export function Footer() {
  const companyLinks = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Demo', href: '/#shedule-demo' }, // Assuming you have a demo section with this ID
    { name: 'FAQ', href: '/#faq' },
  ];

  const socialLinks = [
    { Icon: Instagram, href: '#', label: 'Instagram' },
    { Icon: Facebook, href: '#', label: 'Facebook' },
    { Icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <footer className="w-full py-12 bg-[#3534ff]  ">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <LogoDarkWhite />
            </Link>
            <p className="text-white text-sm leading-relaxed">Evalsy - AI-Powered Intelligent Interview Automation.</p>
          </div>

          {/* Sydney Office */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Sri Lanka</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-1  rounded-full border border-white">
                  <Mail className="h-3 w-3 text-white" />
                </div>
                <Link href="mailto:team@evalsy.com" className="text-white hover:text-white text-sm">
                  team@evalsy.com
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-1   rounded-full border border-white">
                  <Phone className="h-3 w-3 text-white" />
                </div>
                <Link href="tel:+61234567890" className="text-white hover:text-white text-sm">
                  +94 7790 5939 4
                </Link>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1  rounded-full border border-white mt-0.5">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                <div className="text-white text-sm">
                  <p>Level 15, 1 Martin Place,</p>
                  <p>Sydney NSW 2000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Melbourne Office */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Singapore</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-1  rounded-full border border-white">
                  <Mail className="h-3 w-3 text-white" />
                </div>
                <Link href="mailto:team@evalsy.com" className="text-white hover:text-white text-sm">
                  team@evalsy.com
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-1  rounded-full border border-white">
                  <Phone className="h-3 w-3 text-white" />
                </div>
                <Link href="tel:+61387654321" className="text-white hover:text-white text-sm">
                  +61 3 8765 4321
                </Link>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1  rounded-full border border-white mt-0.5">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                <div className="text-white text-sm">
                  <p>Suite 200, 120 Collins Street,</p>
                  <p>Melbourne VIC 3000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link className="text-white hover:text-white text-sm transition-colors hover:underline" href="#how-it-work">
                  How It Works
                </Link>
              </li>
              <li>
                <Link className="text-white hover:text-white text-sm transition-colors hover:underline" href="#cost-analysis">
                  Cost Analysis
                </Link>
              </li>
              <li>
                <Link className="text-white hover:text-white text-sm transition-colors hover:underline" href="#pricing">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="text-white hover:text-white text-sm transition-colors hover:underline" href="#faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="text-white hover:text-white text-sm transition-colors hover:underline" href="#testimonials">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Follow us on social media</h4>
            <p className="text-white text-sm leading-relaxed">Stay connected and updated on our latest features and community insights.</p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com/evalsy" className="p-2   border-2 border-white rounded-full hover: transition-colors">
                <Instagram className="h-5 w-5 text-white" />
              </Link>
              <Link href="https://facebook.com/evalsy" className="p-2   border-2 border-white rounded-full hover: transition-colors">
                <Facebook className="h-5 w-5 text-white" />
              </Link>
              <Link href="https://twitter.com/evalsy" className="p-2   border-2 border-white rounded-full hover: transition-colors">
                <Twitter className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t-2 border-white">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-white">© 2025 Evalsy. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link className="text-sm text-white hover:text-white transition-colors hover:underline" href="/privacy">
                Privacy Policy
              </Link>
              <Link className="text-sm text-white hover:text-white transition-colors hover:underline" href="/terms">
                Terms of Service
              </Link>
              <Link className="text-sm text-white hover:text-white transition-colors hover:underline" href="/cookies">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
