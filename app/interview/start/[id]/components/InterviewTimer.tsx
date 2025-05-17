import React, { useEffect } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import { Button } from '@heroui/react';

const InterviewTimer: React.FC = () => {
  const { timeLeft, setTimeLeft, phase, duration } = useInterviewStore();

  useEffect(() => {
    if (phase !== 'in-progress' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, phase, setTimeLeft, duration]);

  return (
    <Button color="warning" radius="full" size="sm" variant="flat" className="flex items-center gap-2">
      {Math.floor(Math.max(0, Math.round(timeLeft) / 60))}:{String(Math.max(0, Math.round(timeLeft) % 60)).padStart(2, '0')}{' '}
    </Button>
  );
};

export default InterviewTimer;
