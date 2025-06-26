'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { RecentInterviews } from './recent-interviews';
import { DashboardWidjet } from './dashboard.widget';
import { AiOutlineUserSwitch, AiOutlineCheckCircle } from 'react-icons/ai';
import { hiringPipelineOverview } from '@/services/dashboard.service';
import { Card, CardBody, Skeleton } from '@heroui/react';

const Chart = dynamic(() => import('../charts/steam'), {
  ssr: false,
});

const widgetConfig = {
  'Open Interview': {
    icon: (
      <div className="rounded-full border-[#3534ff] p-1 mb-4 border-1  ">
        <AiOutlineUserSwitch className="text-2xl" />
      </div>
    ),
    bgColor: 'bg-primary',
  },
  'Pending Invitation': {
    icon: (
      <div className="rounded-full   p-1 mb-4 border-1 border-[#3534ff]">
        <AiOutlineUserSwitch className="text-2xl" />
      </div>
    ),
    bgColor: 'bg-primary',
  },
  'Completed Interview': {
    icon: (
      <div className="rounded-full   p-1 mb-4 border-1 border-[#3534ff]">
        <AiOutlineCheckCircle className="text-2xl" />
      </div>
    ),
    bgColor: 'bg-primary',
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
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold mb-3">Hiring Pipeline Overview</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5 justify-center w-full">{loading ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 w-full rounded-xl" />) : widgetData.map((data, index) => <DashboardWidjet key={index} data={data} />)}</div>
          </div>

          {/* Chart */}
          <div className="h-full flex flex-col gap-2">
            <h3 className="text-2xl font-semibold mb-3">Trend analytics</h3>
            <Card shadow="sm" radius="md" className="   w-full">
              <CardBody>
                <Chart />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Left Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col mt-14">
            <RecentInterviews />
          </div>
        </div>
      </div>
      <div className="text-white">{'.'}</div>
    </div>
  );
};
