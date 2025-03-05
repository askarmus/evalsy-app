import React, { useEffect } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";

const InterviewTimer: React.FC = () => {
  const { timeLeft, setTimeLeft, phase, duration } = useInterviewStore();

  useEffect(() => {
    if (phase !== "in-progress" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, phase, setTimeLeft, duration]);

  return (
    <div className='p-4 whitespace-nowrap'>
      <span className='text-1xl font-semibold  font-mono tabular-nums text-right inline-block align-middle'>
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </span>
    </div>
  );
};

export default InterviewTimer;
