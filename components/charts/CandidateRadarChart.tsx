'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CategoryScore {
  name: string;
  score: number;
}

interface Props {
  categoryScores: CategoryScore[];
  candidateName: string;
}

export default function CandidateRadarChart({ categoryScores, candidateName }: Props) {
  const categories = categoryScores.map((c) => c.name);
  const scores = categoryScores.map((c) => c.score);

  const options: ApexOptions = {
    chart: { type: 'radar', toolbar: { show: false } },
    title: { text: `${candidateName} – Skill Breakdown`, align: 'center' },
    xaxis: { categories },
    yaxis: { min: 0, max: 100, tickAmount: 5 },
    fill: {
      opacity: 0.3,
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        gradientToColors: ['#8b5cf6'],
        stops: [0, 100],
      },
    },
    colors: ['#7c3aed'],
  };

  const series = [{ name: 'Score', data: scores }];

  return <Chart options={options} series={series} type="radar" height={400} />;
}
