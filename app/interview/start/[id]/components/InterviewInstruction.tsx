import { Button, Card, CardBody, CardFooter, Chip, Divider } from '@heroui/react';
import React, { useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import CandidateInfo from './CandidateInfo';
import PoweredBy from './PoweredBy';
import InterviewNavbar from './InterviewNavbar';
import MediaPermission from './MediaPermission';
import { ChevronRight, Mic, Video } from 'lucide-react';

const InterviewInstruction: React.FC<any> = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMicTest, setShowMicTest] = useState(false);
  const [status, setStatus] = useState<'pending' | 'granted' | 'denied' | 'blocked'>('pending');

  const { startInterview, setMicDeviceId, duration, isLoading, company, candidate, job } = useInterviewStore();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-screen-lg mx-auto px-6 py-8">
        <Card shadow="lg" radius="lg" className="p-4 mt-6">
          <CandidateInfo candidate={candidate} company={company} job={job} addTopPadding={false} />

          {!showMicTest && (
            <CardBody>
              <div className="mt-1 flex flex-col gap-[6px] font-xs">
                <h1 className="text-md font-medium text-tertiary mb-2">Job Description</h1>

                <div className="relative">
                  <div className={`text-primary4 container space-y-4 text-sm pr-2 ${showFullDescription ? 'max-h-full' : 'max-h-[160px] overflow-hidden'}`} dangerouslySetInnerHTML={{ __html: job?.description || '' }} />
                  {!showFullDescription && <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none rounded-b-md" />}
                </div>

                <Button variant="ghost" size="sm" onPress={() => setShowFullDescription((prev) => !prev)} className="w-fit">
                  {showFullDescription ? 'Read Less' : 'Read More'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <Divider className="mt-6" />
            </CardBody>
          )}
          {showMicTest && (
            <CardBody>
              <MediaPermission
                onPermissionChange={(newStatus) => {
                  setStatus(newStatus);
                }}
              />
            </CardBody>
          )}
          <CardFooter>
            <div className="flex items-center justify-end w-full">
              {showMicTest && (
                <Button size="md" onPress={startInterview} color="secondary" isLoading={isLoading} isDisabled={status !== 'granted'} variant="solid" radius="full">
                  Start Interview
                </Button>
              )}

              {!showMicTest && (
                <Button isLoading={isLoading} onPress={() => setShowMicTest(true)} size="md" color="secondary" radius="full">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <Mic className="w-4 h-4" />
                    <span>Next: Test your mic and video</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
        <PoweredBy />
      </main>
    </div>
  );
};

export default InterviewInstruction;
