'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface JobScore {
  jobTitle: string;
  averageScore: number;
}

interface Props {
  data: JobScore[];
}

export default function AverageScoreByJob({ data }: Props) {
  const jobTitles = data.map((d) => d.jobTitle);
  const averages = data.map((d) => d.averageScore);

  const options: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    title: { text: 'Average Score by Job Title', align: 'center' },
    xaxis: {
      categories: jobTitles,
      labels: { rotate: -45 },
      title: { text: 'Job Titles' },
    },
    yaxis: { max: 100, title: { text: 'Average Score (%)' } },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        gradientToColors: ['#8b5cf6'],
        stops: [0, 100],
      },
    },
    colors: ['#7c3aed'],
    dataLabels: { enabled: true },
  };

  const series = [{ name: 'Average Score', data: averages }];

  return <Chart options={options} series={series} type="bar" height={400} />;
}
