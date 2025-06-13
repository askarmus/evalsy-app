import Link from 'next/link';
import { Brain, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Logo } from '../../components/shared/logo';
import { LogoDark } from '../../components/logo.dark';

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
    <footer className="bg-darkbase-sec  py-16 lg:py-20  ">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Column 1: Brand & Copyright */}
          <div className="space-y-4 text-white">
            <Link href="/" className="flex items-center space-x-2.5 mb-3">
              <LogoDark />
            </Link>
            <p className="text-sm">
              © {new Date().getFullYear()} Evalsy.
              <br />
              All rights reserved.
            </p>
            <p className="text-xs opacity-70">AI-Powered Recruitment Solutions.</p>
          </div>

          {/* Column 2: Get in touch */}
          <div className="space-y-3 text-white">
            <h3 className="text-lg font-semibold text-white mb-4">Singapore</h3>
            <a href="mailto:hello@evalsy.com" className="flex items-start space-x-2.5 hover:text-white transition-colors group">
              <Mail className="h-5 w-5 mt-0.5 text-white group-hover:text-white transition-colors" />
              <span>team@evalsy.com</span>
            </a>
            <a href="tel:+15551234567" className="flex items-start space-x-2.5 hover:text-white transition-colors group">
              <Phone className="h-5 w-5 mt-0.5 text-white group-hover:text-white transition-colors" />
              <span>+65 6123 4567</span>
            </a>
            <div className="flex items-start text-white space-x-2.5">
              <MapPin className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
              <span>
                2 Havelock Road,
                <br />
                #05-10 Havelock II
              </span>
            </div>
          </div>

          <div className="space-y-3 text-white">
            <h3 className="text-lg font-semibold text-white mb-4">Sri Lanka</h3>
            <a href="mailto:hello@evalsy.com" className="flex items-start space-x-2.5 hover:text-white transition-colors group">
              <Mail className="h-5 w-5 mt-0.5 text-white group-hover:text-white transition-colors" />
              <span>team@evalsy.com</span>
            </a>
            <a href="tel:+15551234567" className="flex items-start space-x-2.5 hover:text-white transition-colors group">
              <Phone className="h-5 w-5 mt-0.5 text-white group-hover:text-white transition-colors" />
              <span>(+947)79059394</span>
            </a>
            <div className="flex items-start text-white space-x-2.5">
              <MapPin className="h-5 w-5 mt-0.5 text-white flex-shrink-0" />
              <span>
                12 Access Tower,
                <br />
                Union Place, Colombo
              </span>
            </div>
          </div>

          {/* Column 3: Company Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white text-white pb-0.5 border-b border-transparent hover:border-primary/50">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow us */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white  mb-4">Follow us on social media</h3>
            <p className="text-sm mb-4 text-white">Stay connected and updated on our latest projects and insights.</p>
            <div className="flex space-x-3 text-white">
              {socialLinks.map((social) => (
                <Link key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--crator-surface-hsl))] hover:bg-primary hover: transition-all duration-300 group">
                  <social.Icon className="h-5 w-5 text-muted-foreground group-hover: transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-color-gray-800 pt-8 text-center text-white text-sm">
          <p>&copy; {new Date().getFullYear()} Evalsy. Built with AI, for smarter hiring.</p>
        </div>
      </div>
    </footer>
  );
}
