"use client";
import React, { useEffect, useRef } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";

const Welcome: React.FC = () => {
  const { setPhase } = useInterviewStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.error("Audio play failed:", error));
    }
  }, []);

  const handleAudioEnd = () => {
    setPhase("in-progress"); // ✅ Move to Interview phase after welcome audio ends
  };

  return (
    <div>
      <h2>🎙️ Welcome to the Interview!</h2>
      <p>Please listen to the welcome message before proceeding.</p>

      <audio ref={audioRef} onEnded={handleAudioEnd}>
        <source src='https://storage.googleapis.com/evalsy-storage/uploads/tts-audio-1740563598643.mp3' type='audio/mp3' />
        Your browser does not support the audio element.
      </audio>

      <p>Playing welcome audio...</p>
    </div>
  );
};

export default Welcome;
