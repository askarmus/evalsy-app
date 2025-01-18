"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";
import { AiOutlineAudio, AiOutlineClockCircle } from "react-icons/ai";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getInvitationDetails } from "@/services/invitation.service";
import InterviewCard from "./component/interview.card";
import InterviewCardLoading from "./component/interview.card.loading";
import { InvitationDetails } from "./interface/invitation.detail.int";

export default function InterviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const jobId = "677e5e1b02ba3cf8471a31dd"; //searchParams.get("id"); // Get the `id` from the URL search params

  const [currentTime, setCurrentTime] = useState("11:07:14 AM");
  const [isStarted, setStart] = useState(false);
  const [invitationDetails, setInvitationDetails] =
    useState<InvitationDetails | null>(null);
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const status = searchParams.get("status"); // Get the value of 'status'

  const fetchInvitationDetails = async () => {
    if (!jobId) return;

    try {
      const data = await getInvitationDetails("677e5e1b02ba3cf8471a31dd");
      setInvitationDetails(data);
      setSkippedQuestions(data.job.questions || []);
    } catch (error) {
      console.error("Error fetching invitation details:", error);
    }
  };

  const handleStartInterview = () => {
    setStart(true);
    const newQuery = { status: "started" };
    router.push(`?${new URLSearchParams(newQuery).toString()}`);
  };

  useEffect(() => {
    if (status == "started") setStart(true);
    fetchInvitationDetails();
  }, [jobId]);

  const restartQuestion = (index: number) => {
    const questionToRestart = skippedQuestions[index];
    setSkippedQuestions((prev) => prev.filter((_, i) => i !== index));
    console.log(`Restarting question: ${questionToRestart}`);
  };

  if (!invitationDetails) {
    return <InterviewCardLoading />;
  }

  const { candidateName, candidateEmail, job, company } = invitationDetails;

  return (
    <>
      {isStarted && (
        <div className="min-h-screen bg-gray-100">
          <Navbar maxWidth="full">
            <NavbarBrand>
              {company.logo ? (
                <img
                  src={company.logo}
                  style={{ maxHeight: "40px", maxWidth: "100%" }}
                  alt={`${company.name} Logo`}
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
                <Button color="danger" variant="solid">
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

                    <Button color="primary" variant="faded">
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
      )}
      {!isStarted && (
        <InterviewCard
          onStartButtonClick={handleStartInterview}
          invitationDetails={invitationDetails}
        />
      )}
    </>
  );
}
