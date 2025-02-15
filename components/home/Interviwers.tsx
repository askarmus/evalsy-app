import { Avatar, AvatarGroup, Card, CardBody, Skeleton, Tooltip } from "@heroui/react";
import React from "react";

export const Interviwers = ({ data, loading }) => {
  return (
    <Card className='bg-default-50 rounded-xl shadow-md px-4 py-6 w-full'>
      <CardBody className='py-5 gap-6'>
        <div className='flex gap-2.5 justify-center'>
          <div className='flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl'>
            <span className='text-default-900 text-xl font-semibold'> {"⭐"}Interviwers</span>
          </div>
        </div>
        <div className='flex items-center gap-6 flex-col'>
          {loading ? (
            <Skeleton className='h-16 w-16 rounded-full' />
          ) : (
            <>
              <span className='text-xs'>Stay updated with the most recent interviewers who are actively participating in the hiring process to ensure you get the best candidates.</span>

              <AvatarGroup isBordered>
                {data.map((interviewer, index) => (
                  <Tooltip key={index} content={interviewer.name}>
                    <Avatar src={interviewer.photoUrl} />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
