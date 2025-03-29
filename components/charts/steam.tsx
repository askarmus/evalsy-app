"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { trendByJobSeniority } from "@/services/dashboard.service";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TrendItem = {
  jobTitle: string;
  percentage: number;
};

export default function TrendAnalyticsChart() {
  const [categories, setCategories] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    xaxis: {
      categories,
      title: {
        text: "Job Titles",
        style: { fontSize: "14px", fontWeight: "600" },
      },
      labels: {
        rotate: -45,
        style: { fontSize: "12px" },
      },
    },
    yaxis: {
      title: {
        text: "Average Score (%)",
        style: { fontSize: "14px", fontWeight: "600" },
      },
      max: 100,
    },
    dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
      },
    },
    title: {
      text: "Trend Analytics by Job Title",
      align: "center",
      style: { fontSize: "18px", fontWeight: "600" },
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
          <p className='text-gray-500 text-lg font-medium'>No records to show chart for</p>
        </div>
      )}
    </div>
  );
}
