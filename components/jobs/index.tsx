"use client";
import { Button, Input, Pagination, Chip, Card, CardFooter, CardHeader, Spinner } from "@heroui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllJobs, deleteJob } from "@/services/job.service"; // Make sure deleteJob is implemented in your service
import { SendInvitationDrawer } from "./send-invitation";
import { Breadcrumb } from "../bread.crumb";
import { AiOutlineMore } from "react-icons/ai";
import { useRouter } from "next/navigation";
import JobListItemSkeleton from "./components/job.listItem.skeleton";
import ConfirmDialog from "@/components/ConfirmDialog"; // Import your confirmation dialog component

export default function Jobs() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [jobs, setJobs] = useState([]);
  const rowsPerPage = 5;
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
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

  const statusColorMap: Record<string, "secondary" | "default" | "primary" | "success" | "warning" | "danger"> = {
    draft: "default",
    published: "success",
    paused: "warning",
    expired: "secondary",
    closed: "danger",
    deleted: "danger",
  };

  const getStatusColor = (status: string): "secondary" | "default" | "primary" | "success" | "warning" | "danger" => {
    return statusColorMap[status] || "default";
  };

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  // Invite drawer handlers
  const handleInviteClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedJobId(null);
    setDrawerOpen(false);
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
      <Breadcrumb items={breadcrumbItems} />

      <h3 className='text-xl font-semibold'>All Jobs</h3>
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
          <Button color='primary' onPress={() => router.push("/jobs/add")}>
            Add New Job
          </Button>
        </div>
      </div>

      <div className='max-w-[90rem] mx-auto w-full'>
        {isLoading && <JobListItemSkeleton />}
        {!isLoading && (
          <div className='w-full flex flex-col gap-4'>
            {items.map((job: any) => (
              <Card key={job.id} className='p-5'>
                <CardHeader className='justify-between'>
                  <div className='flex gap-5'>
                    <div className='flex flex-col gap-1 items-start justify-center'>
                      <h4 className='text-xl font-semibold leading-none text-default-600'>{job.jobTitle}</h4>
                      <h5 className='text-small tracking-tight text-default-400'>{job.experienceLevel}</h5>
                    </div>
                  </div>
                  <div className='gap-3'>
                    <Button color='primary' variant='bordered' className='mr-2' size='sm' onPress={() => handleInviteClick(job.id)}>
                      Invite
                    </Button>
                    <Button size='sm' color='secondary' variant='bordered' className='mr-2'>
                      Edit
                    </Button>
                    <Button size='sm' color='danger' variant='bordered' onPress={() => handleDeleteClick(job.id)}>
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardFooter className='gap-3'>
                  <div className='flex gap-1'>
                    <Chip size='sm' color={getStatusColor(job.status)} variant='flat'>
                      {job.status.toUpperCase()}
                    </Chip>
                  </div>
                  <div className='flex gap-1'>
                    <p className='font-semibold text-default-400 text-small'>4</p>
                    <p className='text-default-400 text-small'>Application</p>
                  </div>
                  <div className='flex gap-1'>
                    <p className='text-default-400 text-small'>Created</p>
                    <p className='font-semibold text-default-400 text-small'>10 Jan 2204</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
            <Pagination isCompact showControls showShadow page={page} total={pages} onChange={(page) => setPage(page)} />
            <SendInvitationDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} jobId={selectedJobId} />
          </div>
        )}
      </div>
      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelDelete} title='Confirm Deletion' description='Are you sure you want to delete this job?' onConfirm={handleConfirmDelete} confirmButtonText='Delete' cancelButtonText='Cancel' />
    </div>
  );
}
