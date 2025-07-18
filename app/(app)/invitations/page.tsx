'use client';

import { Table, TableBody, TableCell, TableHeader, TableRow, TableColumn, Pagination, Input, DateRangePicker, RangeValue, CardBody, Card, Chip, Button } from '@heroui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SendInvitationDrawer } from '@/components/jobs/send-invitation';
import { getAllInvitation } from '@/services/invitation.service';
import { DateValue, parseDate } from '@internationalized/date';
import DateFormatter from '@/app/utils/DateFormatter';
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlinePlayCircle, AiOutlineSend, AiOutlineStop } from 'react-icons/ai';

interface Job {
  id: string;
  jobTitle: string;
  experienceLevel: string;
  durationInMinutes: number;
}

interface Invitation {
  id: string;
  name: string;
  email: string;
  sentOn: string;
  job: Job;
  statusUpdateAt: string;
  status: string;
  expire: string;
}

export default function Invitations() {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 8;
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchInvitations = async () => {
      setIsLoading(true);
      try {
        const data = await getAllInvitation();
        setInvitations(data);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      }
      setIsLoading(false);
    };
    fetchInvitations();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, dateRange]);

  const filteredData = useMemo(() => {
    return invitations.filter((inv) => {
      const matchesSearch = inv.name.toLowerCase().includes(searchTerm.toLowerCase()) || inv.email.toLowerCase().includes(searchTerm.toLowerCase()) || inv.job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const sentDate = new Date(inv.sentOn);
      const withinDateRange = !dateRange || (dateRange.start && dateRange.end && sentDate >= new Date(dateRange.start.toString()) && sentDate <= new Date(dateRange.end.toString()));

      return matchesSearch && withinDateRange;
    });
  }, [invitations, searchTerm, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleInviteClick = (jobId: string | null) => {
    setSelectedJobId(jobId);
    setDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'default';
      case 'started':
        return 'primary';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const isExpired = (expire: string, statusUpdateAt: string | null | undefined) => {
    if (!expire || statusUpdateAt) return false;
    const now = new Date();
    const expiryDate = new Date(expire);
    return expiryDate < now;
  };

  const handleCloseDrawer = () => {
    setSelectedJobId(null);
    setDrawerOpen(false);
  };

  const pendingCount = filteredData.filter((i) => i.status.toLowerCase() === 'pending').length;
  const startedCount = filteredData.filter((i) => i.status.toLowerCase() === 'started').length;
  const completedCount = filteredData.filter((i) => i.status.toLowerCase() === 'completed').length;
  const expiredCount = filteredData.filter((i) => isExpired(i.expire, i.statusUpdateAt)).length;

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[80rem] mx-auto w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-xl font-semibold">All Invitations</h3>
        <Button color="primary" className=" text-white  bg-[#100145] " size="sm" onPress={() => handleInviteClick(null)} endContent={<AiOutlineSend />}>
          Send Invitation
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        {/* Pending */}

        <Card>
          <CardBody>
            <div className="flex items-center justify-between  ">
              <div className="flex items-center gap-2">
                <AiOutlineClockCircle className="text-yellow-500 text-lg" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{pendingCount}</span>
            </div>
          </CardBody>
        </Card>

        {/* Started */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between  ">
              <div className="flex items-center gap-2">
                <AiOutlinePlayCircle className="text-blue-500 text-lg" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Started</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{startedCount}</span>
            </div>
          </CardBody>
        </Card>
        {/* Completed */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <AiOutlineCheckCircle className="text-green-500 text-lg" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{completedCount}</span>
            </div>
          </CardBody>
        </Card>

        {/* Expired */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <AiOutlineStop className="text-red-500 text-lg" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Expired</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{expiredCount}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Input labelPlacement="outside" label="Search By" variant="bordered" placeholder="Search by name, email, or job title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <DateRangePicker variant="bordered" labelPlacement="outside" label="Filter by Sent Date" value={dateRange} onChange={setDateRange} />
      </div>

      <div className="  ">
        <Table>
          <TableHeader>
            <TableColumn>ROLE</TableColumn>

            <TableColumn>DURATION</TableColumn>
            <TableColumn>SENT ON</TableColumn>
            <TableColumn>EXPIRE</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>STATUS UPDATED </TableColumn>
          </TableHeader>
          <TableBody isLoading={isLoading}>
            {paginatedData.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize"> {invitation.name}</p>
                    <p className="text-bold text-sm capitalize text-default-400"> {invitation.job.jobTitle}</p>
                  </div>
                </TableCell>

                <TableCell>{invitation.job.durationInMinutes} min</TableCell>
                <TableCell> {DateFormatter.formatDate(invitation.sentOn)}</TableCell>
                <TableCell>
                  {isExpired(invitation.expire, invitation.statusUpdateAt) ? (
                    <Chip color="danger" size="sm" variant="flat">
                      Expired
                    </Chip>
                  ) : (
                    DateFormatter.formatDate(invitation.expire)
                  )}
                </TableCell>

                <TableCell>
                  <Chip className="capitalize" color={getStatusColor(invitation.status)} size="sm" variant="flat">
                    {invitation?.status}
                  </Chip>
                </TableCell>
                <TableCell> {invitation.statusUpdateAt ? new Date(invitation.statusUpdateAt).toLocaleString() : '--'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Pagination
          color="primary"
          classNames={{
            item: 'w-8 h-8 text-small bg-red  ',
            cursor: 'bg-[#100145]    ',
          }}
          size="sm"
          total={totalPages}
          page={page}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>

      <SendInvitationDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} jobId={selectedJobId} />
    </div>
  );
}
