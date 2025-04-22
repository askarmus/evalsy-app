"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button, Input, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Chip, User, Tooltip } from "@heroui/react";
import { deleteInterviewer, getAllInterviewers } from "@/services/interviwers.service";
import { AddInterviewer } from "@/components/interviwers/add.interviewer";
import { Breadcrumb } from "@/components/bread.crumb";
import ConfirmDialog from "@/components/ConfirmDialog";
import { AiFillEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { showToast } from "@/app/utils/toastUtils";
import NoDataTable from "@/components/shared/no.data.table";
import { FaUserAlt } from "react-icons/fa";

export default function InterviewerManagement() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [interviewers, setInterviewers] = useState([]);
  const rowsPerPage = 10;

  const [selectedInterviewerId, setSelectedInterviewerId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [interviewerToDelete, setInterviewerToDelete] = useState<string | null>(null);

  const breadcrumbItems = [
    { name: "Dashboard", link: "/" },
    { name: "Interviwers", link: "" },
  ];

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

  const handleRefreshTable = () => {
    fetchInterviewers();
  };

  const handleDeleteClick = (id: string) => {
    setInterviewerToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (interviewerToDelete) {
      try {
        await deleteInterviewer(interviewerToDelete);
        setInterviewerToDelete(null);
        fetchInterviewers();
        showToast.success("Interviewer deleted successfully.");
      } catch (error) {
        console.error("Error deleting interviewer:", error);
        showToast.error("Failed to delete the interviewer. Please try again.");
      } finally {
        setConfirmDialogOpen(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
    setInterviewerToDelete(null);
  };

  const fetchInterviewers = async () => {
    setIsLoading(true);
    const data = await getAllInterviewers();
    setInterviewers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInterviewers();
  }, []);

  const filteredItems = useMemo(() => {
    return interviewers.filter((interviewer: any) => interviewer.name.toLowerCase().includes(filterValue.toLowerCase()));
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
    <div className='my-10 px-4 lg:px-6 max-w-[90rem] mx-auto w-full flex flex-col gap-4'>
      <Breadcrumb items={breadcrumbItems} />
      <h3 className='text-xl font-semibold'>All Interviewers</h3>
      <div className='flex justify-between flex-wrap gap-4 items-center'>
        <div className='flex items-center gap-3 flex-wrap md:flex-nowrap'>
          <Input
            value={filterValue}
            onChange={(e) => onSearchChange(e.target.value)}
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder='Search interviewers'
          />
        </div>
        <div className='flex flex-row gap-3.5 flex-wrap'>
          <Button onPress={handleAddClick} color='primary' endContent={<AiOutlinePlus />}>
            Add New
          </Button>
        </div>
      </div>
      <div className='max-w-[90rem] mx-auto w-full'>
        <div className=' w-full flex flex-col gap-4'>
          <Table
            shadow='sm'
            radius='sm'
            bottomContent={
              <div className='flex w-full justify-center'>
                <Pagination showControls color='default' size='sm' page={page} total={pages} onChange={(page) => setPage(page)} />
              </div>
            }
            classNames={{
              wrapper: "min-h-[222px]",
            }}>
            <TableHeader>
              <TableColumn key='name'>NAME</TableColumn>
              <TableColumn key='jobTitle'>JOB TITLE</TableColumn>
              <TableColumn key='action' align='end'>
                {""}
              </TableColumn>
            </TableHeader>
            <TableBody items={items} isLoading={isLoading} loadingContent={<Spinner />} emptyContent={<NoDataTable icon={<FaUserAlt />} title='No interviewers available' description='Add an interviewer to see them listed here.' />}>
              {(item: any) => (
                <TableRow key={item.key}>
                  <TableCell>
                    <User avatarProps={{ src: item.photoUrl }} description={item.jobTitle} name={item.name}>
                      {item.name}
                    </User>
                  </TableCell>
                  <TableCell>{item.jobTitle}</TableCell>

                  <TableCell align='right'>
                    <div className='  gap-1'>
                      <Tooltip content='Edit'>
                        <Button isIconOnly aria-label='Edit' onPress={() => handleEditClick(item.id)} size='sm' color='default' variant='faded' className='mr-1'>
                          <AiFillEdit />
                        </Button>
                      </Tooltip>

                      <Tooltip content='Delete'>
                        <Button isIconOnly aria-label='Delete' onPress={() => handleDeleteClick(item.id)} size='sm' color='default' variant='faded'>
                          <AiOutlineDelete />
                        </Button>
                      </Tooltip>
                    </div>
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
          <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelDelete} title='Confirm Deletion' description='Are you sure you want to delete this interviewer?' onConfirm={handleConfirmDelete} confirmButtonText='Delete' cancelButtonText='Cancel' />
        </div>
      </div>
    </div>
  );
}
