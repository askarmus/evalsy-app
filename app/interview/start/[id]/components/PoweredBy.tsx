import { DarkModeSwitch } from '@/components/navbar/darkmodeswitch';
import { Logo, LogoPoweredby } from '@/components/shared/logo';
import React from 'react';
import Image from 'next/image';

const PoweredBy: React.FC = () => {
  return (
    <div className="flex justify-between items-center mt-6  text-sm text-slate-500">
      <div className="flex items-center gap-2">
        <LogoPoweredby />
        <p className="text-xs">© 2025 Evalsy Interview Platform</p>
      </div>
    </div>
  );
};

export default PoweredBy;
