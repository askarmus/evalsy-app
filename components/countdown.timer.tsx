"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useTimer } from "react-timer-hook";

interface CountdownTimerProps {
  totalMinutes: number; // Total duration in minutes
  startTime: string; // Start time in ISO format (e.g., "2024-02-01T10:00:00Z")
  onComplete: () => void; // Callback when time is up
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  totalMinutes,
  startTime,
  onComplete,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const startDateTime = new Date(startTime);
  const expiryDateTime = new Date(
    startDateTime.getTime() + totalMinutes * 60 * 1000
  );

  useEffect(() => {
    const now = new Date();
    const timeLeft = Math.max(
      (expiryDateTime.getTime() - now.getTime()) / 1000,
      0
    );
    setRemainingSeconds(Math.floor(timeLeft));
  }, [startTime, totalMinutes]);

  const { seconds, minutes, isRunning } = useTimer({
    expiryTimestamp: expiryDateTime,
    autoStart: true,
    onExpire: () => {
      alert("Interview time is over!");
      onComplete();
    },
  });

  useEffect(() => {
    if (remainingSeconds <= totalMinutes * 60 * 0.25 && remainingSeconds > 0) {
      alert(`You have ${Math.floor(remainingSeconds / 60)} minutes remaining!`);
    }
  }, [remainingSeconds, totalMinutes]);

  return (
    <div className="p-4   whitespace-nowrap">
      <span className="text-2xl text-gray-700 inline-block align-middle">
        <AiOutlineClockCircle />
      </span>
      <span className="text-3xl font-bold w-24 font-mono tabular-nums text-right inline-block align-middle">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
      {isRunning && (
        <p className="text-red-500 font-bold ml-4 inline-block align-middle">
          Time is up!
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;
