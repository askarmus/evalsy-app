import { Avatar, Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

interface Interviewer {
  name: string;
  jobTitle: string;
  biography: string;
  photoUrl?: string;
}

interface InterviewerCardProps {
  interviewer: Interviewer;
}

const InterviewerStartCard: React.FC<InterviewerCardProps> = ({
  interviewer,
}) => {
  return (
    <Card className="py-4" shadow="sm">
      {/* Card Title */}
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">INTERVIEWER</p>
      </CardHeader>

      {/* Interviewer Details */}
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          {/* Avatar */}
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={interviewer.photoUrl}
          />
          {/* Name & Job Title */}
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {interviewer.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {interviewer.jobTitle}
            </h5>
          </div>
        </div>
      </CardHeader>

      {/* Biography */}
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>{interviewer.biography}</p>
      </CardBody>
    </Card>
  );
};

export default InterviewerStartCard;
