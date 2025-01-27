import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Navbar,
  NavbarBrand,
} from "@heroui/react";
import React, { useState } from "react";
import Image from "next/image";

interface InterviewCardProps {
  invitationDetails: any;
  onStartButtonClick: () => void;
  loading: boolean;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  invitationDetails,
  onStartButtonClick,
  loading,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar maxWidth="full">
        <NavbarBrand>
          {invitationDetails.company.logo ? (
            <Image
              src={invitationDetails.company.logo}
              width={100}
              height={50}
              alt={`${invitationDetails.company.name} Logo`}
            />
          ) : (
            <p className="font-bold text-inherit">
              {invitationDetails.company.name}
            </p>
          )}
        </NavbarBrand>
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
                  {invitationDetails.candidateName}
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  {invitationDetails.candidateEmail}
                </h5>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                <span className="text-gray-400  font-semibold ">
                  Intterviwing Position:
                </span>{" "}
                {invitationDetails.job.jobTitle}
              </h3>
              <p className="text-gray-500"> {invitationDetails.company.name}</p>
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
                  <strong>Total Questions:</strong>{" "}
                  {invitationDetails.job.questions.length}
                </li>
              </ul>
            </div>

            <div className="text-tiny uppercase font-bold mb-5">
              Interview instruction
            </div>
            <ul className="list-decimal pl-6 space-y-1 text-gray-700">
              <li>
                <strong>Enable Your Microphone and Camera:</strong> Ensure your
                microphone and camera are active before starting the session.
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
                <strong>Ensure a Quiet Environment:</strong> Select a well-lit,
                quiet location free from distractions or interruptions.
              </li>
              <li>
                <strong>Follow On-Screen Prompts:</strong> Carefully read and
                follow the prompts provided during the interview process.
              </li>
            </ul>

            <div className="mt-6">
              <Checkbox
                color="primary"
                size="lg"
                isSelected={isChecked}
                onValueChange={setIsChecked}
              >
                I have read and understood all the instructions above.
              </Checkbox>
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex flex-col items-start space-y-2">
              <Button
                onPress={onStartButtonClick}
                isDisabled={!isChecked}
                color="success"
                isLoading={loading}
              >
                Start Interview
              </Button>
              <div className="text-small tracking-tight text-default-400">
                <strong>Note:</strong> You must check the box before proceeding
                to the interview. The Start button will only be enabled after
                you confirm.
              </div>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default InterviewCard;
