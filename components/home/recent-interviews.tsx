import DateFormatter from '@/app/utils/DateFormatter';
import { getColorByInitial } from '@/app/utils/getColorByInitial';
import { getInitials } from '@/app/utils/getInitials';
import { truncateText } from '@/app/utils/truncate.text';
import { get10InterviewResult } from '@/services/dashboard.service';
import { getInterviewResultById } from '@/services/interview.service';
import { Button, Card, CardBody, Skeleton, Spinner, User } from '@heroui/react';
import React, { useEffect, useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { FaInfoCircle } from 'react-icons/fa';

export const RecentInterviews = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedInterviewerData, setSelectedInterviewerData] = useState<any>(null);
  const [loadingResults, setLoadingResults] = useState<{ [key: string]: boolean }>({});

  const handleViewDetails = async (resultId: string) => {
    setLoadingResults((prev) => ({ ...prev, [resultId]: true })); // Set loading for the specific result

    try {
      const data = await getInterviewResultById(resultId);
      setSelectedInterviewerData(data);
      setDrawerOpen(true);
    } catch (error) {
      console.error('Error fetching interviewer data:', error);
    }

    setLoadingResults((prev) => ({ ...prev, [resultId]: false })); // Reset loading after fetch
  };

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
    <Card radius="md" shadow="sm" className="p-4">
      <CardBody className="py-5 gap-4">
        <div className="flex gap-2.5 justify-center">
          <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">Recent Interviews</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid grid-cols-[2fr_1fr_1fr] w-full animate-pulse gap-2 py-2">
                  {/* First Column: User Info */}
                  <div className="w-full flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex flex-col">
                      <Skeleton className="h-4 w-24 rounded-md" />
                      <Skeleton className="h-3 w-20 rounded-md mt-1" />
                    </div>
                  </div>

                  {/* Second Column: Status */}
                  <div className="flex items-center flex-col">
                    <Skeleton className="h-4 w-12 rounded-md" />
                    <Skeleton className="h-3 w-10 rounded-md mt-1" />
                  </div>

                  {/* Third Column: Date */}
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                </div>
              ))
            : results.map((item) => (
                <div key={item.id} className="bg-green grid grid-cols-[3fr_1fr_1fr_auto] w-full py-2 items-center">
                  {/* First Column: User Information */}
                  <div className="w-full">
                    <User
                      avatarProps={{
                        name: getInitials(item.invitation.name),
                        className: getColorByInitial(item.invitation.name),
                      }}
                      description={truncateText(item.job.jobTitle, 30, { wordBoundary: true })}
                      name={truncateText(item.invitation.name, 30, { wordBoundary: true })}
                    />
                  </div>

                  {/* Second Column: Status */}
                  <div className="flex items-center flex-col text-center">
                    <span className="text-success text-xs mb-1">Score</span>
                    <span className="text-xs">{((item?.overallWeight / 30) * 100).toFixed(2)}% </span>
                  </div>

                  {/* Third Column: Date */}
                  <div className="flex items-center">
                    <span className="text-default-500 text-xs">{DateFormatter.timeAgo(item.invitation.statusUpdateAt)}</span>
                  </div>

                  {/* Fourth Column: Button - Align to Right */}
                  <div className="flex items-center justify-self-end ml-auto">
                    <Button color="primary" isIconOnly={true} isLoading={loadingResults[item.id]} onPress={() => handleViewDetails(item.id)} radius="full" size="sm" variant="flat">
                      {loadingResults[item.id] ? <Spinner size="sm" /> : <AiFillEye />}
                    </Button>
                  </div>
                </div>
              ))}

          {results.length === 0 && !loading && (
            <div className="w-full   mx-auto">
              <div className="  p-8 mb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <FaInfoCircle className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">No interviews yet</h3>
                <p className="text-sm mb-4">You havent participated in any interviews recently. Schedule your first interview to get started.</p>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
