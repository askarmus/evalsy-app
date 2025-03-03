import React, { useEffect } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";

const InterviewTimer: React.FC = () => {
  const { timeLeft, setTimeLeft, phase, duration } = useInterviewStore();

  useEffect(() => {
    if (phase !== "in-progress" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (timeLeft === Math.floor(duration * 0.2)) {
      alert("⚠️ 80% of your interview time is completed!");
    }

    return () => clearInterval(timer);
  }, [timeLeft, phase, setTimeLeft, duration]);

  return (
    <div>
      <h3>
        Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </h3>
    </div>
  );
};

export default InterviewTimer;
