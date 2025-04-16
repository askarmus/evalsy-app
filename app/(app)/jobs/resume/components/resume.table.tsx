// app/jobs/components/resume.table.tsx
"use client";

import { FC } from "react";
import { Button, Pagination, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { AiOutlineDelete, AiOutlineFilePdf, AiOutlineFileWord, AiFillFileUnknown, AiOutlineRight } from "react-icons/ai";
import DateFormatter from "@/app/utils/DateFormatter";
import { truncateText } from "@/app/utils/truncate.text";

interface ResumeTableProps {
  resumes: any[];
  files: any[];
  loadingResults: { [key: string]: boolean };
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  onViewDetails: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
  onRetryUpload: (file: File) => void;
}

const getIcon = (filename: string) => {
  if (filename.includes(".pdf")) return <AiOutlineFilePdf />;
  if (filename.includes(".doc")) return <AiOutlineFileWord />;
  return <AiFillFileUnknown />;
};

const ResumeTable: FC<ResumeTableProps> = ({ resumes, files, loadingResults, currentPage, totalPages, setCurrentPage, onViewDetails, onDelete, onRetryUpload }) => {
  return (
    <Table
      aria-label='Uploaded resumes'
      bottomContent={
        <div className='flex w-full justify-center'>
          <Pagination isCompact showControls showShadow color='primary' page={currentPage} total={totalPages} onChange={setCurrentPage} />
        </div>
      }>
      <TableHeader>
        <TableColumn>FILE</TableColumn>
        <TableColumn>CANDIDATE</TableColumn>
        <TableColumn>TOTAL EXP</TableColumn>
        <TableColumn>RELEVANT EXP</TableColumn>
        <TableColumn>MATCH %</TableColumn>
        <TableColumn>CREATED</TableColumn>
        <TableColumn align='end'>{""}</TableColumn>
        <TableColumn align='end' width={5}>
          {""}
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No resumes found"}>
        {resumes.map((resume, i) => (
          <TableRow key={i}>
            <TableCell className='flex items-center gap-2 font-medium'>
              {getIcon(resume.name)}
              <a href={resume.url} download={resume.name} className='text-blue-600 hover:underline'>
                {truncateText(resume.name, 40)}
              </a>
            </TableCell>
            <TableCell>{resume.analysisResults?.name ?? "N/A"}</TableCell>
            <TableCell>{resume.analysisResults?.total_experience ?? "N/A"}</TableCell>
            <TableCell>{resume.analysisResults?.relevant_experience ?? "N/A"}</TableCell>
            <TableCell>{resume.analysisResults?.match_score ?? "N/A"}</TableCell>
            <TableCell>{DateFormatter.formatDate(resume.createdAt)}</TableCell>
            <TableCell align='right' style={{ width: "150px", minWidth: "150px" }}>
              {resume.status === "processed" ? (
                <Button color='primary' endContent={<AiOutlineRight />} isLoading={loadingResults[resume.resumeId]} onPress={() => onViewDetails(resume.resumeId)} radius='full' size='sm'>
                  {loadingResults[resume.resumeId] ? "Loading.." : "View Analysis"}
                </Button>
              ) : resume.status === "uploading" ? (
                <Progress value={resume.progress} size='sm' radius='sm' label={`${resume.progress}%`} />
              ) : resume.status === "uploaded" ? (
                <Button size='sm' color='primary' variant='bordered' isLoading={true}>
                  Analyzing...
                </Button>
              ) : resume.status === "error" ? (
                <Button
                  size='sm'
                  variant='flat'
                  onPress={() => {
                    const fileFromList = files.find((f) => f.resumeId === resume.resumeId)?.file;
                    if (fileFromList) onRetryUpload(fileFromList);
                  }}>
                  Retry
                </Button>
              ) : (
                resume.status
              )}
            </TableCell>
            <TableCell>
              <Tooltip content='Delete Resume'>
                <Button isIconOnly aria-label='Delete' onPress={() => onDelete(resume.resumeId)} size='sm' color='danger' variant='bordered'>
                  <AiOutlineDelete />
                </Button>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ResumeTable;
