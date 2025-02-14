import React from "react";
import { Card, CardBody } from "@heroui/react";
import { AiOutlineUserSwitch } from "react-icons/ai";

export const DashboardWidjet: React.FC<any> = ({ data }) => {
  return (
    <Card className={`xl:max-w-sm ${data.bgColor} rounded-xl shadow-md px-3 w-full`}>
      <CardBody className='py-5'>
        <div className='flex gap-2.5'>
          <AiOutlineUserSwitch className='text-white text-3xl' />

          <div className='flex flex-col'>
            <span className='text-default-900 text-white'>{data.title}</span>
          </div>
        </div>
        <div className='flex gap-2.5 py-2 items-center'>
          <span className='text-default-900 text-xl font-semibold text-white'>{data.value}</span>
        </div>
      </CardBody>
    </Card>
  );
};
