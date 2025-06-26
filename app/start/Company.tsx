'use client';

import { Card, CardBody, Divider } from '@heroui/react';
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
    alt: 'Singapore startup Logo',
    width: 82,
    height: 23,
    src: '/company-logo/logo_startupsg.2hs1qgv2.png',
  },
  {
    alt: 'Patsanp Logo',
    width: 120,
    height: 23,
    src: '/company-logo/header_icon_black2024.svg',
  },
  {
    alt: 'Virtusa Logo',
    width: 80,
    height: 25,
    src: '/company-logo/virtusa.png',
  },
  {
    alt: 'Whatfix Logo',
    width: 120,
    height: 25,
    src: '/company-logo/QUALGRO-LOGO-300x93.png',
  },
  {
    alt: 'Ceyebx Logo',
    width: 120,
    height: 25,
    src: '/company-logo/logo.png',
  },
];

export default function Companies() {
  return (
    <section id="how-it-work" className="w-full py-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <p className="text-xs     tracking-[0.13em] text-gray-500 mb-0">A few trusted companies around the world</p>

        <Card shadow="none" className="p-1  max-w-3xl mx-auto bg-transparent  ">
          <CardBody className="p-1">
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-2 gap-0 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6">
                {companies.map((company, index) => (
                  <div key={index} className="flex items-center justify-center w-full aspect-[16/9]">
                    <div style={{ width: company.width, height: company.height }} className="relative">
                      <Image alt={company.alt} src={company.src} fill style={{ objectFit: 'contain' }} sizes="100vw" priority={false} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
