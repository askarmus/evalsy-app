import React from 'react';
import { Card, CardBody } from '@heroui/react';
export const DashboardWidjet: React.FC<any> = ({ data }) => {
  return (
    <Card shadow="none" className={`xl:max-w-sm ${data.bgColor}   w-full`}>
      <CardBody className="py-5">
        <div className="flex gap-2">
          {data.icon}
          <div className="flex flex-col">
            <span className="text-white text-lg font-semibold">{data.title}</span>
          </div>
        </div>
        <div className="flex gap-2.5   items-center">
          <span className="text-white text-xl font-semibold">{data.value}</span>
        </div>
      </CardBody>
    </Card>
  );
};
