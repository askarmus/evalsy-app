'use client';
import { Button, Input, Pagination, Chip, Card, CardFooter, CardHeader, Tooltip, Tabs, Tab } from '@heroui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllJobs, deleteJob } from '@/services/job.service';
import { SendInvitationDrawer } from './send-invitation';
import { Breadcrumb } from '../bread.crumb';
import { useRouter } from 'next/navigation';
import JobListItemSkeleton from './components/job.listItem.skeleton';
import ConfirmDialog from '@/components/ConfirmDialog';
import DateFormatter from '@/app/utils/DateFormatter';
import { AiFillEdit, AiOutlineDelete, AiOutlineDiff, AiOutlinePlus, AiOutlineUserAdd, AiOutlineRollback } from 'react-icons/ai';
import EmptyStateCards from '../shared/empty-state-cards';
import { FaCopy, FaExternalLinkAlt, FaExternalLinkSquareAlt, FaEye, FaSearch } from 'react-icons/fa';
import { showToast } from '@/app/utils/toastUtils';

export default function Jobs() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const rowsPerPage = 4;
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const router = useRouter();

  const breadcrumbItems = [
    { name: 'Dashboard', link: '/' },
    { name: 'Interviews', link: '' },
  ];

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
      <Breadcrumb items={breadcrumbItems} />

      <h3 className="text-xl font-semibold">All Interviews</h3>

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            onChange={(e) => onSearchChange(e.target.value)}
            isClearable
            className="max-w-md"
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

          <Button color="primary" size="sm" onPress={() => router.push('/interviews/add')} endContent={<AiOutlinePlus />}>
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
                  <Card key={job.id} shadow="none" className="P-3">
                    <CardHeader className="flex justify-between items-center">
                      <div className="flex gap-5">
                        <div className="flex flex-col gap-1 items-start justify-center">
                          <a href={`${window.location.origin}/job/${job.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xl font-bold text-gray-900 dark:text-gray-100 hover:underline">
                            {job.jobTitle}
                            <FaExternalLinkAlt className="w-3 h-3 opacity-40" />
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-auto items-end">
                        <div className="flex gap-1">
                          {selectedTab === 'inactive' ? (
                            <Tooltip content="Restore job">
                              <button aria-label="Restore" className="p-1 text-gray-600 hover:text-black rounded-full" onClick={() => handleRestore(job.id)}>
                                <AiOutlineRollback className="h-5 w-5" />
                              </button>
                            </Tooltip>
                          ) : (
                            <>
                              <Tooltip content="Manage Resume">
                                <Button size="sm" radius="full" variant="bordered" startContent={<AiOutlineDiff className="h-5 w-5" />} aria-label="manage" onPress={() => handleManageResumeClick(job.id)}>
                                  Candidate
                                </Button>
                              </Tooltip>

                              <Tooltip content="Send invitation">
                                <button onClick={() => handleInviteClick(job.id)} className="p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white" aria-label="Send invitation">
                                  <AiOutlineUserAdd className="h-5 w-5" />
                                </button>
                              </Tooltip>

                              <Tooltip content="Edit job">
                                <button aria-label="Edit" className="p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white" onClick={() => router.push(`/interviews/edit/${job.id}`)}>
                                  <AiFillEdit className="h-5 w-5" />
                                </button>
                              </Tooltip>

                              <Tooltip content="Delete job">
                                <button aria-label="Delete" className="p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white" onClick={() => handleDeleteClick(job.id)}>
                                  <AiOutlineDelete className="h-5 w-5" />
                                </button>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardFooter className="gap-6 flex-wrap flex justify-between items-center pt-0">
                      <div className="flex gap-6 flex-wrap items-center">
                        <div className="flex gap-1">
                          <Chip size="sm" color="default" variant="solid" className={`${getExperienceLevelColor(job.experienceLevel)} `}>
                            {job.experienceLevel.toUpperCase()}
                          </Chip>
                        </div>

                        <div className="flex gap-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{job.totalInvitations}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Invitations</p>
                        </div>

                        <div className="flex gap-1">
                          <p className="text-sm">Created</p>
                          <p className="font-semibold text-sm">{DateFormatter.formatDate(job.createdAt)}</p>
                        </div>
                      </div>

                      <div className="mt-2 ml-auto">
                        <ul className="flex gap-4 flex-wrap">
                          {job.invitationStatusCount?.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full shadow-sm hover:bg-gray-200 transition">
                              <span className="text-sm text-blue-600 dark:text-blue-400">{item.status}:</span>
                              <span className="text-sm text-blue-600 dark:text-blue-400">{item.count}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardFooter>
                  </Card>
                ))}

                <Pagination showControls color="primary" variant="bordered" size="sm" page={page} total={pages} onChange={(page) => setPage(page)} />
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
