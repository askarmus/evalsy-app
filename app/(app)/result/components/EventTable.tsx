'use client';

import { Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import React, { useState, useMemo } from 'react';
import { FaFile } from 'react-icons/fa';

export type Event = {
  type: string;
  timestamp: number;
};

interface EventTableProps {
  data?: Event[] | null;
}

const ROWS_PER_PAGE = 5;

const EventTable: React.FC<EventTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const safeData = data ?? [];

  const filteredData = useMemo(() => {
    return safeData.filter((item) => item.type.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, safeData]);

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return filteredData.slice(start, start + ROWS_PER_PAGE);
  }, [page, filteredData]);

  return (
    <div>
      <Input
        isClearable
        label="Search by Type"
        placeholder="e.g., RIGHT_CLICK"
        className="mb-4"
        value={searchTerm}
        onValueChange={(val) => {
          setSearchTerm(val);
          setPage(1); // reset to first page on search
        }}
      />

      <Table aria-label="Event Table">
        <TableHeader>
          <TableColumn>Type</TableColumn>
          <TableColumn>Timestamp</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="flex flex-col items-center justify-center py-10 text-center text-default-500">
              <FaFile className="w-8 h-8 mb-2" />
              <p>No events found matching your search.</p>
            </div>
          }
        >
          {paginatedData.map((event, index) => (
            <TableRow key={index}>
              <TableCell>{event.type}</TableCell>
              <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination showControls total={totalPages} initialPage={1} page={page} onChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default EventTable;
