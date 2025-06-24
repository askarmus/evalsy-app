import Link from 'next/link';
import { Brain, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Logo } from '../../components/shared/logo';
import { LogoDark } from '../../components/logo.dark';
import PoweredBy from '../interview/start/[id]/components/PoweredBy';

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
    <footer className="w-full py-12 bg-[#E0FFF0] border-t-2 border-black">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-black" style={{ fontFamily: 'Courier, monospace' }}>
                SparkCard
              </span>
            </Link>
            <p className="text-gray-700 text-sm leading-relaxed">We create financial experiences for students and young adults by using innovative technology and transparent practices.</p>
          </div>

          {/* Sydney Office */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Sydney</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-[#98FB98] rounded-full border border-black">
                  <Mail className="h-3 w-3 text-black" />
                </div>
                <Link href="mailto:team@sparkcard.com" className="text-gray-700 hover:text-black text-sm">
                  team@sparkcard.com
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-[#98FB98] rounded-full border border-black">
                  <Phone className="h-3 w-3 text-black" />
                </div>
                <Link href="tel:+61234567890" className="text-gray-700 hover:text-black text-sm">
                  +61 2 3456 7890
                </Link>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-[#98FB98] rounded-full border border-black mt-0.5">
                  <MapPin className="h-3 w-3 text-black" />
                </div>
                <div className="text-gray-700 text-sm">
                  <p>Level 15, 1 Martin Place,</p>
                  <p>Sydney NSW 2000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Melbourne Office */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Melbourne</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-[#98FB98] rounded-full border border-black">
                  <Mail className="h-3 w-3 text-black" />
                </div>
                <Link href="mailto:team@sparkcard.com" className="text-gray-700 hover:text-black text-sm">
                  team@sparkcard.com
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-[#98FB98] rounded-full border border-black">
                  <Phone className="h-3 w-3 text-black" />
                </div>
                <Link href="tel:+61387654321" className="text-gray-700 hover:text-black text-sm">
                  +61 3 8765 4321
                </Link>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1 bg-[#98FB98] rounded-full border border-black mt-0.5">
                  <MapPin className="h-3 w-3 text-black" />
                </div>
                <div className="text-gray-700 text-sm">
                  <p>Suite 200, 120 Collins Street,</p>
                  <p>Melbourne VIC 3000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link className="text-gray-700 hover:text-black text-sm transition-colors hover:underline" href="#features">
                  Home
                </Link>
              </li>
              <li>
                <Link className="text-gray-700 hover:text-black text-sm transition-colors hover:underline" href="#pricing">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="text-gray-700 hover:text-black text-sm transition-colors hover:underline" href="#cta">
                  Demo
                </Link>
              </li>
              <li>
                <Link className="text-gray-700 hover:text-black text-sm transition-colors hover:underline" href="#faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="text-gray-700 hover:text-black text-sm transition-colors hover:underline" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="text-gray-700 hover:text-black text-sm transition-colors hover:underline" href="/careers">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-black">Follow us on social media</h4>
            <p className="text-gray-700 text-sm leading-relaxed">Stay connected and updated on our latest features, financial tips, and community insights.</p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com/sparkcard" className="p-2 bg-white border-2 border-black rounded-full hover:bg-[#98FB98] transition-colors">
                <Instagram className="h-5 w-5 text-black" />
              </Link>
              <Link href="https://facebook.com/sparkcard" className="p-2 bg-white border-2 border-black rounded-full hover:bg-[#98FB98] transition-colors">
                <Facebook className="h-5 w-5 text-black" />
              </Link>
              <Link href="https://twitter.com/sparkcard" className="p-2 bg-white border-2 border-black rounded-full hover:bg-[#98FB98] transition-colors">
                <Twitter className="h-5 w-5 text-black" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t-2 border-black">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-700">© 2023 SparkCard. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link className="text-sm text-gray-700 hover:text-black transition-colors hover:underline" href="/privacy">
                Privacy Policy
              </Link>
              <Link className="text-sm text-gray-700 hover:text-black transition-colors hover:underline" href="/terms">
                Terms of Service
              </Link>
              <Link className="text-sm text-gray-700 hover:text-black transition-colors hover:underline" href="/cookies">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
