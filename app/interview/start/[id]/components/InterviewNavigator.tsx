import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import UserCamera from "./UserCamera";
import InterviewNavbar from "./InterviewNavbar";
import { Button, Card, CardBody, Chip, ScrollShadow, Textarea, Tooltip } from "@heroui/react";
import CandidateInfo from "./CandidateInfo";
import { FaExpand, FaMicrophone, FaMicrophoneAlt, FaPlay, FaStopCircle } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import PoweredBy from "./PoweredBy";
import InterviewProgress from "./InterviewProgress";
import { Editor } from "@monaco-editor/react";
import { executeCode } from "@/app/utils/judge0";
import { useTheme } from "next-themes";

const InterviewNavigator: React.FC = () => {
  const { questions, setPhase, candidate, job, company, uploadRecording, updateCodeResult, currentQuestion, setAudioCompleted, isRecording, setRecording } = useInterviewStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reminderAudioRef = useRef<HTMLAudioElement | null>(null);
  const [reminderInterval, setReminderInterval] = useState<NodeJS.Timeout | null>(null);
  const [isReplayingAudio, setIsReplayingAudio] = useState(false);
  const [isResultUpdating, setIsResultUpdating] = useState(false);
  const [codeOutput, setCodeOutput] = useState("");
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const question = questions[currentQuestion];
  const { theme } = useTheme(); // Gets 'light' or 'dark'

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

  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [codeExecuting, setCodeExecuting] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  const handleRun = async () => {
    setCodeExecuting(true);
    try {
      const result = await executeCode(code, 63);
      setOutput(result.stdout || result.stderr || "No output.");
    } catch (error) {
      setOutput("Error executing code.");
    } finally {
      setCodeExecuting(false);
    }
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
      setIsResultUpdating(true);
      await uploadRecording(recordedAudio);
      setIsResultUpdating(false);
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

  const handleCodeFinish = async () => {
    setIsResultUpdating(true);
    await updateCodeResult(code, output);
    setIsResultUpdating(false);
    setRecording(false);
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
    if (reminderAudioRef.current && !isRecording && question.type === "verbal") {
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
    <div className='min-h-screen flex items-center justify-center  '>
      <div className='w-full max-w-screen-xl mx-auto px-6 py-8'>
        <InterviewNavbar company={company} />
        <Card className='w-full p-0 mt-6  dark:border-gray-900 overflow-hidden bg-white/90 dark:bg-gray-900'>
          <CardBody className='p-0'>
            <CandidateInfo candidate={candidate} job={job} company={company} questions={questions} currentQuestion={currentQuestion} />
            <div className='grid md:grid-cols-5 gap-0'>
              <div className='md:col-span-3 bg-slate-50 dark:bg-slate-800 p-4 border-l border-gray-200 dark:border-gray-900'>
                <div className=' '>
                  <InterviewProgress candidate={candidate} job={job} company={company} questions={questions} currentQuestion={currentQuestion} />
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='flex items-center justify-between mt-6'>
                    <h3 className='text-md font-semibold text-gray-800 dark:text-gray-100'>{question.text}</h3>

                    {!isReplayingAudio ? (
                      <Button size='sm' variant='solid' radius='full' color='default' startContent={<FaPlay />} isDisabled={!isRefreshed || isRecording} onPress={handleReplayAudio}>
                        Replay Audio
                      </Button>
                    ) : (
                      <Button size='sm' variant='bordered' radius='full' startContent={<FaStopCircle />} color='warning' onPress={handleStopReplayAudio}>
                        Stop Replay
                      </Button>
                    )}
                  </motion.div>

                  <audio ref={audioRef} onEnded={handleQuestionAudioEnd} onPlay={() => setIsReplayingAudio(true)} onPause={handleReplayAudioEnded}>
                    <source src={question?.audioUrl} type='audio/wav' />
                    Your browser does not support the audio element.
                  </audio>

                  <audio ref={reminderAudioRef}>
                    <source src={company.answerQuestionAudioUrl} type='audio/wav' />
                    Your browser does not support the audio element.
                  </audio>

                  {question.type == "coding" && (
                    <div className='mt-6'>
                      <Editor
                        className={`rounded-xl ${theme === "dark" ? "border-8 border-gray-900" : "border-8 border-white"}`}
                        height={400}
                        language={question.lannguage}
                        defaultLanguage='javascript'
                        options={{
                          minimap: { enabled: false }, // Optional: hides the minimap
                        }}
                        value={question.starterCode}
                        onChange={(value) => setCode(value || "")}
                        theme={theme === "dark" ? "vs-dark" : "light"}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className='md:col-span-2 bg-slate-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-900'>
                {question.type == "coding" && (
                  <div className='p-2 coding-instruction mt-3'>
                    <div className='max-w-xl mx-auto   space-y-2'>
                      <div className='flex items-center'>
                        <h2 className='text-xs font-semibold'>Instruction:</h2>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: question.explanation }} />
                    </div>
                  </div>
                )}

                {question.type == "verbal" && <UserCamera hideRecLabel={false} />}

                {question.type == "coding" && (
                  <div className='p-2'>
                    <h3 className='text-xs font-semibold mb-4'>Output</h3>
                    <div>
                      <Textarea readOnly value={output} className='w-full' variant='bordered'>
                        {output}
                      </Textarea>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {question.type == "coding" && (
              <div className='p-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-b-xl border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3'>
                <Button color='success' className='text-white' size='md' radius='full' variant='solid' startContent={<FaPlay />} isDisabled={codeExecuting} onPress={handleRun}>
                  Run Code
                </Button>

                <Button color='default' isLoading={isResultUpdating} size='md' radius='full' variant='solid' startContent={<FaExpand />} onPress={handleCodeFinish}>
                  {isResultUpdating ? "Loading Next Question..." : "Next Question"}
                </Button>
              </div>
            )}
            {question.type == "verbal" && (
              <div className='p-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-b-xl border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3'>
                {!isRecording ? (
                  <Button color='danger' size='md' radius='full' variant='solid' startContent={<FaMicrophoneAlt />} isDisabled={!isRefreshed || isReplayingAudio || isRecording || isResultUpdating} onPress={handleStartRecording}>
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
                    isDisabled={isResultUpdating}
                    onPress={handleStopRecording}>
                    {isResultUpdating ? "Loading Next Question..." : "Stop Recording"}
                  </Button>
                )}
              </div>
            )}
          </CardBody>
        </Card>
        <PoweredBy />
      </div>
    </div>
  );
};

export default InterviewNavigator;
