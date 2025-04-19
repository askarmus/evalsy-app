import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import UserCamera from "./UserCamera";
import InterviewNavbar from "./InterviewNavbar";
import { Badge, Button, Card, CardBody, CardFooter, Chip, Divider, Progress, Switch } from "@heroui/react";
import Interviewer from "./Interviewer";
import CandidateInfo from "./CandidateInfo";
import { FaChair, FaClock, FaCompressAlt, FaHireAHelper, FaMicrophone, FaMicrophoneAlt, FaPlay, FaReply, FaStopCircle, FaThumbsUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const InterviewNavigator: React.FC = () => {
  const { questions, interviewer, candidate, job, company, uploadRecording, currentQuestion, setAudioCompleted, isRecording, setRecording } = useInterviewStore();

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

      audio.load(); // Reload to make sure it's fresh

      // Optional: log readyState to debug
      console.log("Audio readyState before play:", audio.readyState); // Should be >= 2 ideally

      setTimeout(() => {
        audio.play().catch((error) => {
          console.warn("Autoplay blocked or failed:", error);
        });
      }, 100); // You can adjust this delay if needed
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

    const mediaConstraints = { audio: true };
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

    const recorder = new MediaRecorder(stream);
    let audioChunks: BlobPart[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
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
      // Stop all tracks in the stream
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
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-screen-xl mx-auto px-6 py-8'>
        <InterviewNavbar company={company} />

        <div className='w-full shadow-xl border-1 overflow-hidden bg-white/90 backdrop-blur-sm rounded-xl shadow-lg'>
          <CandidateInfo candidate={candidate} job={job} company={company} questions={questions} currentQuestion={currentQuestion} />

          <div className='p-0'>
            <div className='grid md:grid-cols-5 gap-0'>
              <div className='md:col-span-3 p-6 bg-white'>
                <div className='space-y-5'>
                  <div className='inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 text-teal-700 text-sm font-medium'>
                    <span className='flex h-2 w-2 rounded-full bg-teal-600 mr-2 animate-pulse'></span>
                    Interview Question {currentQuestion + 1}
                  </div>

                  <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='text-2xl font-bold text-gray-800'>
                    {question?.text || "No Questions Available"}
                    {/* ✅ Question Audio */}
                    <audio ref={audioRef} onEnded={handleQuestionAudioEnd} onPlay={() => setIsReplayingAudio(true)} onPause={handleReplayAudioEnded}>
                      <source src={question?.audioUrl} type='audio/wav' />
                      Your browser does not support the audio element.
                    </audio>

                    {/* ✅ Reminder Audio */}
                    <audio ref={reminderAudioRef}>
                      <source src={company.answerQuestionAudioUrl} type='audio/wav' />
                      Your browser does not support the audio element.
                    </audio>
                  </motion.h3>

                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className='text-gray-600'>
                    Please explain your experience with different .NET frameworks and highlight your areas of expertise. Include specific examples of projects where youve applied these technologies.
                  </motion.p>

                  <div className='bg-blue-50 rounded-xl p-4 border border-blue-100'>
                    <h4 className='text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2'>
                      <FaHireAHelper className='h-4 w-4' />
                      Tips for a Great Answer:
                    </h4>
                    <ul className='text-sm text-blue-700/80 space-y-2'>
                      <li className='flex items-start gap-2'>
                        <div className='h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0 mt-0.5'>1</div>
                        <span>Mention specific versions yousve worked with (e.g., .NET Framework 4.x, .NET Core, .NET 5+)</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <div className='h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0 mt-0.5'>2</div>
                        <span>Highlight real-world projects where you applied these frameworks</span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <div className='h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 flex-shrink-0 mt-0.5'>3</div>
                        <span>Explain why you prefer certain frameworks over others for specific use cases</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='md:col-span-2 bg-slate-50 p-6 border-l'>
                <div className='space-y-4 mt-0'>
                  <UserCamera />
                  <Divider className='my-4' />

                  <Interviewer data={interviewer} />
                </div>
              </div>
            </div>
          </div>

          <div className='p-6 bg-gradient-to-r from-slate-50 to-white rounded-b-xl border-t flex flex-col sm:flex-row gap-3 justify-start'>
            {!isRecording && (
              <Button
                color='danger'
                size='md'
                radius='full'
                variant='solid'
                startContent={<FaMicrophoneAlt />}
                isDisabled={!isRefreshed || isReplayingAudio || isRecording || isAudioUploading} // Only disable if isRefreshed is false or if replaying
                onPress={handleStartRecording}>
                Record Answer
              </Button>
            )}

            {isRecording && (
              <Button
                color='danger'
                size='md'
                radius='full'
                variant='solid'
                startContent={
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key='recording'
                      initial={{ scale: 1 }}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                        times: [0, 0.5, 1],
                      }}
                      className='relative'>
                      <FaMicrophone className='h-4 w-4' />
                      <motion.div
                        className='absolute -inset-1 rounded-full border-1 border-white opacity-50'
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 0, 0.8],
                        }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1.5,
                          times: [0, 0.5, 1],
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                }
                isDisabled={isAudioUploading}
                onPress={handleStopRecording}>
                {isAudioUploading ? "Loading Next Question..." : "Stop Recording"}
              </Button>
            )}

            {/* ✅ Replay Audio Button (Enabled if isRefreshed is true) */}
            {!isReplayingAudio ? (
              <Button
                size='md'
                variant='solid'
                radius='full'
                color='default'
                startContent={<FaPlay />}
                isDisabled={!isRefreshed || isRecording} // Only disable if isRefreshed is false or if recording
                onPress={handleReplayAudio}>
                Replay Audio
              </Button>
            ) : (
              <Button size='md' variant='bordered' radius='full' startContent={<FaStopCircle />} color='warning' onPress={handleStopReplayAudio}>
                Stop Replay
              </Button>
            )}
          </div>
        </div>

        <div className='flex justify-between items-center mt-4 text-sm text-slate-500'>
          <div className='flex items-center gap-2'></div>
          <p className='text-xs'>© 2025 Evalsy Interview Platform</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewNavigator;
