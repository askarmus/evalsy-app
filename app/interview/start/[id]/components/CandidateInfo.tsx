import { Avatar, Chip } from "@heroui/react";
import React from "react";
import UserCamera from "./UserCamera";

const CandidateInfo: React.FC<any> = ({ candidate, job, addTopPadding = true, currentQuestion, questions }) => {
  return (
    <div className='flex justify-between items-start w-full border-b border-gray-200 dark:border-gray-700'>
      {/* Left Content: Candidate Info */}
      <div className={`flex flex-col p-6 ${addTopPadding ? "pt-6" : "pt-0"} w-full`}>
        <div className='flex justify-between items-start'>
          <div className='flex gap-4 items-start'>
            <Avatar name={candidate.name?.charAt(0) || "C"} className='w-12 h-12 text-lg hidden sm:flex' color='primary' />
            <div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>{candidate.name}</h2>
              <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>{candidate.email}</p>
            </div>
          </div>
          <div className='text-right'>
            <span className='text-xs text-gray-500 dark:text-gray-400 block'>Interviewing Position</span>
            <Chip size='sm' className='mt-2' color='primary' variant='faded'>
              {job.jobTitle}
            </Chip>
          </div>
        </div>
      </div>

      {questions && questions[currentQuestion]?.type === "coding" && (
        <div>
          <UserCamera hideRecLabel={false} height='100px' />
        </div>
      )}
    </div>
  );
};

export default CandidateInfo;
