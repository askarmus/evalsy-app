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
} from "@nextui-org/react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { AiFillDelete } from "react-icons/ai";

import { AddUser } from "./add-user";
import apiClient from "@/helpers/apiClient";

export default function Accounts() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [jobs, setJobs] = useState([]);
  const rowsPerPage = 10;
  const loadingState = isLoading || jobs?.length === 0 ? "loading" : "idle";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(
          "http://localhost:5000/job/getall"
        );
        const jobs = response.data.data;
        const formattedUsers = jobs.map((job: any) => ({
          key: job.id,
          jobTitle: job.jobTitle,
          experienceLevel: job.experienceLevel,
          status: job.status,
        }));
        setJobs(formattedUsers);
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
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Job</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>List</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All Accounts</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search users"
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddUser />
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <div className=" w-full flex flex-col gap-4">
          <Table
            aria-label="Example table with client side pagination"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader>
              <TableColumn key="name">TITLE</TableColumn>
              <TableColumn key="role">ROLE</TableColumn>
              <TableColumn key="status">STATUS</TableColumn>
              <TableColumn key="status" align="end">
                {""}
              </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={"No jobs found"}
              items={items}
              loadingContent={<Spinner />}
              loadingState={loadingState}
            >
              {(item: any) => (
                <TableRow key={item.key}>
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="text-bold text-small">
                        {" "}
                        <strong>{item.jobTitle}</strong>
                      </p>
                      <p className="text-bold text-tiny capitalize text-default-400">
                        Development
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>zzzz</TableCell>
                  <TableCell>
                    <Chip size="sm" color={getStatusColor(item.status)}>
                      {item.status.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Button color="default" radius="full">
                      Invite
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
