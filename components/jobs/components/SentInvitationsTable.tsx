import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  Pagination,
} from "@nextui-org/react";

export interface Invitation {
  id: string;
  name: string;
  email: string;
  message: string;
  expires: string;
}

interface SentInvitationsTableProps {
  invitations: Invitation[];
}

export const SentInvitationsTable: React.FC<SentInvitationsTableProps> = ({
  invitations,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // Number of rows per page

  // Filter invitations based on the search value
  const filteredInvitations = useMemo(() => {
    return invitations.filter(
      (invitation) =>
        invitation.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        invitation.email.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, invitations]);

  // Calculate paginated invitations
  const paginatedInvitations = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredInvitations.slice(start, end);
  }, [page, filteredInvitations]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <Input
        placeholder="Search invitations..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      {/* Table */}
      <Table aria-label="Sent Invitations">
        <TableHeader>
          <TableColumn>#</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Expires</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No invitations to display."}>
          {paginatedInvitations.map((invitation, index) => (
            <TableRow key={invitation.id}>
              <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
              <TableCell>{invitation.name}</TableCell>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                {new Date(invitation.expires).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {paginatedInvitations.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            total={Math.ceil(filteredInvitations.length / rowsPerPage)}
            page={page}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </div>
  );
};
