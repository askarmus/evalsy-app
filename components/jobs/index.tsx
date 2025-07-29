'use client';
import { Button, Input, Pagination, Chip, Card, CardFooter, CardHeader, Tooltip, Tabs, Tab, DropdownMenu, Badge, CardBody, Dropdown, DropdownTrigger, DropdownItem } from '@heroui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllJobs, deleteJob } from '@/services/job.service';
import { SendInvitationDrawer } from './send-invitation';
import { useRouter } from 'next/navigation';
import JobListItemSkeleton from './components/job.listItem.skeleton';
import ConfirmDialog from '@/components/ConfirmDialog';
import DateFormatter from '@/app/utils/DateFormatter';
import { AiFillEdit, AiOutlineDelete, AiOutlineDiff, AiOutlinePlus, AiOutlineUserAdd, AiOutlineRollback } from 'react-icons/ai';
import EmptyStateCards from '../shared/empty-state-cards';
import { FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import { showToast } from '@/app/utils/toastUtils';
import { sendInvitation, testInterview } from '@/services/invitation.service';
import { Calendar, CheckCircle, Clock, Edit, ExternalLink, MoreHorizontal, Play, Send, Trash2, UserCheck, Users } from 'lucide-react';

export default function Jobs() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const [filterValue, setFilterValue] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const rowsPerPage = 4;
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const router = useRouter();

  const tryYourself = async (jobId: string) => {
    setLoadingJobId(jobId);
    try {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);

      const result = await testInterview({
        jobId,
        name: 'John Doe',
        email: 'johndoe@example.com',
        message: 'This is test interview',
        expires: currentDate.toDateString(),
        duration: 2,
      });

      // Create a hidden link and click it
      const link = document.createElement('a');
      link.href = `/interview/start/${result.id}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to send invitation due to an unexpected error.';
      showToast.error(errorMsg);
    } finally {
      setLoadingJobId(null);
    }
  };
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredItems = useMemo(() => {
    return jobs
      .filter((job: any) => {
        if (selectedTab === 'active') return job.status.toLowerCase() !== 'deleted';
        return job.status.toLowerCase() === 'deleted';
      })
      .filter((job: any) => job.jobTitle.toLowerCase().includes(filterValue.toLowerCase()));
  }, [jobs, selectedTab, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems]);

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  const handleInviteClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedJobId(null);
    setDrawerOpen(false);
  };

  const handleManageResumeClick = (jobId: string) => {
    setSelectedJobId(jobId);
    router.push(`/interviews/resume/${jobId}`);
  };

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (jobToDelete) {
      try {
        await deleteJob(jobToDelete);
        setConfirmDialogOpen(false);
        setJobToDelete(null);
        setSelectedTab('inactive');
        await fetchJobs();
      } catch (error) {
        console.error('Error deleting Interviews:', error);
      }
    }
  };

  const handleRestore = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      setSelectedTab('active');
      await fetchJobs();
    } catch (error) {
      console.error('Error restoring Interviews:', error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setJobToDelete(null);
  };

  const statusConfig: Record<string, { icon: JSX.Element; bg: string; text: string }> = {
    pending: {
      icon: <Clock className="w-4 h-4 text-orange-600" />,
      bg: 'bg-orange-50',
      text: 'text-orange-700',
    },
    completed: {
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
    started: {
      icon: <Play className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'BEGINNER':
        return 'bg-emerald-200 text-emerald-800 text-xs';
      case 'EXPERT':
        return 'bg-purple-200 text-purple-800';
      case 'SENIOR':
        return 'bg-amber-200 text-amber-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="  my-10 px-4 lg:px-6 max-w-[80rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">All Interviews</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            onChange={(e) => onSearchChange(e.target.value)}
            isClearable
            className="max-w-md   border-black  "
            placeholder="Search jobs"
            defaultValue=""
            startContent={<FaSearch />}
            variant="bordered"
            color="default"
            onClear={() => {
              setFilterValue('');
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Tabs
            key="tabs"
            aria-label="Tabs sizes"
            size="sm"
            selectedKey={selectedTab}
            onSelectionChange={(key) => {
              setSelectedTab(key as string);
              setPage(1);
            }}
          >
            <Tab
              key="active"
              title={
                <>
                  <span>Active </span>
                  <Chip size="sm" variant="faded">
                    {jobs.filter((j: any) => j.status.toLowerCase() !== 'deleted').length}
                  </Chip>
                </>
              }
            />
            <Tab
              key="inactive"
              title={
                <>
                  <span>Inactive </span>
                  <Chip size="sm" variant="faded">
                    {jobs.filter((j: any) => j.status.toLowerCase() === 'deleted').length}
                  </Chip>
                </>
              }
            />
          </Tabs>

          <Button color="primary" className=" text-white  bg-[#100145] " size="sm" onPress={() => router.push('/interviews/add')} endContent={<AiOutlinePlus />}>
            Create New Interview
          </Button>
        </div>
      </div>

      <div className="max-w-[80rem] mx-auto w-full">
        {isLoading && <JobListItemSkeleton />}

        {!isLoading && (
          <div className="w-full flex flex-col gap-4">
            {filteredItems.length === 0 ? (
              <EmptyStateCards
                title={jobs.length === 0 ? 'No Interviews available' : 'No matching results'}
                description={jobs.length === 0 ? "You haven't added any Interviews yet. Start by creating a new one." : 'Try adjusting your search or filter to find what you are looking for.'}
                onReset={
                  jobs.length === 0
                    ? undefined
                    : () => {
                        setFilterValue('');
                        setPage(1);
                      }
                }
              />
            ) : (
              <>
                {items.map((job: any) => (
                  <Card key={job.id} shadow="md" radius="md">
                    <CardBody className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-purple-600 cursor-pointer flex items-center gap-2">
                              {job.jobTitle}

                              <a href={`${window.location.origin}/job/${job.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xl font-bold text-gray-900 dark:text-gray-100 hover:underline">
                                <FaExternalLinkAlt className="w-3 h-3 opacity-40" />
                              </a>
                            </h3>
                            <Chip size="sm" color="default" variant="solid" className={`${getExperienceLevelColor(job.experienceLevel)} `}>
                              {job.experienceLevel.toUpperCase()}
                            </Chip>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{job.totalInvitations} Invitations</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Created {DateFormatter.formatDate(job.createdAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {job.invitationStatusCount?.map((item: any, index: number) => {
                              const config = statusConfig[item.status] || {
                                icon: <Clock className="w-4 h-4 text-gray-600" />,
                                bg: 'bg-gray-100',
                                text: 'text-gray-700',
                              };

                              return (
                                <div key={index} className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
                                  {config.icon}
                                  <span className={`text-sm font-medium ${config.text}`}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}: {item.count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-6">
                          <Button variant="bordered" color="default" radius="full" onPress={() => handleManageResumeClick(job.id)} size="sm" className="gap-2 bg-transparent">
                            <UserCheck className="w-4 h-4" />
                            View Candidates
                          </Button>

                          <Button variant="bordered" color="default" radius="full" onPress={() => handleInviteClick(job.id)} size="sm" className="gap-2 bg-transparent">
                            <Send className="w-4 h-4" />
                            Invite Candidates
                          </Button>

                          <Button size="sm" isLoading={loadingJobId === job.id} radius="full" variant="faded" color="default" aria-label="manage" onPress={() => tryYourself(job.id)}>
                            <Play className="w-4 h-4" />
                            Try Yourself
                          </Button>
                          <Dropdown>
                            <DropdownTrigger asChild>
                              <Button radius="full" isIconOnly variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                              <DropdownItem onPress={() => router.push(`/interviews/edit/${job.id}`)} className="gap-2" key={'edit'} startContent={<Edit className="w-4 h-4" />}>
                                Edit Position
                              </DropdownItem>
                              <DropdownItem key={'delete'} onPress={() => handleDeleteClick(job.id)} startContent={<Trash2 className="w-4 h-4" />} className="gap-2 text-red-600">
                                Delete Position
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}

                <Pagination
                  color="primary"
                  classNames={{
                    item: 'w-8 h-8 text-small bg-red  ',
                    cursor: 'bg-[#100145]    ',
                  }}
                  size="sm"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </>
            )}

            <SendInvitationDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} jobId={selectedJobId} />
          </div>
        )}
      </div>

      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelDelete} title="Confirm Deletion" description="Are you sure you want to delete this job?" onConfirm={handleConfirmDelete} confirmButtonText="Delete" cancelButtonText="Cancel" />
    </div>
  );
}
