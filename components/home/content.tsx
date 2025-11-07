'use client';
import React from 'react';

import { RecentInterviews } from './recent-interviews';

import { Card, CardBody } from '@heroui/react';
import { BarChart, Users } from 'lucide-react';
import CoreWidgets from './CoreWidgets';
import TopJobsPerformance from './TopJobsPerformance';

export const Content = () => {
  return (
    <div className="h-full lg:px-6">
      <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0 flex-wrap xl:flex-nowrap  mx-auto w-full">
        <div className="mt-6 gap-6 flex flex-col w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="text-2xl font-semibold mb-4  flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Hiring Pipeline Overview
            </div>

            <CoreWidgets />
          </div>

          {/* Chart */}
          <div className="h-full flex flex-col gap-2">
            <div className="text-2xl font-semibold mb-4  flex items-center gap-2">
              <BarChart className="w-5 h-5 text-secondary" />
              Top Performence Interviews
            </div>

            <Card shadow="md" radius="md" className=" p-4  w-full">
              <CardBody>
                <TopJobsPerformance />
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
