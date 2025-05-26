import { Avatar, Chip } from '@heroui/react';
import React from 'react';
import InterviewTimer from './InterviewTimer';
import { useInterviewStore } from '../stores/useInterviewStore';
import { Logo } from '@/components/shared/logo';
import { FaBriefcase, FaBuilding } from 'react-icons/fa';

const CandidateInfo: React.FC<any> = ({ candidate, company, job, addTopPadding = true }) => {
  const { phase } = useInterviewStore();
  return (
    <div className="flex justify-between items-start w-full  ">
      {/* Left Content: Candidate Info */}
      <div className={`flex flex-col p-6   w-full`}>
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-start">
            <img src="/logo-icon.png" className="max-h-[25px] " alt="evalsy Logo" /> <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">AI Interview</h2>
            <Chip size="sm" color="default" variant="bordered" startContent={<FaBriefcase className="ml-1" />}>
              {job.jobTitle}
            </Chip>{' '}
          </div>

          <div>
            {phase === 'in-progress' && (
              <>
                <InterviewTimer />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateInfo;
