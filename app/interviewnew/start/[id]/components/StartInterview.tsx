"use client";

import React from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import Welcome from "./Welcome";
import InterviewNavigator from "./InterviewNavigator";
import ThankYou from "./ThankYou";
import InterviewInstruction from "./InterviewInstruction";
import LinkExpired from "./LinkExpired";
import InterviewLoadingSkelton from "./InterviewLoadingSkelton";

const StartInterview: React.FC = () => {
  const { phase } = useInterviewStore();
  return (
    <div>
      {phase === "skeleton-loading" && <InterviewLoadingSkelton />}
      {phase === "not-started" && <InterviewInstruction />}
      {phase === "welcome" && <Welcome />}
      {phase === "in-progress" && <InterviewNavigator />}
      {(phase === "completed" || phase === "time-up") && <ThankYou />}
      {phase === "expired" && <LinkExpired />}
    </div>
  );
};

export default StartInterview;
