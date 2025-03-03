import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";

const InterviewCompleted: React.FC = () => {
  const { reset } = useInterviewStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioEnded, setAudioEnded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.error("Audio play failed:", error));
    }
  }, []);

  const handleAudioEnd = () => {
    setAudioEnded(true);
  };

  return (
    <div>
      <h2>🎉 Interview Completed!</h2>
      <p>Thank you for participating in the interview.</p>

      {/* Play "Thank You" Audio */}
      <audio ref={audioRef} onEnded={handleAudioEnd}>
        <source src='https://storage.googleapis.com/evalsy-storage/uploads/tts-audio-1740563598643.mp3' type='audio/mp3' />
        Your browser does not support the audio element.
      </audio>

      {/* Show Reset Button Only After Audio Ends */}
      {audioEnded && <button onClick={reset}>Restart Interview</button>}
    </div>
  );
};

export default InterviewCompleted;
