import React from "react";

type CandidateInfoProps = {
  candidateName: string;
  candidateEmail: string;
  job: {
    jobTitle: string;
  };
  company: {
    name: string;
  };
};

const CandidateInfoCard: React.FC<CandidateInfoProps> = ({
  candidateName,
  candidateEmail,
  job,
  company,
}) => {
  return (
    <div className="justify-between mb-10">
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
    </div>
  );
};

export default CandidateInfoCard;
