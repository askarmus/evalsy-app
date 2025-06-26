'use client';

import { Divider } from '@heroui/react';
import Image from 'next/image';

type Company = {
  alt: string;
  width: number;
  height: number;
  src: string;
};

const companies: Company[] = [
  {
    alt: 'Aquip Logo',
    width: 120,
    height: 40,
    src: '/company-logo/AQUIP logo-02-BANNER.png',
  },
  {
    alt: 'IBM Logo',
    width: 82,
    height: 23,
    src: '/company-logo/logo_startupsg.2hs1qgv2.png',
  },
  {
    alt: 'Uber Logo',
    width: 65,
    height: 23,
    src: '/company-logo/header_icon_black2024.svg',
  },
  {
    alt: 'Whatfix Logo',
    width: 88,
    height: 25,
    src: '/company-logo/virtusa.png',
  },
  {
    alt: 'Whatfix Logo',
    width: 88,
    height: 25,
    src: '/company-logo/QUALGRO-LOGO-300x93.png',
  },
];

export default function Companies() {
  return (
    <section id="how-it-work" className="w-full py-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <p className="text-xs     tracking-[0.13em] text-gray-500 mb-4">A few trusted companies around the world</p>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-2 gap-5 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-center w-full aspect-[16/9]">
                <div style={{ width: company.width, height: company.height }} className="relative">
                  <Image alt={company.alt} src={company.src} fill style={{ objectFit: 'contain' }} sizes="100vw" priority={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
