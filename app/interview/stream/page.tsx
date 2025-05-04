"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import InterviewRecorder from "../start/[id]/components/InterviewRecorder";

const App: React.FC = () => {
  const { id } = useParams() as { id: string };

  return (
    <div>
      <InterviewRecorder />
    </div>
  );
};

export default App;
