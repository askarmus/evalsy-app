'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ScorePoint {
  createdAt: string;
  totalScore: number;
}

interface Props {
  data: ScorePoint[];
  candidateName: string;
}

export default function ScoreOverTimeChart({ data, candidateName }: Props) {
  const sorted = [...data].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const labels = sorted.map((d) => new Date(d.createdAt).toLocaleDateString());
  const values = sorted.map((d) => d.totalScore);

  const options: ApexOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    title: { text: `${candidateName} – Score Over Time`, align: 'center' },
    xaxis: { categories: labels, title: { text: 'Date' } },
    yaxis: { max: 100, title: { text: 'Score (%)' } },
    stroke: { curve: 'smooth' },
    colors: ['#8b5cf6'],
  };

  const series = [{ name: 'Score', data: values }];

  return <Chart options={options} series={series} type="line" height={400} />;
}
