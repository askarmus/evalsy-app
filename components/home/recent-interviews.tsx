import DateFormatter from '@/app/utils/DateFormatter';
import { getColorByInitial } from '@/app/utils/getColorByInitial';
import { getInitials } from '@/app/utils/getInitials';
import { truncateText } from '@/app/utils/truncate.text';
import { get10InterviewResult } from '@/services/dashboard.service';
import { Avatar, Button, Card, CardBody, CardHeader, Chip, DropdownMenu, Skeleton, User } from '@heroui/react';
import { Badge, Clock, MoreHorizontal, TrendingUp, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { FaInfoCircle } from 'react-icons/fa';
import { SendInvitationDrawer } from '../jobs/send-invitation';

export const RecentInterviews = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const router = useRouter();

  const handleViewDetails = async (resultId: string) => {
    router.push(`/result?id=${resultId}`);
  };
  const handleInviteClick = () => {
    setDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
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
    <Card shadow="md" radius="md" className="  p-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="text-xl font-semibold   flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            Recent Interviews
          </div>
          {/* <Button
            size="sm"
            className="gap-2"
            onPress={() => {
              handleInviteClick();
            }}
          >
            <UserPlus className="w-4 h-4" />
            Invite Candidate
          </Button> */}
        </div>
      </CardHeader>

      <CardBody className="py-5 gap-4">
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
            : results.map((interview) => (
                <div key={interview.id} className="space-y-6 mt-1">
                  <div className="flex items-center gap-3 p-2 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
                    <Avatar className={`w-10 h-10 ${getColorByInitial(interview.invitation.name)}`} name={getInitials(interview.invitation.name)} />{' '}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{interview.invitation.name}</h3>
                        <Chip size="sm" color="secondary" variant="flat" className="text-xs px-2 py-0.5">
                          {interview.totalScore}%
                        </Chip>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">{interview.job.jobTitle}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {DateFormatter.timeAgo(interview.invitation.statusUpdateAt)}
                      </div>
                    </div>
                    <Button color="secondary" onPress={() => handleViewDetails(interview.id)} radius="full" size="sm" variant="faded">
                      View
                    </Button>
                  </div>
                </div>
              ))}
          {results.length > 0 && !loading && (
            <div className="pt-4">
              <Button color="secondary" variant="bordered" className="w-full  " onPress={() => router.push(`/result`)}>
                View All Interviews
              </Button>
            </div>
          )}
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
      <SendInvitationDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} jobId={''} />
    </Card>
  );
};
