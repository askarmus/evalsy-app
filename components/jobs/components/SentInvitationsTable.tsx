import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
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
  return (
    <Table aria-label="Sent Invitations">
      <TableHeader>
        <TableColumn>#</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>Message</TableColumn>
        <TableColumn>Expires</TableColumn>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation, index) => (
          <TableRow key={invitation.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{invitation.name}</TableCell>
            <TableCell>{invitation.email}</TableCell>
            <TableCell>{invitation.message}</TableCell>
            <TableCell>
              {new Date(invitation.expires).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
