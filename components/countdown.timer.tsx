"use client";

import { showToast } from "@/app/utils/toastUtils";
import React, { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useTimer } from "react-timer-hook";

interface CountdownTimerProps {
  totalMinutes: number;
  startTime: string;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ totalMinutes, startTime, onComplete }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  // Convert startTime from string to Date object
  const startDateTime = new Date(startTime);
  const expiryDateTime = new Date(startDateTime.getTime() + totalMinutes * 60 * 1000);

  useEffect(() => {
    const now = new Date();
    const timeLeft = Math.max((expiryDateTime.getTime() - now.getTime()) / 1000, 0);
    setRemainingSeconds(Math.floor(timeLeft));

    if (timeLeft === 0) {
      setIsExpired(true);
      onComplete(); // Trigger manually if expired
    }
  }, [startTime, totalMinutes]);

  const { seconds, minutes, isRunning } = useTimer({
    expiryTimestamp: expiryDateTime,
    autoStart: remainingSeconds > 0,
    onExpire: () => {
      if (!isExpired) {
        setIsExpired(true);
        onComplete();
      }
    },
  });

  useEffect(() => {
    if (remainingSeconds <= totalMinutes * 60 * 0.25 && remainingSeconds > 0) {
      showToast.error(`You have ${Math.floor(remainingSeconds / 60)} minutes remaining!`);
    }
  }, [remainingSeconds, totalMinutes]);

  return (
    <div className='p-4 whitespace-nowrap'>
      <span className='text-2xl text-gray-700 inline-block align-middle'>
        <AiOutlineClockCircle />
      </span>
      <span className='text-3xl font-bold w-24 font-mono tabular-nums text-right inline-block align-middle'>
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

export default CountdownTimer;
