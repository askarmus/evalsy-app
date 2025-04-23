import { Avatar, Chip, Progress } from "@heroui/react";
import React from "react";

const CandidateInfo: React.FC<any> = ({ candidate, job, company, questions, currentQuestion, addTopPadding = true }) => {
  return (
    <div className={`p-6 ${addTopPadding ? "pt-6" : "pt-0"} border-b`}>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-3'>
        <div className='flex items-center gap-4'>
          <Avatar name={candidate.name?.charAt(0) || "C"} className='w-12 h-12 text-lg hidden sm:flex' color='primary' />
          <div>
            <h2 className='text-xl font-semibold'>{candidate.name}</h2>
            <div className='flex items-center gap-3 mt-0'>
              <p className='text-sm  flex items-center gap-1'>{candidate.email}</p>
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-4 md:items-center'>
          <div className='flex flex-col'>
            <span className='text-xs  '>Interviewing Position</span>
            <Chip size='sm' className='mt-2' color='primary' variant='faded'>
              {job.jobTitle}
            </Chip>
          </div>
        </div>
      </div>

      {questions && (
        <div className='mt-3'>
          <Progress
            className='w-full'
            color='default'
            formatOptions={{
              style: "percent",
              unit: "percent",
              unitDisplay: "long",
            }}
            label={`${currentQuestion + 1} of ${questions?.length}`}
            maxValue={questions?.length}
            showValueLabel={true}
            size='sm'
            value={currentQuestion}
            valueLabel={`${((currentQuestion / questions?.length) * 100).toFixed(0)}% Completed`}
          />
        </div>
      )}
    </div>
  );
};

export default CandidateInfo;
