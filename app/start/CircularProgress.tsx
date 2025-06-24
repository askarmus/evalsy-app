import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 100
  lable: string;
}

export const CircularProgress1: React.FC<CircularProgressProps> = ({ size = 30, strokeWidth = 3, progress, lable }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute top-0 left-0 transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#3b82f6" strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-500" />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-xs">{lable}</div>
    </div>
  );
};
