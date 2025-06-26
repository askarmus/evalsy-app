import React from 'react';
import { Card, CardBody } from '@heroui/react';
export const DashboardWidjet: React.FC<any> = ({ data }) => {
  return (
    <Card shadow="md" radius="md" className={`w-full ${data.bgColor}`}>
      <CardBody className="p-5">
        <div className="flex gap-2">
          {data.icon}
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${data.textColor}`}>
              {data.value}{' '}
              {data.title?.split(' ').map((word: string, index: number) => (
                <React.Fragment key={index}>
                  {word}
                  {index === 0 && <br />}
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
