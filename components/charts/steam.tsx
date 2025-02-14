import React from "react";
import Chart, { Props } from "react-apexcharts";

const transformedData = [
  {
    name: "Junior",
    data: [
      { x: "2025-02-04", y: 8.89 }, // DevOps Engineer (junior)
    ],
  },
  {
    name: "Mid",
    data: [
      { x: "2025-02-05", y: 76.58 }, // Cybersecurity Analyst
      { x: "2025-01-08", y: 27.95 }, // Software Engineer
    ],
  },
  {
    name: "Senior",
    data: [
      { x: "2025-02-07", y: 11.4 }, // AI Engineer
      { x: "2025-01-21", y: 25.2 }, // UX Designer
      { x: "2025-01-17", y: 32.05 }, // UX Designer
    ],
  },
  {
    name: "Expert",
    data: [
      { x: "2025-02-07", y: 0.1 }, // Solution Architect (Avoid 0 for log scale)
      { x: "2025-01-17", y: 17.38 }, // Cloud Architect
      { x: "2025-01-12", y: 91.95 }, // Data Scientist
      { x: "2025-01-25", y: 25.71 }, // Data Scientist
      { x: "2025-01-24", y: 89.97 }, // UX Designer
    ],
  },
];

const options: Props["options"] = {
  chart: {
    type: "area",
    stacked: false, // Prevent areas from overlapping too much
    animations: {
      easing: "easeinout",
      speed: 500,
    },
    foreColor: "#333",
    toolbar: { show: true },
  },

  xaxis: {
    type: "datetime",
    labels: {
      format: "dd MMM", // Improved date formatting
      style: { colors: "#333", fontSize: "12px" },
    },
    axisBorder: { color: "#aaa" },
    axisTicks: { color: "#aaa" },
  },

  yaxis: {
    logarithmic: false, // Remove log scale since it's causing distortion
    min: 0, // Avoids negative or zero issues
    labels: {
      style: { colors: "#333", fontSize: "12px" },
    },
  },

  tooltip: {
    enabled: true,
    x: { format: "dd MMM yyyy" },
  },

  stroke: {
    curve: "smooth",
    width: 2,
  },

  fill: {
    opacity: 0.5, // Reduce fill intensity to make things clearer
  },

  markers: {
    size: 4, // Improve visibility of points
    colors: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33"],
    strokeColors: "#fff",
    strokeWidth: 2,
  },

  grid: {
    show: true,
    borderColor: "#ddd",
  },

  legend: {
    position: "top",
    horizontalAlign: "center",
    labels: { colors: "#333" },
    markers: {
      width: 12,
      height: 12,
    },
  },

  dataLabels: {
    enabled: true, // Show values on points
    style: {
      fontSize: "10px",
      colors: ["#000"],
    },
  },
};

export const Steam = () => {
  return (
    <div className='w-full z-20'>
      <div id='chart'>
        <Chart options={options} series={transformedData} type='area' height={425} />
      </div>
    </div>
  );
};
