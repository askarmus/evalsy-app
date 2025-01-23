"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@heroui/react";
import { AiOutlineAudio, AiOutlineClockCircle } from "react-icons/ai";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getInvitationDetails } from "@/services/invitation.service";
import InterviewCard from "./component/interview.card";
import InterviewCardLoading from "./component/interview.card.loading";
import { InvitationDetails } from "./interface/invitation.detail.int";
import Image from "next/image";
import AudioRecorder from "@/components/AudioRecorder";
import { startInterview } from "@/services/interview.service";
import ConfirmDialog from "@/components/ConfirmDialog";
import ThankYou from "./component/thankyou";

export interface Question {
  id: string;
  text: string;
}
export default function InterviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = useParams();

  const [currentTime, setCurrentTime] = useState("11:07:14 AM");
  const [isStarted, setStart] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [startingInterview, setStartingInterview] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [invitationDetails, setInvitationDetails] =
    useState<InvitationDetails | null>(null);
  const status = searchParams.get("status");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleConfirmAction = () => {
    console.log("Action Confirmed!");
    setIsDialogOpen(false);
  };

  const handleNextQuestion = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setHasAnswered(false);
    } else {
      alert("You have completed all questions!");
    }
  };

  const fetchInvitationDetails = async () => {
    if (!id) return;

    try {
      const data = await getInvitationDetails(id as string);
      setInvitationDetails(data);
      setQuestions(data.job.questions || []);
    } catch (error) {
      console.error("Error fetching invitation details:", error);
    }
  };

  const handleStartInterview = async () => {
    setStartingInterview(true); // Show the loading spinner
    try {
      setStart(true);
      const newQuery = { status: "started" };
      const invitationId = id as string;
      await startInterview({ invitationId });
      router.push(`?${new URLSearchParams(newQuery).toString()}`);
    } catch (error) {
      console.error("Error starting the interview:", error);
    } finally {
      setStartingInterview(false); // Hide the loading spinner
    }
  };

  useEffect(() => {
    if (status == "started") setStart(true);
    fetchInvitationDetails();
  }, [id, status]);

  if (!invitationDetails) {
    return <InterviewCardLoading />;
  }

  const { candidateName, candidateEmail, job, company } = invitationDetails;

  if (currentQuestionIndex > questions.length - 1) {
    return <ThankYou invitationDetails={invitationDetails} />;
  }

  return (
    <>
      {isStarted && (
        <div className="min-h-screen bg-gray-100">
          <Navbar maxWidth="full">
            <NavbarBrand>
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={`${company.name} Logo`}
                  width={100}
                  height={40}
                />
              ) : (
                <p className="font-bold text-inherit">{company.name}</p>
              )}
            </NavbarBrand>

            <NavbarContent justify="end">
              <NavbarItem>
                <div className="flex items-center gap-2">
                  <AiOutlineClockCircle />
                  <span>{currentTime}</span>
                </div>
              </NavbarItem>
              <NavbarItem>
                <Button
                  color="danger"
                  onPress={handleOpenDialog}
                  variant="solid"
                >
                  End Interview
                </Button>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          <main className="max-w-7xl mx-auto px-6 py-8">
            <Card className="p-8" shadow="none">
              <CardHeader className="justify-between mb-10">
                <div className="flex gap-5">
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      <span className="text-small tracking-tight text-default-400">
                        Hello,
                      </span>{" "}
                      {candidateName}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      {candidateEmail}
                    </h5>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-semibold">
                    <span className="text-gray-400 text-sm font-weight: 100 ">
                      Interviewing Position:
                    </span>{" "}
                    {job.jobTitle}
                  </h3>
                  <h3 className="text-md font-semibold">
                    <span className="text-gray-400 text-sm font-weight: 100 ">
                      Company:
                    </span>{" "}
                    {company.name}
                  </h3>
                </div>
              </CardHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="py-4" shadow="sm">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">
                      Questions #1
                    </p>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2">
                    <div className="p-4 border border-orange-400 bg-orange-200 rounded-lg mt-4">
                      <p className="">
                        {questions[currentQuestionIndex]?.text}
                      </p>
                    </div>
                  </CardBody>
                  <CardFooter className="absolute  bottom-0 z-10 border-1">
                    <div className="flex flex-grow gap-2 items-center">
                      <AudioRecorder
                        currentQuestion={questions[currentQuestionIndex]}
                        invitationId={id as string}
                        hasAnswered={hasAnswered}
                        setHasAnswered={setHasAnswered}
                        onNextQuestion={handleNextQuestion}
                      />
                    </div>
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
                      <p className="text-tiny uppercase font-bold">
                        INTERVIWER
                      </p>
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
                            {candidateEmail}
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
                        <span
                          aria-label="computer"
                          className="py-2"
                          role="img"
                        ></span>
                      </span>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Card>
            <ConfirmDialog
              isOpen={isDialogOpen}
              onClose={handleCloseDialog}
              title="Confirm Delete"
              description="Are you sure you want to delete this item? This action cannot be undone."
              onConfirm={handleConfirmAction}
              confirmButtonText="Yes, Delete"
              cancelButtonText="Cancel"
            />
          </main>
        </div>
      )}
      {!isStarted && (
        <InterviewCard
          loading={startingInterview}
          onStartButtonClick={handleStartInterview}
          invitationDetails={invitationDetails}
        />
      )}
      {currentQuestionIndex > questions.length - 1 && (
        <ThankYou invitationDetails={invitationDetails} />
      )}
    </>
  );
}
