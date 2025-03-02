"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import { AiTwotoneRocket } from "react-icons/ai";
import { useParams } from "next/navigation";
import { getInvitationDetails } from "@/services/invitation.service";
import InterviewCardLoading from "./component/interview.card.loading";
import AudioRecorder from "@/components/AudioRecorder";

import { startInterview, updateQuestion } from "@/services/interview.service";
import ThankYou from "./component/thankyou";
import InterviewExpired from "./component/interview.expired";
import { showToast } from "@/app/utils/toastUtils";
import InterviewNavbar from "./component/InterviewNavbar";
import InterviewerStartCard from "./component/interviewer.card";
import InterviewCard from "./component/interview.card";
import { upload as upload } from "@/services/company.service";
import CandidateInfoCard from "./component/candidate.info.card";
import VideoRecorder from "./component/video.card";
import { ToastContainer } from "react-toastify";

export interface Question {
  id: string;
  text: string;
  audioUrl: string;
  isQuestion: boolean;
}
export default function InterviewPage() {
  const { id } = useParams();

  const [isStarted, setStart] = useState(false);
  const [isExpiredOrCompleted, setExpiredOrCompleted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [startingInterview, setStartingInterview] = useState(false);
  const [interviewStartedOn, setInterviewStartedOn] = useState("");
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [isAboutCompanyReading, setAboutCompanyReading] = useState(false);
  const [showWelcomeCompany, setShowAboutCompany] = useState(false);
  const [recordedQuestions, setRecordedQuestions] = useState<string[]>([]); // Track completed recordings
  const hasFetched = useRef(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleRecordingComplete = (questionId: string): void => {
    const currentQuestions = recordedQuestions;
    const updatedQuestions = [...currentQuestions, questionId];
    setRecordedQuestions(updatedQuestions);
  };

  const [invitationDetails, setInvitationDetails] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const handleNextQuestion = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        const index = currentQuestionIndex + 1;
        setCurrentQuestionIndex(index);
        setHasAnswered(false);
        const audioUrl = questions[index]?.audioUrl;
        if (audioUrl) {
          const audio = new Audio(audioUrl);

          setTimeout(() => {
            audio.play();
          }, 3000);
          audio.addEventListener("ended", () => {});
        }
      }, 0);
    }
  };

  const readAboutCompany = () => {
    setAboutCompanyReading(true);
    const audio = new Audio(invitationDetails.company.aboutCompanyAudioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio ss:", error);
    });

    audio.addEventListener("ended", () => {
      setTimeout(() => {
        setCurrentQuestionIndex(0);
        const firstQuestion = new Audio(questions[0].audioUrl);
        firstQuestion.play();
        setAboutCompanyReading(false);
      }, 2000);
    });
  };

  const fetchInvitationDetails = async () => {
    if (!id || hasFetched.current) return; // Prevent duplicate calls

    try {
      const data = await getInvitationDetails(id as string);

      if (data.status === "started") {
        setStart(true);
      } else if (data.status === "completed" || data.status === "expired") {
        setExpiredOrCompleted(true);
        return;
      } else if (data.status === "pending") {
        setShowAboutCompany(true);
      }
      setInterviewStartedOn(data.statusUpdateAt);
      setInvitationDetails(data);
      if (data.interviewResult) {
        const filteredQuestions = data.interviewResult.questionAnswers.filter((q) => q.startTime === null);
        setQuestions(filteredQuestions);
        setCurrentQuestionIndex(0);
      } else {
        setQuestions(data.job.questions || []);
      }
    } catch (error) {
      console.error("Error fetching invitation details:", error);
      showToast.error("Error fetching invitation details.");
    }
  };

  const handleStartInterview = async () => {
    setStartingInterview(true);
    try {
      const invitationId = id as string;

      var startedDate = await startInterview({ invitationId });
      setInterviewStartedOn(startedDate);
      setStart(true);
    } catch (error) {
      showToast.error("Error starting the interview");
    } finally {
      setStartingInterview(false);
    }
  };

  useEffect(() => {
    fetchInvitationDetails();
  }, [id]);

  if (isExpiredOrCompleted) {
    return <InterviewExpired />;
  }

  if (!invitationDetails) {
    return <InterviewCardLoading />;
  }

  const { candidateName, duration, candidateEmail, job, company } = invitationDetails;

  if (recordedQuestions.length === questions.length) {
    return <ThankYou invitationDetails={invitationDetails} />;
  }

  const uploadAudioAsync = async (file: File, startTime: Date, endTime: Date): Promise<void> => {
    setIsUploading(true);
    try {
      const response = await upload(file);
      const recordedUrl = response.url;

      await updateQuestion({
        invitationId: id as string,
        questionId: questions[currentQuestionIndex]?.id,
        recordedUrl,
        startTime,
        endTime,
      });

      handleRecordingComplete(questions[currentQuestionIndex]?.id);
    } catch (error) {
      console.error("Failed to upload audio:", error);
    } finally {
      setIsUploading(false);
    }
  };

  function handleInterviewComplete(): void {
    setIsTimeOver(true);
  }

  return (
    <>
      {isExpiredOrCompleted && <InterviewExpired />}
      {isStarted && !isExpiredOrCompleted && !isTimeOver && (
        <>
          <InterviewNavbar company={company} totalMinutes={duration} startTime={interviewStartedOn} onInterviewComplete={handleInterviewComplete} />
          <div className='min-h-screen  '>
            <main className='max-w-7xl mx-auto px-6 py-8'>
              <Card className='p-8' shadow='sm'>
                <CardHeader>
                  <CandidateInfoCard candidateEmail={candidateEmail} candidateName={candidateName} company={company} job={job} />
                </CardHeader>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Card className='py-4' shadow='sm'>
                    <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
                      {currentQuestionIndex !== -1 && (
                        <p className='text-tiny uppercase font-bold'>
                          Questions # {1 + currentQuestionIndex + (invitationDetails.job.questions.length - questions.length)} of {invitationDetails.job.questions.length}
                        </p>
                      )}
                      {currentQuestionIndex == -1 && <p className='text-tiny uppercase font-bold'>Welcome Message</p>}
                    </CardHeader>
                    <CardBody className='overflow-visible py-2'>
                      {!hasAnswered && (
                        <blockquote className='px-4 my-6 py-3 text-2xl'>
                          {currentQuestionIndex != -1 && questions[currentQuestionIndex]?.text}
                          {currentQuestionIndex == -1 && invitationDetails.company.aboutCompany}
                        </blockquote>
                      )}
                      {hasAnswered && <blockquote className='border px-4 my-6 py-3 rounded-xl [&>p]:m-0 border-default-200 dark:border-default-100 bg-default-200/20'>Please click the {"Next Question"} button to load the next question.</blockquote>}
                    </CardBody>
                    <CardFooter className='absolute  bottom-0 z-10 border-t-1 dark:border-t-gray-800'>
                      <div className='flex flex-grow gap-2 items-center'>
                        {currentQuestionIndex != -1 && <AudioRecorder onRecordingComplete={handleRecordingComplete} currentQuestion={questions[currentQuestionIndex]} invitationId={id as string} hasAnswered={hasAnswered} setHasAnswered={setHasAnswered} onNextQuestion={handleNextQuestion} onAudioRecorded={uploadAudioAsync} onStopRecording={() => console.log("Recording stopped externally")} />}

                        {currentQuestionIndex == -1 && (
                          <Button isDisabled={isAboutCompanyReading} endContent={<AiTwotoneRocket />} color='danger' variant='bordered' onPress={() => readAboutCompany()}>
                            Read welcome message.
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>

                  {/* Candidate Section */}
                  <div className='flex flex-col gap-6'>
                    <VideoRecorder invitationId={id as string} />
                    <InterviewerStartCard interviewer={invitationDetails.interviewer} />
                  </div>
                </div>
              </Card>
              <ToastContainer />
            </main>
          </div>
        </>
      )}
      {!isStarted && !isExpiredOrCompleted && <InterviewCard loading={startingInterview} onStartButtonClick={handleStartInterview} invitationDetails={invitationDetails} />}
      {(currentQuestionIndex > questions.length - 1 || isTimeOver) && <ThankYou invitationDetails={invitationDetails} />}
    </>
  );
}
