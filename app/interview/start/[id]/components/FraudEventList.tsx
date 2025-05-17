// components/FraudEventList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

interface FraudEvent {
  type: string;
  timestamp: number;
  details?: string;
}

interface Props {
  invitationId: string;
}

const FraudEventList: React.FC<Props> = ({ invitationId }) => {
  const [events, setEvents] = useState<FraudEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<FraudEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`/api/interview/fraud-events?invitationId=${invitationId}`);
        const eventData = res.data.events || [];
        setEvents(eventData);
        setFilteredEvents(eventData);
      } catch (err: any) {
        setError('Failed to fetch fraud events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [invitationId]);

  useEffect(() => {
    const filtered = events.filter((event) => event.type.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredEvents(filtered);
    setPage(1); // reset to first page on search
  }, [searchTerm, events]);

  const paginatedEvents = filteredEvents.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-6 border p-4 rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Fraud Detection Logs</h3>

      <Input label="Search by Event Type" placeholder="e.g. TAB_SWITCH" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-4" />

      <Table aria-label="Fraud Detection Table">
        <TableHeader>
          <TableColumn>Type</TableColumn>
          <TableColumn>Time</TableColumn>
          <TableColumn>Details</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No fraud events to display.'}>
          {paginatedEvents.map((event, index) => (
            <TableRow key={index}>
              <TableCell>{event.type}</TableCell>
              <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
              <TableCell>{event.details || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-end">
        <Pagination page={page} total={Math.ceil(filteredEvents.length / rowsPerPage)} onChange={setPage} showControls color="primary" />
      </div>
    </div>
  );
};

export default FraudEventList;
