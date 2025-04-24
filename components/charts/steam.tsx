"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { trendByJobSeniority } from "@/services/dashboard.service";
import { FaChartLine } from "react-icons/fa";
import { useTheme } from "next-themes";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TrendItem = {
  jobTitle: string;
  percentage: number;
};

export default function TrendAnalyticsChart() {
  const [categories, setCategories] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { theme } = useTheme(); // light | dark | system

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await trendByJobSeniority(); // Expected response: { message: string, data: TrendItem[] }

        const items: TrendItem[] = response;

        if (!Array.isArray(items) || items.length === 0) {
          setCategories([]);
          setData([]);
        } else {
          const jobTitles = items.map((item) => item.jobTitle);
          const percentages = items.map((item) => item.percentage);

          setCategories(jobTitles);
          setData(percentages);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setCategories([]);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const isDark = theme === "dark";

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    theme: {
      mode: isDark ? "dark" : "light",
    },
    xaxis: {
      categories,
      title: {
        text: "Job Titles",
        style: {
          fontSize: "14px",
          fontWeight: "600",
          color: isDark ? "#E5E7EB" : "#111827",
        },
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
          colors: isDark ? "#9CA3AF" : "#374151",
        },
      },
    },
    yaxis: {
      title: {
        text: "Average Score (%)",
        style: {
          fontSize: "14px",
          fontWeight: "600",
          color: isDark ? "#E5E7EB" : "#111827",
        },
      },
      max: 100,
      labels: {
        style: {
          colors: isDark ? "#9CA3AF" : "#374151",
        },
      },
    },
    dataLabels: { enabled: true },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
      },
    },
    title: {
      text: "Trend Analytics by Job Title",
      align: "center",
      style: {
        fontSize: "18px",
        fontWeight: "600",
        color: isDark ? "#F3F4F6" : "#111827",
      },
    },
    colors: ["#3b82f6"],
  };
  const series = [
    {
      name: "Percentage",
      data,
    },
  ];

  return (
    <div className='h-[400px] w-full '>
      {isLoading ? (
        <div className='flex items-center justify-center h-full'>
          <p className='text-default-500'> Loading data...</p>
        </div>
      ) : data.length > 0 && categories.length > 0 ? (
        <Chart options={options} series={series} type='bar' height='100%' />
      ) : (
        <div className='flex items-center justify-center h-full'>
          <div className='flex flex-col items-center justify-center h-full p-6 text-center space-y-4  '>
            <div className='rounded-full  '>
              <FaChartLine className='h-8 w-8 text-gray-400 dark:text-gray-500' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-medium text-gray-700 dark:text-gray-300'>No data available</h3>
              <p className='text-gray-500 text-sm max-w-md'>There are no records to display in the chart.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
