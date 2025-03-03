import React from "react";
import { useInterviewStore } from "../stores/useInterviewStore";

const ThankYou: React.FC = () => {
  const { reset } = useInterviewStore();

  return (
    <div>
      <h2>⏳ Time is up!</h2>
      <p>Your interview session has ended. Thank you for participating.</p>
      <button onClick={reset}>Restart Interview</button>
    </div>
  );
};

export default ThankYou;
