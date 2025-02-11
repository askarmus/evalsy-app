import { get10InterviewResult } from "@/services/dashboard.service";
import { Avatar, Button, Card, CardBody } from "@heroui/react";
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
    <Card className=' bg-default-50 rounded-xl shadow-md px-3'>
      <CardBody className='py-5 gap-4'>
        <div className='flex gap-2.5 justify-center'>
          <div className='flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl'>
            <span className='text-default-900 text-xl font-semibold'>Recent Interviews</span>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          {results.map((item) => (
            <div key={item.id} className='grid grid-cols-4 w-full'>
              <div className='w-full'>
                <Avatar isBordered color='secondary' src='https://i.pravatar.cc/150?u=a042581f4e29026024d' />
              </div>

              <span className='text-default-900  font-semibold'>{item.invitation.name}</span>
              <div>
                <span className='text-success text-xs'>{item.invitation.status}</span>
              </div>
              <div>
                <span className='text-default-500 text-xs'>{item.invitation.statusUpdateAt}</span>
                <Button size='sm' variant='flat' color='primary'>
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
