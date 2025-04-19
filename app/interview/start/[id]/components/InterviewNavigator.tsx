import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import UserCamera from "./UserCamera";
import InterviewNavbar from "./InterviewNavbar";
import { Button, Card, CardBody, CardFooter, Chip } from "@heroui/react";
import Interviewer from "./Interviewer";
import CandidateInfo from "./CandidateInfo";
import { FaMicrophone, FaMicrophoneAlt, FaReply, FaStopCircle } from "react-icons/fa";

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
    <>
      <InterviewNavbar company={company} />
      <main className='max-w-7xl mx-auto px-6 py-8'>
        <Card className='p-8' shadow='sm'>
          <CandidateInfo candidate={candidate} company={company} job={job} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card className='py-4' shadow='sm'>
              <CardBody className='overflow-visible py-2'>
                <div className='p-6'>
                  <p className='text-sm'>
                    Interview Question{" "}
                    <Chip size='sm'>
                      {" "}
                      {questions.length} of {currentQuestion + 1}
                    </Chip>
                  </p>
                  <p className='text-lg leading-relaxed mt-4'>{question?.text || "No Questions Available"}</p>

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
                </div>
              </CardBody>
              <CardFooter className='absolute bottom-0 z-10 border-t-1 dark:border-t-gray-800'>
                <div className='flex flex-grow gap-2 items-center'>
                  {/* ✅ Record Button (Enabled if isRefreshed is true) */}

                  {!isRecording && (
                    <Button
                      color='danger'
                      size='md'
                      radius='full'
                      variant='bordered'
                      startContent={<FaMicrophoneAlt />}
                      isDisabled={!isRefreshed || isReplayingAudio || isRecording || isAudioUploading} // Only disable if isRefreshed is false or if replaying
                      onPress={handleStartRecording}>
                      Record Answer
                    </Button>
                  )}

                  {isRecording && (
                    <Button startContent={<FaMicrophone />} isDisabled={isAudioUploading} onPress={handleStopRecording} color='danger' size='md' radius='full' variant='bordered'>
                      {isAudioUploading ? "Next Question..." : "Stop Recording"}
                    </Button>
                  )}

                  {/* ✅ Replay Audio Button (Enabled if isRefreshed is true) */}
                  {!isReplayingAudio ? (
                    <Button
                      size='md'
                      variant='bordered'
                      radius='full'
                      color='secondary'
                      startContent={<FaReply />}
                      isDisabled={!isRefreshed || isRecording} // Only disable if isRefreshed is false or if recording
                      onPress={handleReplayAudio}>
                      Replay Audio
                    </Button>
                  ) : (
                    <Button size='md' variant='bordered' radius='full' startContent={<FaStopCircle />} color='warning' onPress={handleStopReplayAudio}>
                      Stop Replay
                    </Button>
                  )}

                  {/* ✅ Stop Recording Button */}
                </div>
              </CardFooter>
            </Card>
            <div className='flex flex-col gap-6'>
              <UserCamera />
              <Interviewer data={interviewer} />
            </div>
          </div>
        </Card>
      </main>
    </>
  );
};

export default InterviewNavigator;
