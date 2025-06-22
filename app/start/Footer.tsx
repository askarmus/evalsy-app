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
    <footer
      className="wow fadeInUp relative z-10 bg-[#090E34] pt-20 lg:pt-[100px]"
      data-wow-delay=".15s"
      style={{
        visibility: 'visible',
        animationDelay: '0.15s',
        animationName: 'fadeInUp',
      }}
    >
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-4/12 xl:w-3/12">
            <div className="w-full mb-10">
              <a href="javascript:void(0)" className="mb-6 inline-block max-w-[160px]">
                <img src="/final-dark.png" alt="logo" className="max-w-full" />
              </a>
              <p className="mb-8 max-w-[270px] text-base text-gray-300">We create digital experiences for brands and companies by using technology.</p>
            </div>
          </div>
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
            <div className="w-full mb-10 space-y-3 text-gray-300">
              <h4 className="text-lg font-semibold text-white mb-9">Singapore</h4>
              <a href="mailto:hello@evalsy.com" className="flex items-start space-x-2.5 hover:text-gray-300 transition-colors group">
                <Mail className="h-5 w-5 mt-0.5 text-gray-300 group-hover:text-gray-300 transition-colors" />
                <span>team@evalsy.com</span>
              </a>
              <a href="tel:+15551234567" className="flex items-start space-x-2.5 hover:text-gray-300 transition-colors group">
                <Phone className="h-5 w-5 mt-0.5 text-gray-300 group-hover:text-gray-300 transition-colors" />
                <span>+65 6123 4567</span>
              </a>
              <div className="flex items-start text-gray-300 space-x-2.5">
                <MapPin className="h-5 w-5 mt-0.5 text-gray-300 flex-shrink-0" />
                <span>
                  2 Havelock Road,
                  <br />
                  #05-10 Havelock II
                </span>
              </div>
            </div>
          </div>
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-3/12 xl:w-2/12">
            <div className="w-full mb-10 space-y-3 text-gray-300">
              <h4 className="text-lg font-semibold text-white mb-9">Sri Lanka</h4>

              <a href="mailto:hello@evalsy.com" className="flex items-start space-x-2.5 hover:text-gray-300 transition-colors group">
                <Mail className="h-5 w-5 mt-0.5 text-gray-300 group-hover:text-gray-300 transition-colors" />
                <span>team@evalsy.com</span>
              </a>
              <a href="tel:+15551234567" className="flex items-start space-x-2.5 hover:text-gray-300 transition-colors group">
                <Phone className="h-5 w-5 mt-0.5 text-gray-300 group-hover:text-gray-300 transition-colors" />
                <span>(+947)79059394</span>
              </a>
              <div className="flex items-start text-gray-300 space-x-2.5">
                <MapPin className="h-5 w-5 mt-0.5 text-gray-300 flex-shrink-0" />
                <span>
                  12 Access Tower,
                  <br />
                  Union Place, Colombo
                </span>
              </div>
            </div>
          </div>
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-3/12 xl:w-2/12">
            <div className="w-full mb-10">
              <h4 className="text-lg font-semibold text-white mb-9">Company</h4>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-gray-300 text-gray-300 pb-0.5 border-b border-transparent hover:border-primary/50">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full px-4 md:w-2/3 lg:w-6/12 xl:w-3/12">
            <div className="w-full mb-10">
              <h4 className="text-lg font-semibold text-white mb-9">Follow us on social media</h4>

              <p className="text-sm mb-4 text-gray-300">Stay connected and updated on our latest projects and insights.</p>
              <div className="flex space-x-3 text-gray-300">
                {socialLinks.map((social) => (
                  <Link key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--crator-surface-hsl))] hover:bg-primary hover: transition-all duration-300 group">
                    <social.Icon className="h-5 w-5 text-muted-foreground group-hover: transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-[#8890A4]/40 py-8 lg:mt-[60px]">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-2/3 lg:w-1/2">
              <div className="my-1">
                <div className="flex items-center justify-center -mx-3 md:justify-start">
                  <a href="javascript:void(0)" className="px-3 text-base text-gray-300 hover:text-gray-300 hover:underline">
                    Privacy policy
                  </a>
                  <a href="javascript:void(0)" className="px-3 text-base text-gray-300 hover:text-gray-300 hover:underline">
                    Legal notice
                  </a>
                  <a href="javascript:void(0)" className="px-3 text-base text-gray-300 hover:text-gray-300 hover:underline">
                    Terms of service
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full px-4 md:w-1/3 lg:w-1/2">
              <div className="flex justify-center my-1 md:justify-end">
                <PoweredBy />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span className="absolute left-0 top-0 z-[-1]">
          <img src="/shape-1.svg" alt="" />
        </span>
        <span className="absolute bottom-0 right-0 z-[-1]">
          <img src="/shape-3.svg" alt="" />
        </span>
      </div>
    </footer>
  );
}
