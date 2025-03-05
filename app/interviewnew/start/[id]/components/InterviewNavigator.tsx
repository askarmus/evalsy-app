import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import UserCamera from "./UserCamera";
import InterviewNavbar from "./InterviewNavbar";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import CandidateInfo from "./CandidateInfo";
import { ToastContainer } from "react-toastify";
import Interviewer from "./Interviewer";

const InterviewNavigator: React.FC = () => {
  const { questions, interviewer, candidate, company, job, currentQuestion, isAudioCompleted, setAudioCompleted, isRecording, setRecording } = useInterviewStore();
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
    setRecording(false); //
  };

  // ✅ Play Reminder Audio
  const playReminderAudio = () => {
    if (reminderAudioRef.current && !isRecording) {
      reminderAudioRef.current.play();
      if (!reminderInterval) {
        const interval = setInterval(() => {
          if (!isRecording && reminderAudioRef.current) {
            // reminderAudioRef.current.play();
          }
        }, 10000);
        setReminderInterval(interval);
      }
    }
  };

  return (
    <>
      <InterviewNavbar company={company} />
      <div className='min-h-screen  '>
        <main className='max-w-7xl mx-auto px-6 py-8'>
          <Card className='p-8' shadow='sm'>
            <CardHeader>
              <CandidateInfo candidate={candidate} company={company} job={job} />
            </CardHeader>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card className='py-4' shadow='sm'>
                <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>Question {currentQuestion + 1}:</CardHeader>
                <CardBody className='overflow-visible py-2'>
                  <p>{question?.text || "No Questions Available"}</p>
                  {/* ✅ Question Audio */}
                  <audio ref={audioRef} onEnded={handleQuestionAudioEnd}>
                    <source src={question?.audioUrl} type='audio/mp3' />
                    Your browser does not support the audio element.
                  </audio>
                  {/* ✅ Reminder Audio */}
                  <audio ref={reminderAudioRef}>
                    <source src='https://storage.googleapis.com/evalsy-storage/uploads/tts-audio-1740563598643.mp3' type='audio/mp3' />
                    Your browser does not support the audio element.
                  </audio>
                </CardBody>
                <CardFooter className='absolute  bottom-0 z-10 border-t-1 dark:border-t-gray-800'>
                  <div className='flex flex-grow gap-2 items-center'>
                    <div className=' gap-2'>
                      <Button color='danger' isDisabled={isAudioCompleted && !isRecording} onPress={handleStartRecording}>
                        Record Audio
                      </Button>
                      <Button color='secondary' isDisabled={isAudioCompleted && !isRecording} onPress={handleReplayAudio}>
                        Replay Audio
                      </Button>
                    </div>

                    {/* ✅ Stop Recording Button */}
                    {isRecording && (
                      <div>
                        <Button onPress={handleStopRecording}>🛑 Stop Recording</Button>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
              <div className='flex flex-col gap-6'>
                <UserCamera />
                <Interviewer data={interviewer} />
              </div>
            </div>
          </Card>
          <ToastContainer />
        </main>
      </div>
    </>
  );
};

export default InterviewNavigator;
