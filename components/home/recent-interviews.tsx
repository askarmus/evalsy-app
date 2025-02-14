import DateFormatter from "@/app/utils/DateFormatter";
import { getColorByInitial } from "@/app/utils/getColorByInitial";
import { getInitials } from "@/app/utils/getInitials";
import { get10InterviewResult } from "@/services/dashboard.service";
import { Card, CardBody, Skeleton, User } from "@heroui/react";
import React, { useEffect, useState } from "react";

export const RecentInterviews = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await get10InterviewResult();
        setResults(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className='bg-default-50 rounded-xl shadow-md px-3'>
      <CardBody className='py-5 gap-4'>
        <div className='flex gap-2.5 justify-center'>
          <div className='flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl'>
            <span className='text-default-900 text-xl font-semibold'>Recent Interviews</span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className='grid grid-cols-[2fr_1fr_1fr] w-full animate-pulse gap-2 py-2'>
                  {/* First Column: User Info */}
                  <div className='w-full flex items-center gap-2'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='flex flex-col'>
                      <Skeleton className='h-4 w-24 rounded-md' />
                      <Skeleton className='h-3 w-20 rounded-md mt-1' />
                    </div>
                  </div>

                  {/* Second Column: Status */}
                  <div className='flex items-center flex-col'>
                    <Skeleton className='h-4 w-12 rounded-md' />
                    <Skeleton className='h-3 w-10 rounded-md mt-1' />
                  </div>

                  {/* Third Column: Date */}
                  <div className='flex items-center'>
                    <Skeleton className='h-3 w-16 rounded-md' />
                  </div>
                </div>
              ))
            : results.map((item) => (
                <div key={item.id} className='grid grid-cols-[2fr_1fr_1fr] w-full py-2'>
                  {/* First Column: User Information */}
                  <div className='w-full'>
                    <User
                      avatarProps={{
                        name: getInitials(item.invitation.name),
                        className: getColorByInitial(item.invitation.name),
                      }}
                      description={item.job.jobTitle}
                      name={item.invitation.name}
                    />
                  </div>

                  {/* Second Column: Status */}
                  <div className='flex items-center flex-col'>
                    <span className='text-success text-xs'>Weight</span>
                    <span className='text-xs'>{item.overallWeight != null ? item.overallWeight : "Unknown"}</span>
                  </div>

                  {/* Third Column: Date */}
                  <div className='flex items-center'>
                    <span className='text-default-500 text-xs'>{DateFormatter.formatDate(item.invitation.statusUpdateAt)}</span>
                  </div>
                </div>
              ))}
        </div>
      </CardBody>
    </Card>
  );
};
