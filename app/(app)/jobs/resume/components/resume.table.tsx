// app/jobs/components/resume.table.tsx
"use client";

import { FC } from "react";
import { Button, Pagination, Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@heroui/react";
import { AiOutlineDelete, AiOutlineRight, AiOutlineDownload } from "react-icons/ai";
import DateFormatter from "@/app/utils/DateFormatter";

interface ResumeTableProps {
  resumes: any[];
  files: any[];
  loadingResults: { [key: string]: boolean };
  currentPage: number;
  totalPages: number;
  jobId: string;
  setCurrentPage: (page: number) => void;
  onViewDetails: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
  onRetryUpload: (file: File) => void;
}

const ResumeTable: FC<ResumeTableProps> = ({ resumes, files, loadingResults, currentPage, totalPages, jobId, setCurrentPage, onViewDetails, onDelete, onRetryUpload }) => {
  // Function to get recommendation badge style
  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation?.toLowerCase()) {
      case "strong":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "conditional":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "weak":
        return "bg-rose-50 text-rose-600 border border-rose-100";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-100";
    }
  };

  return (
    <>
      <Table shadow='sm' radius='sm' isVirtualized maxTableHeight={500} rowHeight={40} isHeaderSticky aria-label='Uploaded resumes'>
        <TableHeader>
          <TableColumn>CANDIDATE</TableColumn>
          <TableColumn>CURRENT ROLE</TableColumn>
          <TableColumn>TOTAL EXP</TableColumn>

          <TableColumn>HIRE RECOMMENDATION</TableColumn>
          <TableColumn>CREATED</TableColumn>
          <TableColumn align='end'>{""}</TableColumn>
          <TableColumn align='end' width={5}>
            {""}
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No resumes found"}>
          {resumes.map((resume, i) => (
            <TableRow key={i}>
              <TableCell>{resume.analysisResults?.candidateName ?? "N/A"}</TableCell>
              <TableCell>{resume.analysisResults?.currentRole?.trim() ? resume.analysisResults.currentRole : "N/A"}</TableCell>
              <TableCell>{resume.analysisResults?.totalExperience?.trim() ? resume.analysisResults.totalExperience : "N/A"}</TableCell>

              <TableCell>
                <div className='flex justify-center'>
                  <div className={`px-3 py-1 rounded-full border ${getRecommendationStyle(resume.analysisResults?.hireRecommendation)} font-medium capitalize`}>
                    {resume.analysisResults?.hireRecommendation} - {resume.analysisResults?.matchScore}
                  </div>
                </div>
              </TableCell>
              <TableCell>{DateFormatter.formatDate(resume.createdAt, true)}</TableCell>
              <TableCell align='right'>
                {resume.status === "processed" ? (
                  <Button color='default' endContent={<AiOutlineRight />} isLoading={loadingResults[resume.resumeId]} onPress={() => onViewDetails(resume.resumeId)} radius='full' variant='bordered' size='sm'>
                    {loadingResults[resume.resumeId] ? "Loading.." : "View Analysis"}
                  </Button>
                ) : resume.status === "uploading" ? (
                  <Progress value={resume.progress} size='sm' radius='sm' label={`${resume.progress}%`} />
                ) : resume.status === "uploaded" ? (
                  <Button size='sm' color='default' variant='faded' isLoading={true}>
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
                <div className='flex items-center gap-x-2'>
                  <Tooltip content='Delete Resume'>
                    <Button isIconOnly aria-label='Delete' onPress={() => onDelete(resume.resumeId)} size='sm' color='default' variant='bordered'>
                      <AiOutlineDelete />
                    </Button>
                  </Tooltip>

                  <Tooltip content='Download Resume'>
                    <Button
                      isIconOnly
                      aria-label='Download'
                      onPress={() => {
                        const link = document.createElement("a");
                        link.href = resume.url;
                        link.download = resume.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      size='sm'
                      color='default'
                      variant='bordered'>
                      <AiOutlineDownload />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ResumeTable;
