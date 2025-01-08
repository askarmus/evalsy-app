"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Checkbox,
} from "@nextui-org/react";
import {
  AiOutlineClockCircle,
  AiOutlineAudio,
  AiOutlineStepForward,
  AiOutlineRedo,
} from "react-icons/ai";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function InterviewPage() {
  const [currentTime, setCurrentTime] = useState("11:07:14 AM");
  const [skippedQuestions, setSkippedQuestions] = useState([
    "Why do you want this job?",
    "What are your strengths?",
  ]);

  const skipQuestion = (questionText: string) => {
    setSkippedQuestions((prev) => [...prev, questionText]);
  };

  const restartQuestion = (index: number) => {
    const questionToRestart = skippedQuestions[index];
    setSkippedQuestions((prev) => prev.filter((_, i) => i !== index));
    console.log(`Restarting question: ${questionToRestart}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Navbar maxWidth="full">
          <NavbarBrand>
            <AcmeLogo />
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>

          <NavbarContent justify="end">
            <NavbarItem>
              <div className="flex items-center gap-2">
                <AiOutlineClockCircle />
                <span>{currentTime}</span>
              </div>
            </NavbarItem>
            <NavbarItem>
              <Button color="danger" variant="solid">
                End Interview
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Card className="p-8" shadow="none">
            <CardHeader className="justify-between mb-10">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    <span className="text-small tracking-tight text-default-400">
                      Hello,
                    </span>{" "}
                    Zoey Lang
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    askarmus@gmail.com
                  </h5>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  <span className="text-gray-400 ">Interviewing Position:</span>{" "}
                  Senior Softwar Enginner
                </h3>
                <p className="text-gray-500">Acme Corporation</p>
              </div>
            </CardHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="py-4" shadow="sm">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-tiny uppercase font-bold">Questions #1</p>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <div className="p-4 border border-gray-300 rounded-lg mt-4">
                    <p className="font-bold">Tell us about yourself.</p>
                  </div>
                  <h5 className="mt-6 text-orange-600 font-semibold">
                    Skipped Questions:
                  </h5>
                  {skippedQuestions.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {skippedQuestions.map((question, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center bg-orange-100 p-3 rounded-lg"
                        >
                          <span>{question}</span>
                          <Button
                            color="warning"
                            variant="bordered"
                            size="sm"
                            onPress={() => restartQuestion(index)}
                          >
                            Resume
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No skipped questions.</p>
                  )}
                </CardBody>
                <CardFooter className="absolute  bottom-0 z-10 border-1">
                  <div className="flex flex-grow gap-2 items-center">
                    <Button color="success" endContent={<AiOutlineAudio />}>
                      Aanswer Question
                    </Button>
                  </div>

                  <Button
                    color="primary"
                    variant="faded"
                    onPress={() => skipQuestion("Tell us about yourself.")}
                  >
                    Skip Question
                  </Button>
                </CardFooter>
              </Card>

              {/* Candidate Section */}
              <div className="flex flex-col gap-6">
                <Card className="py-4" shadow="sm">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">Video</p>
                  </CardHeader>
                  <CardBody>
                    <div className="w-full aspect-video bg-black rounded-lg"></div>
                  </CardBody>
                </Card>
                <Card className="py-4" shadow="sm">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">INTERVIWER</p>
                  </CardHeader>
                  <CardHeader className="justify-between">
                    <div className="flex gap-5">
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src="https://nextui.org/avatars/avatar-1.png"
                      />
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">
                          Zoey Lang
                        </h4>
                        <h5 className="text-small tracking-tight text-default-400">
                          @zoeylang
                        </h5>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="px-3 py-0 text-small text-default-400">
                    <p>
                      Frontend developer and UI/UX enthusiast. Join me on this
                      coding adventure!
                    </p>
                    <span className="pt-2">
                      #FrontendWithZoey
                      <span aria-label="computer" className="py-2" role="img">
                        💻
                      </span>
                    </span>
                  </CardBody>
                </Card>
              </div>
            </div>
          </Card>
        </main>
      </div>
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Card className="p-8" shadow="none">
            <CardHeader className="justify-between mb-10">
              <div className="flex gap-5">
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    <span className="text-small tracking-tight text-default-400">
                      Hello,
                    </span>{" "}
                    Zoey Lang
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    askarmus@gmail.com
                  </h5>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  <span className="text-gray-400  font-semibold ">
                    Intterviwing Position:
                  </span>{" "}
                  Senior Softwar Enginner
                </h3>
                <p className="text-gray-500">Acme Corporation</p>
              </div>
            </CardHeader>

            <CardBody>
              <div className="mb-5">
                <div className="text-tiny uppercase font-bold mb-5">
                  Interview Information
                </div>

                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    <strong>Duration:</strong> 30 minutes
                  </li>
                  <li>
                    <strong>Total Questions:</strong> 10
                  </li>
                </ul>
              </div>

              <div className="text-tiny uppercase font-bold mb-5">
                Interview instruction
              </div>
              <ul className="list-decimal pl-6 space-y-1 text-gray-700">
                <li>
                  <strong>Enable Your Microphone and Camera:</strong> Ensure
                  your microphone and camera are active before starting the
                  session.
                </li>
                <li>
                  <strong>Video Recording Notice:</strong> Your video and audio
                  will be recorded for evaluation purposes.
                </li>
                <li>
                  <strong>Maintain Eye Contact:</strong> Look directly into the
                  camera for a professional and engaging appearance.
                </li>
                <li>
                  <strong>Respond Clearly and Concisely:</strong> Speak clearly,
                  stay on topic, and ensure your responses fit within the given
                  time.
                </li>
                <li>
                  <strong>Ensure a Quiet Environment:</strong> Select a
                  well-lit, quiet location free from distractions or
                  interruptions.
                </li>
                <li>
                  <strong>Follow On-Screen Prompts:</strong> Carefully read and
                  follow the prompts provided during the interview process.
                </li>
              </ul>

              <div className="mt-6">
                <Checkbox color="primary" size="lg" defaultSelected={false}>
                  I have read and understood all the instructions above.
                </Checkbox>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex flex-col items-start space-y-2">
                <Button color="success">Start Interview</Button>
                <div className="text-small tracking-tight text-default-400">
                  <strong>Note:</strong> You must check the box before
                  proceeding to the interview. The "Start" button will only be
                  enabled after you confirm.
                </div>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </>
  );
}
