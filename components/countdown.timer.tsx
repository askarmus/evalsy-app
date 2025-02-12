"use client";

import { showToast } from "@/app/utils/toastUtils";
import React, { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

interface CountdownTimerProps {
  totalMinutes: number;
  startTime: string;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ totalMinutes, startTime, onComplete }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Convert startTime from string to Date object
  const startDateTime = new Date(startTime);
  const expiryDateTime = new Date(startDateTime.getTime() + totalMinutes * 60 * 1000);

  useEffect(() => {
    const updateRemainingTime = () => {
      const now = new Date();
      const timeLeft = Math.max((expiryDateTime.getTime() - now.getTime()) / 1000, 0);
      setRemainingSeconds(Math.floor(timeLeft));

      if (timeLeft <= 0) {
        onComplete(); // Trigger onComplete when time is up
      }
    };

    // Initial call to set remaining time
    updateRemainingTime();

    // Update every second
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [startTime, totalMinutes]);

  // Show warning when 25% of time is left
  useEffect(() => {
    if (remainingSeconds <= totalMinutes * 60 * 0.25 && remainingSeconds > 0) {
      showToast.error(`You have ${Math.floor(remainingSeconds / 60)} minutes remaining!`);
    }
  }, [remainingSeconds, totalMinutes]);

  // Convert remainingSeconds to hours, minutes, and seconds
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className='p-4 whitespace-nowrap'>
      <span className='text-2xl font-semibold w-32 font-mono tabular-nums text-right inline-block align-middle'>
        {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

export default CountdownTimer;
