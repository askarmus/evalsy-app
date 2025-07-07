'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { useTheme } from 'next-themes';
import { FaChartLine } from 'react-icons/fa';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CategoryAverages {
  name: string;
  averageScore: number;
}

interface Props {
  data: CategoryAverages[];
}

export default function CategoryAveragesChart({ data }: Props) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categories = data.map((d) => d.name);
  const scores = data.map((d) => d.averageScore);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        toolbar: { show: false },
        background: 'transparent',
      },
      theme: {
        mode: isDark ? 'dark' : 'light',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          gradientToColors: ['#8b5cf6'], // violet-500
          stops: [0, 100],
          colorStops: [],
        },
      },
      xaxis: {
        categories,
        title: {
          text: 'Categories',
          style: {
            fontSize: '14px',
            fontWeight: '600',
            color: isDark ? '#E5E7EB' : '#111827',
          },
        },
        labels: {
          rotate: -45,
          style: {
            fontSize: '12px',
            colors: isDark ? '#9CA3AF' : '#374151',
          },
        },
      },
      yaxis: {
        max: 100,
        title: {
          text: 'Average Score (%)',
          style: {
            fontSize: '14px',
            fontWeight: '600',
            color: isDark ? '#E5E7EB' : '#111827',
          },
        },
        labels: {
          style: {
            colors: isDark ? '#9CA3AF' : '#374151',
          },
        },
      },
      dataLabels: { enabled: true },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        y: {
          formatter: (val: number) => `${val.toFixed(2)}%`,
        },
      },
      colors: ['#7c3aed'],
      title: {
        text: 'Category-Wise Averages',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: '600',
          color: isDark ? '#F3F4F6' : '#111827',
        },
      },
    }),
    [categories, isDark]
  );

  const series = [{ name: 'Average', data: scores }];

  return (
    <div className="h-[210px] w-full">
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
            <FaChartLine className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No data available</h3>
              <p className="text-gray-500 text-sm max-w-md">There are no category averages to display in the chart.</p>
            </div>
          </div>
        </div>
      ) : (
        <Chart options={options} series={series} type="bar" height="100%" />
      )}
    </div>
  );
}
