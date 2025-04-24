import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import UserCamera from "./UserCamera";
import InterviewNavbar from "./InterviewNavbar";
import { Button, Card, CardBody } from "@heroui/react";
import CandidateInfo from "./CandidateInfo";
import { FaMicrophone, FaMicrophoneAlt, FaPlay, FaStopCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import PoweredBy from "./PoweredBy";
import InterviewProgress from "./InterviewProgress";

const InterviewNavigator: React.FC = () => {
  const { questions, setPhase, interviewer, candidate, job, company, uploadRecording, currentQuestion, setAudioCompleted, isRecording, setRecording } = useInterviewStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reminderAudioRef = useRef<HTMLAudioElement | null>(null);
  const [reminderInterval, setReminderInterval] = useState<NodeJS.Timeout | null>(null);
  const [isReplayingAudio, setIsReplayingAudio] = useState(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const question = questions[currentQuestion];

  useEffect(() => {
    const isRefreshed = localStorage.getItem("pageRefreshed");
    if (isRefreshed) {
      localStorage.removeItem("pageRefreshed");
      setIsRefreshed(false);
    }
    localStorage.setItem("pageRefreshed", "true");
    setIsRefreshed(true);
  }, []);

  useEffect(() => {
    const playQuestionAudio = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.load();
      setTimeout(() => {
        audio.play().catch((error) => {
          console.warn("Autoplay blocked or failed:", error);
        });
      }, 100);
    };
    playQuestionAudio();
  }, [currentQuestion]);

  const handleQuestionAudioEnd = () => {
    setAudioCompleted(true);
    playReminderAudio();
  };

  const handleStartRecording = async () => {
    setRecording(true);
    setAudioCompleted(false);
    if (reminderInterval) {
      clearInterval(reminderInterval);
      setReminderInterval(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    let audioChunks: BlobPart[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };
    recorder.onstop = async () => {
      const recordedAudio = new Blob(audioChunks, { type: "audio/mp3" });
      setIsAudioUploading(true);
      await uploadRecording(recordedAudio);
      setIsAudioUploading(false);
      setRecording(false);
    };
    recorder.start();
    setMediaRecorder(recorder);
  };

  const handleStopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleReplayAudio = () => {
    if (audioRef.current) {
      setIsReplayingAudio(true);
      audioRef.current.play();
    }
  };

  const handleStopReplayAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsReplayingAudio(false);
    setAudioCompleted(true);
  };

  const handleReplayAudioEnded = () => {
    setIsReplayingAudio(false);
    setAudioCompleted(true);
  };

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
    <div className='min-h-screen flex items-center justify-center bg-white dark:bg-gray-900'>
      <div className='w-full max-w-screen-lg mx-auto px-6 py-8'>
        <InterviewNavbar company={company} />
        <Card className='w-full p-0 mt-6  dark:border-gray-700 overflow-hidden bg-white/90 dark:bg-gray-800/90 '>
          <CardBody className='p-0'>
            <CandidateInfo candidate={candidate} job={job} company={company} questions={questions} currentQuestion={currentQuestion} />
            <div className='grid md:grid-cols-5 gap-0'>
              <div className='md:col-span-3 bg-slate-50 dark:bg-slate-800 border-l border-gray-200 dark:border-gray-700'>
                <div className='p-0'>
                  <UserCamera />
                </div>
              </div>
              <div className='md:col-span-2 bg-slate-50 dark:bg-slate-800 p-4 border-l border-gray-200 dark:border-gray-700'>
                <div className=' '>
                  <InterviewProgress candidate={candidate} job={job} company={company} questions={questions} currentQuestion={currentQuestion} />

                  <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='text-md mt-6 text-gray-800 dark:text-gray-100'>
                    {question?.text || "No Questions Available"}
                    <audio ref={audioRef} onEnded={handleQuestionAudioEnd} onPlay={() => setIsReplayingAudio(true)} onPause={handleReplayAudioEnded}>
                      <source src={question?.audioUrl} type='audio/wav' />
                      Your browser does not support the audio element.
                    </audio>
                    <audio ref={reminderAudioRef}>
                      <source src={company.answerQuestionAudioUrl} type='audio/wav' />
                      Your browser does not support the audio element.
                    </audio>
                  </motion.h3>
                </div>
              </div>
            </div>

            <div className='p-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-b-xl border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3'>
              {!isRecording ? (
                <Button color='danger' size='md' radius='full' variant='solid' startContent={<FaMicrophoneAlt />} isDisabled={!isRefreshed || isReplayingAudio || isRecording || isAudioUploading} onPress={handleStartRecording}>
                  Record Answer
                </Button>
              ) : (
                <Button
                  color='danger'
                  size='md'
                  radius='full'
                  variant='solid'
                  startContent={
                    <AnimatePresence mode='wait'>
                      <motion.div key='recording' initial={{ scale: 1 }} animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className='relative'>
                        <FaMicrophone className='h-4 w-4' />
                        <motion.div className='absolute -inset-1 rounded-full border-1 border-white opacity-50' initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                      </motion.div>
                    </AnimatePresence>
                  }
                  isDisabled={isAudioUploading}
                  onPress={handleStopRecording}>
                  {isAudioUploading ? "Loading Next Question..." : "Stop Recording"}
                </Button>
              )}

              {!isReplayingAudio ? (
                <Button size='md' variant='solid' radius='full' color='default' startContent={<FaPlay />} isDisabled={!isRefreshed || isRecording} onPress={handleReplayAudio}>
                  Replay Audio
                </Button>
              ) : (
                <Button size='md' variant='bordered' radius='full' startContent={<FaStopCircle />} color='warning' onPress={handleStopReplayAudio}>
                  Stop Replay
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
        <PoweredBy />
      </div>
    </div>
  );
};

export default InterviewNavigator;
