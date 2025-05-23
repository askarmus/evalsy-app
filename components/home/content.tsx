'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { RecentInterviews } from './recent-interviews';
import { DashboardWidjet } from './dashboard.widget';
import { AiOutlineUserSwitch, AiOutlineFileSearch, AiOutlineCheckCircle } from 'react-icons/ai';
import { hiringPipelineOverview } from '@/services/dashboard.service';
import { Card, CardBody, Skeleton } from '@heroui/react';

const Chart = dynamic(() => import('../charts/steam'), {
  ssr: false,
});

const widgetConfig = {
  'Open Interview': { icon: <AiOutlineFileSearch className="text-white text-2xl" />, bgColor: 'bg-primary' },
  'Pending Invitation': { icon: <AiOutlineUserSwitch className="text-white text-2xl" />, bgColor: 'bg-yellow-500' },
  'Completed Interview': { icon: <AiOutlineCheckCircle className="text-2xl text-white" />, bgColor: 'bg-primary' },
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
            <Card shadow="none" className="p-4">
              <CardBody>
                <Chart />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Left Section */}
        <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full">
          <h3 className="text-2xl font-semibold mb-3">Recent Interviwers</h3>
          <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col">
            <RecentInterviews />
          </div>
        </div>
      </div>
      <div className="text-white">{'.'}</div>
    </div>
  );
};
