"use client";

import React from "react";
import StartInterview from "./components/StartInterview";
import { useInterviewStore } from "./stores/useInterviewStore";
import { useSearchParams } from "next/navigation";

const App: React.FC = () => {
  const { phase, endInterview } = useInterviewStore();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id") || ""; // ✅ Get interview ID from URL
  return (
    <div>
      <h1>Interview System</h1>

      {/* Main Interview Component */}
      <StartInterview />

      {/* Show End Interview button only if interview is in progress */}
      {phase === "in-progress" && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={endInterview}
            style={{
              backgroundColor: "red",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}>
            ⏹️ End Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
