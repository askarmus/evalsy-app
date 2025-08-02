'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { RecentInterviews } from './recent-interviews';
import { DashboardWidjet } from './dashboard.widget';
import { AiOutlineUserSwitch, AiOutlineCheckCircle } from 'react-icons/ai';
import { hiringPipelineOverview } from '@/services/dashboard.service';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { BarChart, CheckSquare, TrendingUp, Users, Workflow } from 'lucide-react';

const Chart = dynamic(() => import('../charts/steam'), {
  ssr: false,
});

const widgetConfig = {
  'Open Interview': {
    icon: <AiOutlineUserSwitch className="text-2xl text-secondary dark:text-white" />, // ✅ fixed typo
    bgColor: 'bg-primary',
    textColor: 'text-white',
  },
  'Pending Invitation': {
    icon: <AiOutlineUserSwitch className="text-2xl dark:text-white text-secondary" />, // ✅ added dark mode support for icon
    bgColor: 'bg-default',
    textColor: 'text-black dark:text-white', // ✅ correct Tailwind class
  },
  'Completed Interview': {
    icon: <AiOutlineCheckCircle className="text-2xl text-secondary dark:text-white" />, // ✅ added for consistency
    bgColor: 'bg-success',
    textColor: 'text-white',
  },
};

export const Content = () => {
  const [widgetData, setWidgetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [widgetResponse] = await Promise.all([hiringPipelineOverview()]);

        setWidgetData(widgetResponse.map((item) => ({ ...widgetConfig[item.title], ...item })));
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap sm:pt-10 max-w-[80rem] mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="text-xl font-semibold mb-4  flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Hiring Pipeline Overview
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5 justify-center w-full">{loading ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 w-full rounded-xl" />) : widgetData.map((data, index) => <DashboardWidjet key={index} data={data} />)}</div>
          </div>

          {/* Chart */}
          <div className="h-full flex flex-col gap-2">
            <div className="text-xl font-semibold mb-4  flex items-center gap-2">
              <BarChart className="w-5 h-5 text-secondary" />
              Trend analytics
            </div>

            <Card shadow="md" radius="md" className=" p-4  w-full">
              <CardBody>
                <Chart />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Left Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col mt-14">
            {/* <Card shadow="md" radius="md" className=" p-4  w-full">
              <CardBody>
                <CategoryAveragesChart
                  data={[
                    { name: 'CS', averageScore: 65 },
                    { name: 'TK', averageScore: 45 },
                    { name: 'PS', averageScore: 52 },
                    { name: 'CF', averageScore: 61 },
                    { name: 'CC', averageScore: 58 },
                  ]}
                />
              </CardBody>
            </Card> */}
            <RecentInterviews />
          </div>
        </div>
      </div>
      <div className="text-white">{'.'}</div>
    </div>
  );
};
