import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Input, Pagination } from "@heroui/react";
import Link from "next/link";
import DateFormatter from "@/app/utils/DateFormatter";

export interface Invitation {
  id: string;
  name: string;
  email: string;
  sentOn: string;
}

interface SentInvitationsTableProps {
  invitations: Invitation[];
}

export const SentInvitationsTable: React.FC<SentInvitationsTableProps> = ({ invitations }) => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  // Filter invitations based on the search value
  const filteredInvitations = useMemo(() => {
    // Filter invitations based on the search value
    const filtered = invitations.filter((invitation) => invitation.name.toLowerCase().includes(searchValue.toLowerCase()) || invitation.email.toLowerCase().includes(searchValue.toLowerCase()));

    // Sort invitations by 'sentOn' in descending order (latest first)
    return filtered.sort((a, b) => new Date(b.sentOn).getTime() - new Date(a.sentOn).getTime());
  }, [searchValue, invitations]);

  // Calculate paginated invitations
  const paginatedInvitations = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredInvitations.slice(start, end);
  }, [page, filteredInvitations]);

  return (
    <div className='flex flex-col gap-4'>
      {/* Search Input */}
      <Input placeholder='Search invitations...' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />

      {/* Table */}
      <Table shadow='sm' radius='sm' aria-label='Sent Invitations'>
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Sent On</TableColumn>
          <TableColumn>{""}</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No invitations to display."} loadingContent='Loading invitations... '>
          {paginatedInvitations.map((invitation, index) => (
            <TableRow key={invitation.id}>
              <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
              <TableCell>{invitation.name}</TableCell>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>{DateFormatter.formatDate(invitation.sentOn, true)}</TableCell>
              <TableCell>
                <Link target='_blank' href={`/interview/start/${invitation.id}`}>
                  Start
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {paginatedInvitations.length > 0 && (
        <div className='flex justify-center'>
          <Pagination showControls color='default' size='sm' total={Math.ceil(filteredInvitations.length / rowsPerPage)} page={page} onChange={(page) => setPage(page)} />
        </div>
      )}
    </div>
  );
};
