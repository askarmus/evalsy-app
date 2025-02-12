import DateFormatter from "@/app/utils/DateFormatter";
import { getColorByInitial } from "@/app/utils/getColorByInitial";
import { getInitials } from "@/app/utils/getInitials";
import { get10InterviewResult } from "@/services/dashboard.service";
import { Avatar, Button, Card, CardBody, User } from "@heroui/react";
import React, { useEffect, useState } from "react";

export const RecentInterviews = () => {
  const [results, setResults] = useState<any[]>([]); // State to store interview results
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading before fetching data
      try {
        const data = await get10InterviewResult();
        setResults(data);
      } catch (err) {
      } finally {
        setLoading(false); // Stop loading after data is fetched or error occurs
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading interview results...</p>; // Display loading message while fetching
  }

  return (
    <Card className='bg-default-50 rounded-xl shadow-md px-3'>
      <CardBody className='py-5 gap-4'>
        <div className='flex gap-2.5 justify-center'>
          <div className='flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl'>
            <span className='text-default-900 text-xl font-semibold'>Recent Interviews</span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          {results.map((item) => (
            <div key={item.id} className='grid grid-cols-[2fr_1fr_1fr] w-full'>
              {/* First Column: User Information (Wider) */}
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
