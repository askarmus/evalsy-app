"use client";
import { Button, Input, Pagination, Chip, Card, CardFooter, CardHeader, Spinner, Tooltip, Avatar } from "@heroui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllJobs, deleteJob } from "@/services/job.service"; // Make sure deleteJob is implemented in your service
import { SendInvitationDrawer } from "./send-invitation";
import { Breadcrumb } from "../bread.crumb";
import { useRouter } from "next/navigation";
import JobListItemSkeleton from "./components/job.listItem.skeleton";
import ConfirmDialog from "@/components/ConfirmDialog"; // Import your confirmation dialog component
import DateFormatter from "@/app/utils/DateFormatter";
import { AiFillEdit, AiOutlineDelete, AiOutlinePlus, AiOutlineUpload, AiOutlineUserAdd } from "react-icons/ai";
import JobResumes from "./Job-resumes";

export default function Jobs() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [jobs, setJobs] = useState([]);
  const rowsPerPage = 5;
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isManageResumeDrawerOpen, setIsManageResumeDrawerOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const router = useRouter();

  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Jobs", link: "" },
  ];

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredItems = useMemo(() => {
    return jobs.filter((job: any) => job.jobTitle.toLowerCase().includes(filterValue.toLowerCase()));
  }, [filterValue, jobs]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [page, filteredItems]);

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  // Invite drawer handlers
  const handleInviteClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setDrawerOpen(true);
  };

  const handleManageResumeClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsManageResumeDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedJobId(null);
    setDrawerOpen(false);
  };

  const handleManageResumeCloseDrawer = () => {
    setSelectedJobId(null);
    setIsManageResumeDrawerOpen(false);
  };

  // Delete handlers
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
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setJobToDelete(null);
  };

  return (
    <div className='my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4'>
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Title */}
      <h3 className='text-xl font-semibold'>All Jobs</h3>

      {/* Search & Add New Job */}
      <div className='flex justify-between flex-wrap gap-4 items-center'>
        <div className='flex items-center gap-3 flex-wrap md:flex-nowrap'>
          <Input
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder='Search jobs'
          />
        </div>
        <div className='flex flex-row gap-3.5 flex-wrap'>
          <Button color='primary' onPress={() => router.push("/jobs/add")} endContent={<AiOutlinePlus />}>
            Add New
          </Button>
        </div>
      </div>

      {/* Job List */}
      <div className='max-w-[90rem] mx-auto w-full'>
        {isLoading && <JobListItemSkeleton />}

        {!isLoading && (
          <div className='w-full flex flex-col gap-4'>
            {items.map((job: any) => (
              <Card key={job.id} className='px-3 py-3'>
                <CardHeader className='flex justify-between items-center'>
                  {/* Job Title */}
                  <div className='flex gap-5'>
                    <div className='flex flex-col gap-1 items-start justify-center'>
                      <h4 className='text-xl font-semibold leading-none text-default-600'>{job.jobTitle}</h4>
                    </div>
                  </div>

                  {/* Buttons & Invitation Status */}
                  <div className='flex flex-col gap-2 ml-auto items-end'>
                    {/* Action Buttons */}
                    <div className='flex gap-1'>
                      <Tooltip content='Send invitation'>
                        <Button isIconOnly aria-label='Edit' onPress={() => handleInviteClick(job.id)} size='sm' color='default' variant='faded'>
                          <AiOutlineUserAdd />
                        </Button>
                      </Tooltip>
                      <Tooltip content='Manage Resume'>
                        <Button isIconOnly aria-label='manage' onPress={() => handleManageResumeClick(job.id)} size='sm' color='default' variant='faded'>
                          <AiOutlineUpload />
                        </Button>
                      </Tooltip>
                      <Tooltip content='Edit job'>
                        <Button isIconOnly aria-label='Edit' onPress={() => router.push(`/jobs/edit/${job.id}`)} size='sm' color='default' variant='faded'>
                          <AiFillEdit />
                        </Button>
                      </Tooltip>

                      <Tooltip content='Delete job'>
                        <Button isIconOnly aria-label='Delete' onPress={() => handleDeleteClick(job.id)} size='sm' color='default' variant='faded'>
                          <AiOutlineDelete />
                        </Button>
                      </Tooltip>
                    </div>

                    {/* Invitation Status */}
                  </div>
                </CardHeader>

                {/* Card Footer with Metadata */}
                <CardFooter className='gap-6 flex-wrap flex justify-between items-center'>
                  {/* Left Section: Experience, Applications, Created Date */}
                  <div className='flex gap-6 flex-wrap items-center'>
                    {/* Experience Level */}
                    <div className='flex gap-1'>
                      <Chip size='sm' color='default' variant='flat'>
                        {job.experienceLevel.toUpperCase()}
                      </Chip>
                    </div>

                    {/* Application Count */}
                    <div className='flex gap-1'>
                      <p className='font-semibold text-default-400 text-sm'>{job.totalInvitations}</p>
                      <p className='text-default-400 text-sm'>Invitations</p>
                    </div>

                    {/* Created Date */}
                    <div className='flex gap-1'>
                      <p className='text-default-400 text-sm'>Created</p>
                      <p className='font-semibold text-default-400 text-sm'>{DateFormatter.formatDate(job.createdAt)}</p>
                    </div>
                  </div>

                  {/* Right Section: Status Count */}
                  <div className='mt-2 ml-auto'>
                    <ul className='flex gap-4 flex-wrap'>
                      {job.invitationStatusCount?.map((item, index) => (
                        <li key={index} className='flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full shadow-sm hover:bg-gray-200 transition'>
                          <span className='text-sm text-gray-700'>{item.status}:</span>
                          <span className='text-sm text-blue-600'>{item.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardFooter>
              </Card>
            ))}

            <Pagination color='primary' isCompact showControls showShadow page={page} total={pages} onChange={(page) => setPage(page)} />

            <SendInvitationDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} jobId={selectedJobId} />
            {isManageResumeDrawerOpen && selectedJobId && <JobResumes isOpen={isManageResumeDrawerOpen} onClose={handleManageResumeCloseDrawer} jobId={selectedJobId} />}
          </div>
        )}
      </div>

      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelDelete} title='Confirm Deletion' description='Are you sure you want to delete this job?' onConfirm={handleConfirmDelete} confirmButtonText='Delete' cancelButtonText='Cancel' />
    </div>
  );
}
