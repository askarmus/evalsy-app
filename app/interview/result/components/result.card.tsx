import React from "react";
import { Card, CardBody } from "@heroui/react";
export const ResultCard: React.FC<any> = ({ data }) => {
  return (
    <Card shadow='sm' className={`xl:max-w-sm ${data.bgColor} rounded-xl shadow-md px-3 w-full`}>
      <CardBody className='py-5'>
        <div className='flex gap-2.5'>
          {data.icon}
          <div className='flex flex-col'>
            <span className='text-white text-lg font-semibold'>{data.title}</span>
          </div>
        </div>
        <div className='flex gap-2.5 py-2 items-center'>
          <span className='text-white text-xl font-semibold'>{data.value}</span>
        </div>
      </CardBody>
    </Card>
  );
};
