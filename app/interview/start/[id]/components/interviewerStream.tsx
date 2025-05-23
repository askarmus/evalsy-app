import React, { useEffect, useRef, useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import UserCamera from './UserCamera';
import InterviewNavbar from './InterviewNavbar';
import { Button, Card, CardBody } from '@heroui/react';
import CandidateInfo from './CandidateInfo';
import PoweredBy from './PoweredBy';

import { AntiCheat } from './AntiCheat';

import { FaPlay } from 'react-icons/fa';
import Agent from './Agent';

const interviewerStream: React.FC = () => {
  const { questions, invitationId, micDeviceId, candidate, job, company, currentQuestion, isRecording } = useInterviewStore();

  const [isRefreshed, setIsRefreshed] = useState(false);

  useEffect(() => {
    const isRefreshed = localStorage.getItem('pageRefreshed');
    if (isRefreshed) {
      localStorage.removeItem('pageRefreshed');
      setIsRefreshed(false);
    }
    localStorage.setItem('pageRefreshed', 'true');
    setIsRefreshed(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center  ">
      <div className="w-full max-w-screen-lg mx-auto px-6 py-8">
        <InterviewNavbar company={company} />
        <AntiCheat invitationId={invitationId} fraudDetection={job.fraudDetection} />
        <Card className="w-full p-0 mt-6  ">
          <CardBody className="p-0">
            <CandidateInfo candidate={candidate} job={job} company={company} questions={questions} currentQuestion={currentQuestion} invitationId={invitationId} />
            <div className="grid md:grid-cols-6 gap-0">
              <div className="md:col-span-3   p-4 border-l border-gray-200 dark:border-gray-900 flex items-center justify-center">
                <Agent userName="User" userId="21212" type="generate" />
              </div>

              <div className="md:col-span-3  ">
                <UserCamera height="500" hideRecLabel={false} invitationId={invitationId} />
              </div>
            </div>
            <div className="p-6 flex items-center justify-center  rounded-b-xl border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
              <Button color="danger" className="text-white" size="md" radius="full" variant="solid">
                End Interview
              </Button>
            </div>
          </CardBody>
        </Card>
        <PoweredBy />
      </div>
    </div>
  );
};

export default interviewerStream;
