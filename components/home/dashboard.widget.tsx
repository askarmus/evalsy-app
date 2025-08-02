import React from 'react';
import { Card, CardBody } from '@heroui/react';
export const DashboardWidjet: React.FC<any> = ({ data }) => {
  return (
    <Card shadow="md" radius="md" className={`w-full bg-secondary-50 `}>
      <CardBody className="p-3">
        <div className="flex gap-2">
          {data.icon}
          <div className="flex flex-col">
            <span className={`text-lg font-semibold  `}>
              {data.value}{' '}
              {data.title?.split(' ').map((word: string, index: number) => (
                <React.Fragment key={index}>
                  <span className="text-red">
                    {word}
                    {index === 0 && <br />}
                  </span>
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
