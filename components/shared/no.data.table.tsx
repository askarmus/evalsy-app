"use client";

import { ReactElement } from "react";

type NoDataProps = {
  icon: ReactElement;
  title?: string;
  description?: string;
};

export default function NoDataTable({ icon, title = "No data available", description = "There are no records to display in the chart. Add some data to see your visualization." }: NoDataProps) {
  return (
    <div className='flex items-center justify-center h-full'>
      <div className='flex flex-col items-center justify-center h-full p-6 text-center space-y-4'>
        <div className='rounded-full'>
          <div className='h-8 w-8 text-gray-400 dark:text-gray-500'>{icon}</div>
        </div>
        <div className='space-y-2'>
          <h3 className='text-lg font-medium text-gray-700 dark:text-gray-300'>{title}</h3>
          <p className='text-gray-500 text-sm max-w-md'>{description}</p>
        </div>
      </div>
    </div>
  );
}
