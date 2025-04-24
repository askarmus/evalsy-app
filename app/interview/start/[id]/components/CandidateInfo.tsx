import { Avatar, Chip } from "@heroui/react";
import React from "react";

const CandidateInfo: React.FC<any> = ({ candidate, job, addTopPadding = true }) => {
  return (
    <div className={`p-6 ${addTopPadding ? "pt-6" : "pt-0"} border-b border-gray-200 dark:border-gray-700 w-full`}>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3'>
        <div className='flex items-center gap-4'>
          <Avatar name={candidate.name?.charAt(0) || "C"} className='w-12 h-12 text-lg hidden sm:flex' color='primary' />
          <div>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{candidate.name}</h2>
            <div className='flex items-center gap-3 mt-0'>
              <p className='text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1'>{candidate.email}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-4 md:items-center'>
          <div className='flex flex-col'>
            <span className='text-xs text-gray-500 dark:text-gray-400'>Interviewing Position</span>
            <Chip size='sm' className='mt-2' color='primary' variant='faded'>
              {job.jobTitle}
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateInfo;
