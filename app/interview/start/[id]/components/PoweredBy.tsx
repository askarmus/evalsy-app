import { DarkModeSwitch } from '@/components/navbar/darkmodeswitch';
import React from 'react';

const PoweredBy: React.FC = () => {
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-slate-500">
      <div className="flex items-center gap-2"></div>
      <p className="text-xs">© 2025 Evalsy Interview Platform</p>
      <DarkModeSwitch />
    </div>
  );
};

export default PoweredBy;
