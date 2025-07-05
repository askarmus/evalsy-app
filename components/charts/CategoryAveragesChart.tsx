'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CategoryAverages {
  name: string;
  averageScore: number;
}

interface Props {
  data: CategoryAverages[];
}

export default function CategoryAveragesChart({ data }: Props) {
  const categories = data.map((d) => d.name);
  const scores = data.map((d) => d.averageScore);

  const options: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    title: { text: 'Average by Category', align: 'center' },
    xaxis: {
      categories,
    },
    yaxis: {
      max: 100,
      title: { text: 'Average Score (%)' },
    },
    colors: ['#7c3aed'],
    dataLabels: { enabled: true },
  };

  const series = [{ name: 'Average', data: scores }];

  return <Chart options={options} series={series} type="bar" height={200} />;
}
