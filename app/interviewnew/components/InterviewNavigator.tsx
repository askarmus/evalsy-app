import React, { useEffect, useRef, useState } from "react";
import InterviewTimer from "./InterviewTimer";
import { useInterviewStore } from "../stores/useInterviewStore";
import UserCamera from "./UserCamera";

const InterviewNavigator: React.FC = () => {
  const { questions, currentQuestion, isAudioCompleted, setAudioCompleted, isRecording, setRecording } = useInterviewStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reminderAudioRef = useRef<HTMLAudioElement | null>(null);
  const [reminderInterval, setReminderInterval] = useState<NodeJS.Timeout | null>(null);

  const question = questions[currentQuestion];

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Audio play failed:", error);
        }
      }
    };

    playAudio();
  }, [currentQuestion]); // ✅ Runs every time the question changes

  const handleQuestionAudioEnd = () => {
    setAudioCompleted(true);
    playReminderAudio(); // ✅ Start reminder after question audio ends
  };

  const handleStartRecording = () => {
    setRecording(true);
    setAudioCompleted(false);

    // ✅ Stop reminder when user starts recording
    if (reminderInterval) {
      clearInterval(reminderInterval);
      setReminderInterval(null);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleReplayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleStopRecording = () => {
    setRecording(false); // ✅ Move to next question
  };

  // ✅ Play Reminder Audio
  const playReminderAudio = () => {
    if (reminderAudioRef.current && !isRecording) {
      reminderAudioRef.current.play();

      // ✅ Set interval to repeat reminder every 10 seconds if not recording
      if (!reminderInterval) {
        const interval = setInterval(() => {
          if (!isRecording && reminderAudioRef.current) {
            reminderAudioRef.current.play();
          }
        }, 10000); // Repeat every 10 seconds (configurable)

        setReminderInterval(interval);
      }
    }
  };

  if (questions.length === 0) {
    return <p>❌ No Questions Available. Please restart the interview.</p>;
  }

  return (
    <div>
      <InterviewTimer />
      <UserCamera /> {/* ✅ Show user camera */}
      <h2>Question {currentQuestion + 1}:</h2>
      <p>{question?.text || "No Questions Available"}</p>
      {/* ✅ Question Audio */}
      <audio ref={audioRef} onEnded={handleQuestionAudioEnd}>
        <source src={question?.audio} type='audio/mp3' />
        Your browser does not support the audio element.
      </audio>
      {/* ✅ Reminder Audio */}
      <audio ref={reminderAudioRef}>
        <source src='https://storage.googleapis.com/evalsy-storage/uploads/tts-audio-1740563598643.mp3' type='audio/mp3' />
        Your browser does not support the audio element.
      </audio>
      {/* ✅ Show "Record" & "Replay" only after question audio ends */}
      {isAudioCompleted && !isRecording && (
        <div>
          <button onClick={handleStartRecording}>🎤 Record Audio</button>
          <button onClick={handleReplayAudio}>🔄 Replay Audio</button>
        </div>
      )}
      {/* ✅ Stop Recording Button */}
      {isRecording && (
        <div>
          <button onClick={handleStopRecording}>🛑 Stop Recording</button>
        </div>
      )}
    </div>
  );
};

export default InterviewNavigator;
