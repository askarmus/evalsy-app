"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { trendByJobSeniority } from "@/services/dashboard.service";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// This would typically come from an API call
const apiResponse = [
  { jobTitle: "Solution Architect", experienceLevel: "expert", date: "2025-02-07", averageWeight: 0.0, count: 1 },
  { jobTitle: "AI Engineer", experienceLevel: "senior", date: "2025-02-07", averageWeight: 11.4, count: 40 },
  { jobTitle: "Cybersecurity Analyst", experienceLevel: "mid", date: "2025-02-05", averageWeight: 76.58, count: 11 },
  { jobTitle: "Software Engineer", experienceLevel: "mid", date: "2025-01-08", averageWeight: 27.95, count: 20 },
  { jobTitle: "Cloud Architect", experienceLevel: "expert", date: "2025-01-17", averageWeight: 17.38, count: 34 },
  { jobTitle: "UX Designer", experienceLevel: "senior", date: "2025-01-21", averageWeight: 25.2, count: 9 },
  { jobTitle: "Data Scientist", experienceLevel: "expert", date: "2025-01-12", averageWeight: 91.95, count: 4 },
  { jobTitle: "UX Designer", experienceLevel: "senior", date: "2025-01-17", averageWeight: 32.05, count: 7 },
  { jobTitle: "DevOps Engineer", experienceLevel: "junior", date: "2025-02-04", averageWeight: 8.89, count: 1 },
  { jobTitle: "Data Scientist", experienceLevel: "expert", date: "2025-01-25", averageWeight: 25.71, count: 48 },
  { jobTitle: "UX Designer", experienceLevel: "expert", date: "2025-01-24", averageWeight: 89.97, count: 37 },
];

const processData = (data) => {
  const jobTitles = Array.from(new Set(data.map((item) => item.jobTitle)));
  const experienceLevels = Array.from(new Set(data.map((item) => item.experienceLevel)));

  return experienceLevels.map((level: any) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    data: jobTitles.map((job) => {
      const matchingItem = data.find((item) => item.jobTitle === job && item.experienceLevel === level);
      return matchingItem ? matchingItem.averageWeight : 0;
    }),
  }));
};

export default function TrendAnalyticsChart() {
  const [series, setSeries] = useState<{ name: string; data: any[] }[]>([]);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await trendByJobSeniority();

        const processedData = processData(response);
        console.log();
        setSeries(processedData);
        setCategories(Array.from(new Set(response.map((item) => item.jobTitle))));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      title: {
        text: "Job Titles",
        style: {
          fontSize: "14px",
          fontWeight: "600",
        },
      },
      labels: {
        rotate: -45,
        rotateAlways: false,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Average Score",
        style: {
          fontSize: "14px",
          fontWeight: "600",
        },
      },
      max: 5,
    },
    fill: {
      opacity: 1,
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100],
      },
    },
    tooltip: {
      y: {
        formatter: (val) => val.toFixed(2) + "%",
      },
      theme: "dark",
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      offsetY: 10,
      fontSize: "14px",
    },
    colors: ["#7828C8", "#17C964", "#F5A524", "#F31260"],
    title: {
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    theme: {
      mode: "light",
      palette: "palette1",
      monochrome: {
        enabled: false,
        color: "#7828C8",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
  };

  return (
    <div className='h-[450px]'>
      {series.length > 0 ? (
        <Chart options={options} type='bar' series={series} height='100%' />
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p className='text-default-500'>Loading data...</p>
        </div>
      )}
    </div>
  );
}
