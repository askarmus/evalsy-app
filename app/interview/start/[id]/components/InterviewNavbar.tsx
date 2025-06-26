import React from 'react';
import { Divider } from '@heroui/react';
import InterviewTimer from './InterviewTimer';
import { useInterviewStore } from '../stores/useInterviewStore';

const InterviewNavbar: React.FC<any> = ({ company }) => {
  const { phase } = useInterviewStore();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className="font-bold text-xl">{company?.name}</div>
      </div>
    </div>
  );
};

export default InterviewNavbar;
