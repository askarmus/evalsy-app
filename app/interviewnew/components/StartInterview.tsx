"use client";

import React, { useEffect } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import { useSearchParams } from "next/navigation";

import Welcome from "./Welcome";
import InterviewNavigator from "./InterviewNavigator";
import InterviewCompleted from "./InterviewCompleted";
import ThankYou from "./ThankYou";
import InterviewInstruction from "./InterviewInstruction";
import LinkExpired from "./LinkExpired";

const StartInterview: React.FC = () => {
  const { phase, prepareInterview } = useInterviewStore();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id") || "";

  // ✅ Move from 'preparing' to 'not-started' when the component mounts
  useEffect(() => {
    if (phase === "preparing") {
      prepareInterview();
    }
  }, [phase, prepareInterview]);

  return (
    <div>
      {phase === "not-started" && <InterviewInstruction invitationId={interviewId} />}
      {phase === "welcome" && <Welcome />}
      {phase === "in-progress" && <InterviewNavigator />}
      {phase === "completed" && <InterviewCompleted />}
      {phase === "time-up" && <ThankYou />}
      {phase === "expired" && <LinkExpired />}
    </div>
  );
};

export default StartInterview;
