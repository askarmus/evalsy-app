"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Button,
  Input,
  Pagination,
  Progress,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Breadcrumb } from "@/components/bread.crumb";
import { getAllInterviewResult } from "@/services/interview.service";
import { ViewResultDrawer } from "./components/view.result.drawer";

export default function InterviewResultList() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [interviewers, setInterviewers] = useState([]);
  const rowsPerPage = 10;
  const [selectedInterviewerId, setSelectedInterviewerId] = useState<
    string | null
  >(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleAddClick = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const fetchInterviewResult = async () => {
    const data = await getAllInterviewResult();
    setInterviewers(data);
    setIsLoading(false);
  };
  const handleRefreshTable = () => {
    fetchInterviewResult();
  };

  useEffect(() => {
    fetchInterviewResult();
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
      <h3 className="text-xl font-semibold">Interview Result</h3>
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
            placeholder="Search candidate"
          />
        </div>
      </div>
      <div className="max-w-[90rem] mx-auto w-full">
        <div className=" w-full flex flex-col gap-4">
          <Table
            aria-label="Example table with client-side pagination"
            classNames={{
              wrapper: "min-h-[222px]",
            }}
          >
            <TableHeader>
              <TableColumn key="name">CANDIDATE NAME</TableColumn>
              <TableColumn key="title">JOB TITLE</TableColumn>
              <TableColumn key="completed">COMPLETED</TableColumn>
              <TableColumn key="weight">OVERALL WEIGHT</TableColumn>

              <TableColumn key="status">STATUS</TableColumn>

              <TableColumn key="action">{""}</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={"No interview result found"}
              items={items}
              loadingContent={<Spinner />}
              isLoading={isLoading}
            >
              {(item: any) => (
                <TableRow key={item.interviewResultId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.jobTitle}</TableCell>
                  <TableCell>{item.startedAt}</TableCell>

                  <TableCell>
                    <Progress color="success" value={70} />
                  </TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell align="right">
                    <Button
                      onPress={handleAddClick}
                      className="bg-black text-white"
                    >
                      VIEW MORE
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
          <ViewResultDrawer
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
            invitationId={selectedInterviewerId}
          />
        </div>
      </div>
    </div>
  );
}
