import { Button, Card, CardBody, CardFooter, Chip } from '@heroui/react';
import React, { useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import CandidateInfo from './CandidateInfo';
import PoweredBy from './PoweredBy';
import InterviewNavbar from './InterviewNavbar';
import MediaPermission from './MediaPermission';

const InterviewInstruction: React.FC<any> = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMicTest, setShowMicTest] = useState(false);
  const [status, setStatus] = useState<'pending' | 'granted' | 'denied' | 'blocked'>('pending');

  const { startInterview, setMicDeviceId, duration, isLoading, company, candidate, job } = useInterviewStore();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-screen-lg mx-auto px-6 py-8">
        <InterviewNavbar company={company} />
        <Card shadow="sm" radius="md" className="p-4 mt-6">
          <CandidateInfo candidate={candidate} company={company} job={job} addTopPadding={false} />

          {!showMicTest && (
            <CardBody>
              <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
                <div className="flex flex-col">
                  <span className="text-md font-semibold">Duration</span>
                  <Chip size="sm" className="mt-2" color="danger" variant="faded" radius="lg">
                    {duration / 60} minutes
                  </Chip>
                </div>

                <div className="flex flex-col">
                  <span className="text-md font-semibold">Total Questions</span>
                  <Chip size="sm" className="mt-2" color="danger" variant="faded" radius="lg">
                    {job.totalQuestions}
                  </Chip>
                </div>
              </div>

              <div className="mt-1 flex flex-col gap-[6px] font-xs">
                <h1 className="text-md font-medium text-tertiary mb-2">Job Description</h1>

                <div className="relative">
                  <div className={`text-primary4 container space-y-4 text-sm pr-2 ${showFullDescription ? 'max-h-full' : 'max-h-[160px] overflow-hidden'}`} dangerouslySetInnerHTML={{ __html: job?.description || '' }} />
                  {!showFullDescription && <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none rounded-b-md" />}
                </div>

                <button onClick={() => setShowFullDescription((prev) => !prev)} className="text-black-600 text-xs text-blue-600 hover:underline mt-2 w-fit">
                  {showFullDescription ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </CardBody>
          )}
          {showMicTest && (
            <CardBody>
              <MediaPermission
                onPermissionChange={(newStatus) => {
                  console.log('Permission status:', newStatus);
                  setStatus(newStatus);
                }}
              />
            </CardBody>
          )}
          <CardFooter>
            <div className="flex items-center justify-end w-full">
              <div className="flex gap-2">
                {showMicTest && (
                  <Button onPress={startInterview} color="success" isLoading={isLoading} isDisabled={status !== 'granted'} variant="solid" radius="full">
                    Start Interview
                  </Button>
                )}

                {!showMicTest && (
                  <Button onPress={() => setShowMicTest(true)} color="success" variant="bordered" radius="full" isLoading={isLoading}>
                    Next: Test your video and mic
                  </Button>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
        <PoweredBy />
      </main>
    </div>
  );
};

export default InterviewInstruction;
