"use client";

import React, { useEffect } from "react";
import StartInterview from "./components/StartInterview";
import { useParams } from "next/navigation";
import { useInterviewStore } from "./stores/useInterviewStore";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  const { id } = useParams();
  const { loadInterview } = useInterviewStore();

  useEffect(() => {
    if (id) {
      loadInterview(id as string);
    }
  }, [id, loadInterview]);

  return (
    <div>
      <StartInterview />
      <ToastContainer />
    </div>
  );
};

export default App;
