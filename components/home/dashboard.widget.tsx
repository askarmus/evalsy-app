import React from 'react';
import { Card, CardBody } from '@heroui/react';
export const DashboardWidjet: React.FC<any> = ({ data }) => {
  return (
    <Card shadow="none" radius="md" className="   border-2 border-black   rounded-xl w-full">
      <CardBody className="py-5">
        <div className="flex gap-2">
          {data.icon}
          <div className="flex flex-col">
            <span className=" text-lg font-semibold">{data.title}</span>
          </div>
        </div>
        <div className="flex gap-2.5   items-center">
          <span className=" text-xl font-semibold">{data.value}</span>
        </div>
      </CardBody>
    </Card>
  );
};
