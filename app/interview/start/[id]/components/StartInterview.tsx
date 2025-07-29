'use client';

import React, { useEffect, useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import InterviewInstruction from './InterviewInstruction';
import InterviewLoadingSkelton from './InterviewLoadingSkelton';
import NotFound from '@/app/not-found';
import InterviewNavigator from './InterviewNavigator';
import ThankYou from './ThankYou';
import MobileWarning from './MobileWarning';

const StartInterview: React.FC = () => {
  const { phase } = useInterviewStore();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  if (isMobile) return <MobileWarning />;

  return (
    <div>
      {phase === 'skeleton-loading' && <InterviewLoadingSkelton />}
      {phase === 'not-started' && <InterviewInstruction />}
      {phase === 'in-progress' && <InterviewNavigator />}
      {(phase === 'completed' || phase === 'time-up') && <ThankYou />}
      {phase === 'expired' && <ThankYou />}
    </div>
  );
};

export default StartInterview;
