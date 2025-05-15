// components/CustomGauge.tsx
import React from 'react';

interface CustomGaugeProps {
  value: number; // Value from 0 to 100
  size?: number; // Diameter in pixels
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

const CustomGauge: React.FC<CustomGaugeProps> = ({ value, size = 200, strokeWidth = 20, color = '#00BCD4', backgroundColor = '#E0E0E0' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size / 2}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={backgroundColor} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={0} />
      <circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontSize={size * 0.15} fill="#333">
        {value}%
      </text>
    </svg>
  );
};

export default CustomGauge;
