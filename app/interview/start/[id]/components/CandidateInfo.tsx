import { Chip } from '@heroui/react';
import React from 'react';
import InterviewTimer from './InterviewTimer';
import { useInterviewStore } from '../stores/useInterviewStore';
import { FaBriefcase } from 'react-icons/fa';
import { Building, Clock, User } from 'lucide-react';

const CandidateInfo: React.FC<any> = ({ job, addTopPadding = true }) => {
  const { phase, duration, company } = useInterviewStore();
  return (
    <div className="flex justify-between items-start w-full  ">
      <div className={`flex flex-col p-4   w-full`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100"> {job.jobTitle}</h2>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1 text-[#3534ff]" />
                Duration: {duration / 60} minutes
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Building className="w-4 h-4 mr-1 text-[#3534ff]" />
                {company?.name}
              </div>
            </div>
          </div>
          <div className="text-right">
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
