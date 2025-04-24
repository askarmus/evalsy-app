import { Progress } from "@heroui/react";
import React from "react";

const InterviewProgress: React.FC<any> = ({ candidate, job, company, questions, currentQuestion, addTopPadding = true }) => {
  return (
    <div>
      {questions && (
        <div className=''>
          <Progress
            className='w-full'
            color='default'
            formatOptions={{
              style: "percent",
              unit: "percent",
              unitDisplay: "long",
            }}
            label={
              <div className='inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900 dark:to-teal-900 text-teal-700 dark:text-teal-300 text-sm font-medium'>
                <span className='flex h-3 w-3 rounded-full bg-teal-600 mr-2 animate-pulse'></span>
                {currentQuestion + 1} of {questions?.length}
              </div>
            }
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

export default InterviewProgress;
