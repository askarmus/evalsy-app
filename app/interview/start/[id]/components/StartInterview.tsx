"use client";

import React from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import Welcome from "./Welcome";
import InterviewNavigator from "./InterviewNavigator";
import ThankYou from "./ThankYou";
import InterviewInstruction from "./InterviewInstruction";
import InterviewLoadingSkelton from "./InterviewLoadingSkelton";
import NotFound from "@/app/not-found";

const StartInterview: React.FC = () => {
  const { phase } = useInterviewStore();
  return (
    <div>
      {phase === "skeleton-loading" && <InterviewLoadingSkelton />}
      {phase === "not-started" && <InterviewInstruction />}
      {phase === "welcome" && <Welcome />}
      {phase === "in-progress" && <InterviewNavigator />}
      {(phase === "completed" || phase === "time-up") && <ThankYou />}
      {phase === "expired" && <NotFound />}
    </div>
  );
};

export default StartInterview;
