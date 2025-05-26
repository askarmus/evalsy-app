import React, { useEffect } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';

const InterviewTimer: React.FC = () => {
  const { timeLeft, setTimeLeft, phase, duration } = useInterviewStore();

  useEffect(() => {
    if (phase !== 'in-progress' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      const newTime = Math.max(0, Math.floor(timeLeft - 1));
      setTimeLeft(newTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, phase, setTimeLeft]);

  const secondsLeft = Math.max(0, Math.floor(timeLeft));
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const percentageLeft = (secondsLeft / duration) * 100;

  return (
    <div className="flex items-center gap-2 w-full    ">
      {/* Clock Icon */}
      <div className="text-gray-600 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Time and Progress */}
      <div className="flex-1">
        {/* Time */}
        <div className="flex justify-between items-center">
          <p className="text-sm   font-bold">Interview Time Left</p>
          <span className="font-bold font-mono tabular-nums text-md w-[5.5ch] text-right">
            {minutes}:{seconds}
          </span>
        </div>

        {/* Progress Bar with Divided Fill */}
        <div className="mt-0 relative h-1 w-full bg-gray-300 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-green-600 transition-all duration-300" style={{ width: `${percentageLeft}%` }} />
          {/* Dividers at 25%, 50%, 75% */}
          <div className="absolute inset-0">
            <div className="absolute left-1/4 top-0 w-[1px] h-full bg-white/80" />
            <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/80" />
            <div className="absolute left-3/4 top-0 w-[1px] h-full bg-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTimer;
