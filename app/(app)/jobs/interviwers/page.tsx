"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  User,
} from "@heroui/react";
import Link from "next/link";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { getAllInterviewers } from "@/services/interviwers.service";
import { AddInterviewer } from "@/components/interviwers/add.interviewer";
import { AiFillEdit } from "react-icons/ai";
import { showToast } from "@/app/utils/toastUtils";
import { Breadcrumb } from "@/components/bread.crumb";

export default function InterviewerManagement() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [interviewers, setInterviewers] = useState([]);
  const rowsPerPage = 10;
  const loadingState =
    isLoading || interviewers?.length === 0 ? "loading" : "idle";
  const [selectedInterviewerId, setSelectedInterviewerId] = useState<
    string | null
  >(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleAddClick = () => {
    setSelectedInterviewerId(null); // Reset selected interviewer
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedInterviewerId(null);
    setDrawerOpen(false);
  };

  const handleEditClick = (id: string) => {
    setSelectedInterviewerId(id);
    setDrawerOpen(true);
  };
  const fetchInterviewers = async () => {
    const data = await getAllInterviewers();
    setInterviewers(data);
    setIsLoading(false);
  };
  const handleRefreshTable = () => {
    fetchInterviewers();
  };

  useEffect(() => {
    fetchInterviewers();
  }, []);

  const filteredItems = useMemo(() => {
    return interviewers.filter((interviewer: any) =>
      interviewer.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, interviewers]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const onSearchChange = useCallback((value: any) => {
    setFilterValue(value);
    setPage(1);
  }, []);

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4">
      <Breadcrumb />
      <h3 className="text-xl font-semibold">All Interviewers</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search interviewers"
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button onPress={handleAddClick} className="bg-black text-white">
            Add Interviewer
          </Button>
        </div>
      </div>
      <div className="max-w-[90rem] mx-auto w-full">
        <div className=" w-full flex flex-col gap-4">
          <Table
            aria-label="Example table with client-side pagination"
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
              <TableColumn key="name">NAME</TableColumn>
              <TableColumn key="jobTitle">JOB TITLE</TableColumn>
              <TableColumn key="status">STATUS</TableColumn>
              <TableColumn key="action" align="end">
                {""}
              </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={"No interviewers found"}
              items={items}
              loadingContent={<Spinner />}
              isLoading={isLoading}
            >
              {(item: any) => (
                <TableRow key={item.key}>
                  <TableCell>
                    <User
                      avatarProps={{ src: item.photoUrl }}
                      description={item.jobTitle}
                      name={item.name}
                    >
                      {item.name}
                    </User>
                  </TableCell>
                  <TableCell>{item.jobTitle}</TableCell>
                  <TableCell>
                    <Chip size="sm" color="success" variant="flat">
                      Active
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      endContent={<AiFillEdit />}
                      onPress={() => handleEditClick(item.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <AddInterviewer
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            interviewerId={selectedInterviewerId}
            onAddSuccess={handleRefreshTable} // Pass the refresh callback
          />
        </div>
      </div>
    </div>
  );
}
