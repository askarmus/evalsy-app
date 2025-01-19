"use client";
import {
  Button,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Avatar,
} from "@heroui/react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getAllJobs } from "@/services/job.service";
import { SendInvitationDrawer } from "./send-invitation";
import { Breadcrumb } from "../bread.crumb";
import { AiOutlineMore } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function Jobs() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [jobs, setJobs] = useState([]);
  const rowsPerPage = 5;
  const loadingState = isLoading || jobs?.length === 0 ? "loading" : "idle";
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const handleInviteClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedJobId(null);
    setDrawerOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const jobs = await getAllJobs();

        setJobs(jobs);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return jobs.filter((user: any) =>
      user.jobTitle.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, jobs]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const statusColorMap: Record<
    string,
    "secondary" | "default" | "primary" | "success" | "warning" | "danger"
  > = {
    draft: "default",
    published: "success",
    paused: "warning",
    expired: "secondary",
    closed: "danger",
    deleted: "danger",
  };

  const getStatusColor = (
    status: string
  ): "secondary" | "default" | "primary" | "success" | "warning" | "danger" => {
    return statusColorMap[status] || "default"; // Fallback to "default" for invalid statuses
  };

  const onSearchChange = useCallback((value: any) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">All Jobs</h3>
      <Breadcrumb />

      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search jobs"
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button
            color="danger"
            variant="faded"
            size="md"
            onPress={() => router.push("/jobs/add")}
          >
            Add Job
          </Button>
        </div>
      </div>
      <div className="max-w-[90rem] mx-auto w-full">
        <div className=" w-full flex flex-col gap-4">
          {items.map((question: any) => (
            <Card key={question.id}>
              <CardHeader className="justify-between">
                <div className="flex gap-5">
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {question.jobTitle}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      {question.experienceLevel}
                    </h5>
                  </div>
                </div>

                <div className="gap-3">
                  <Button
                    color="warning"
                    variant="faded"
                    className="mr-3"
                    size="sm"
                    onPress={() => handleInviteClick(question.id)}
                  >
                    Invite Candidate
                  </Button>
                  <Button isIconOnly size="sm" color="warning" variant="faded">
                    <AiOutlineMore />
                  </Button>
                </div>
              </CardHeader>
              <CardFooter className="gap-3">
                <div className="flex gap-1">
                  <Chip
                    size="sm"
                    color={getStatusColor(question.status)}
                    variant="flat"
                  >
                    {question.status.toUpperCase()}
                  </Chip>
                </div>
                <div className="flex gap-1">
                  <p className="font-semibold text-default-400 text-small">4</p>
                  <p className=" text-default-400 text-small">Application</p>
                </div>
                <div className="flex gap-1">
                  <p className="text-default-400 text-small">Created</p>
                  <p className="font-semibold text-default-400 text-small">
                    10 Jan 2204
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
          <Pagination
            isCompact
            showControls
            showShadow
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />

          <SendInvitationDrawer
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            jobId={selectedJobId}
          />
        </div>
      </div>
    </div>
  );
}
