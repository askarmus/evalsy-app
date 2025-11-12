'use client';

import Image from 'next/image';

export const Logo = () => {
  return (
    <div className="relative h-10 w-[140px]">
      {/* Light logo */}
      <Image
        src="/final-light.png" // ← or /final-light.png if you prefer that variant
        alt="Evalsy"
        fill
        className="object-contain dark:hidden"
        priority
      />
      {/* Dark logo */}
      <Image src="/final-dark-white.png" alt="Evalsy" fill className="object-contain hidden dark:block" priority />
    </div>
  );
};

export const LogoPoweredby = () => {
  return (
    <Image
      width={100}
      height={50}
      src="/final-light.png" // ← or /final-light.png if you prefer that variant
      alt="Evalsy"
      className="object-contain dark:hidden"
      priority
    />
  );
};
