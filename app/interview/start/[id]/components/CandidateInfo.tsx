import { Chip } from '@heroui/react';
import React from 'react';
import InterviewTimer from './InterviewTimer';
import { useInterviewStore } from '../stores/useInterviewStore';
import { Building, Clock, User } from 'lucide-react';

const CandidateInfo: React.FC<any> = ({ job, addTopPadding = true }) => {
  const { phase, duration, company, candidate } = useInterviewStore();
  return (
    <div className="flex justify-between items-start w-full  ">
      <div className={`flex flex-col p-4   w-full`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100"> {job.jobTitle}</h2>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600 ">
                <Chip variant="flat" size="sm" startContent={<Clock className="w-4 h-4 mr-1 text-secondary  " />}>
                  {duration / 60} minutes
                </Chip>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Chip variant="flat" size="sm" startContent={<Building className="w-4 h-4 mr-1  text-secondary" />}>
                  {company?.name}
                </Chip>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Chip variant="flat" size="sm" startContent={<User className="w-4 h-4 mr-1  text-secondary" />}>
                  {candidate?.name}
                </Chip>
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
