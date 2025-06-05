'use client';

import React from 'react';
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';

interface ShortlistedCandidate {
  id: string;
  name: string;
  position: string;
  interviewDate: string;
  status: string;
  score: number;
}

const ShortlistedCandidates = () => {
  // TODO: Add state management and data fetching logic
  const candidates: ShortlistedCandidate[] = [];

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[80rem] mx-auto w-full">
      <Card className="p-4" shadow="none">
        <CardBody>
          <h1 className="text-2xl font-semibold mb-6">Shortlisted Candidates</h1>
          
          <Table aria-label="Shortlisted candidates table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>POSITION</TableColumn>
              <TableColumn>INTERVIEW DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>SCORE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>{candidate.interviewDate}</TableCell>
                  <TableCell>{candidate.status}</TableCell>
                  <TableCell>{candidate.score}</TableCell>
                   
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ShortlistedCandidates; 