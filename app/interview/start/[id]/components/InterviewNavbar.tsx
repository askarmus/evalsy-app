import React from 'react';
import { Divider } from '@heroui/react';
import InterviewTimer from './InterviewTimer';
import { useInterviewStore } from '../stores/useInterviewStore';

const InterviewNavbar: React.FC<any> = ({ company }) => {
  const { phase } = useInterviewStore();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className="font-bold">{company?.name}</div>
        <Divider orientation="vertical" className="h-8 mr-2 ml-2" />
        <div className=" max-w-md mx-auto">
          <h2 className="text-xs font-bold  mb-0">Round One</h2>
          <p className="text-xs">Technical Interview</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {phase === 'in-progress' && (
          <>
            <InterviewTimer />
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewNavbar;
