"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  NavbarBrand,
} from "@heroui/react";
import { AiOutlinePlayCircle, AiTwotoneRocket } from "react-icons/ai";
import Image from "next/image";
import AudioRecorder from "@/components/AudioRecorder";
import CountdownTimer from "@/components/countdown.timer";
import ThankYou from "./thankyou";
import { animate } from "framer-motion";

export default function InterviewContent({ invitationDetails, questions }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [recordedQuestions, setRecordedQuestions] = useState<any>([]);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleNextQuestion = () => {
    setShowReplayButton(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setHasAnswered(false);
      const audioUrl = questions[currentQuestionIndex]?.audioUrl;
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
        audio.addEventListener("ended", () => setShowReplayButton(true));
      }
    }
  };

  const handleRecordingComplete = (questionId) => {
    setRecordedQuestions((prev) => [...prev, questionId]);
    setShowReplayButton(false);
  };

  if (recordedQuestions.length === questions.length) {
    return <ThankYou invitationDetails={invitationDetails} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <NavbarBrand>
          {invitationDetails.company.logo ? (
            <Image
              src={invitationDetails.company.logo}
              alt="Company Logo"
              width={100}
              height={40}
              className="w-auto min-h-[30px] max-h-[40px] object-contain"
            />
          ) : (
            <p className="font-bold text-inherit">
              {invitationDetails.company.name}
            </p>
          )}
        </NavbarBrand>
        <CountdownTimer
          totalMinutes={10}
          startTime="2025-02-01T14:00:00Z"
          onComplete={() => {}}
        />
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card className="p-8" shadow="none">
          <CardHeader className="justify-between mb-10">
            <div>
              <h3 className="text-md font-semibold">
                Interviewing Position: {invitationDetails.job.jobTitle}
              </h3>
              <h3 className="text-md font-semibold">
                Company: {invitationDetails.company.name}
              </h3>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="py-4" shadow="sm">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">
                  Question #{currentQuestionIndex + 1} of {questions.length}
                </p>
              </CardHeader>
              <CardBody>
                <blockquote className="border px-4 my-6 py-3 rounded-xl bg-gray-100">
                  {currentQuestionIndex !== -1
                    ? questions[currentQuestionIndex]?.text
                    : invitationDetails.job.welcomeMessage}
                </blockquote>
                {showReplayButton && (
                  <Button
                    size="sm"
                    color="primary"
                    endContent={<AiOutlinePlayCircle />}
                    onPress={() => {
                      const audio = new Audio(
                        questions[currentQuestionIndex]?.audioUrl
                      );
                      audio.play();
                    }}
                  >
                    Replay
                  </Button>
                )}
              </CardBody>
              <CardFooter>
                {currentQuestionIndex !== -1 ? (
                  <AudioRecorder
                    onRecordingComplete={handleRecordingComplete}
                    currentQuestion={questions[currentQuestionIndex]}
                    invitationId={invitationDetails.id}
                    hasAnswered={hasAnswered}
                    setHasAnswered={setHasAnswered}
                    onNextQuestion={handleNextQuestion}
                  />
                ) : (
                  <Button
                    endContent={<AiTwotoneRocket />}
                    color="danger"
                    variant="bordered"
                    onPress={handleNextQuestion}
                  >
                    Start Interview
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </Card>
      </main>
    </div>
  );
}
