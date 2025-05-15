import { Button, Card, CardBody, CardFooter, Chip, Switch, User } from '@heroui/react';
import React, { useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import CandidateInfo from './CandidateInfo';
import { FaCamera, FaCheckCircle, FaMicrophone } from 'react-icons/fa';
import PoweredBy from './PoweredBy';
import InterviewNavbar from './InterviewNavbar';
import UserCamera from './UserCamera';

const InterviewInstruction: React.FC<any> = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { startInterview, duration, isLoading, company, candidate, job, questions } = useInterviewStore();

  const requestPermissions = async () => {
    if (permissionGranted) return;

    setIsChecking(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setPermissionGranted(true);
      setErrorMessage('');
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      setPermissionGranted(false);
      setErrorMessage('Permission denied! Please enable your camera and microphone to proceed.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="w-full max-w-screen-lg mx-auto px-6 py-8">
        <InterviewNavbar company={company} />
        <Card shadow="sm" radius="md" className="p-4 mt-6">
          <CandidateInfo candidate={candidate} company={company} job={job} addTopPadding={false} />

          <CardBody>
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
              <div className="flex flex-col">
                <span className="text-md font-semibold  ">Duration</span>
                <Chip size="sm" className="mt-2" color="danger" variant="faded" radius="lg">
                  {duration / 60} minutes
                </Chip>
              </div>

              <div className="flex flex-col">
                <span className="text-md font-semibold ">Total Questions</span>
                <Chip size="sm" className="mt-2" color="danger" variant="faded" radius="lg">
                  {job.totalQuestions}
                </Chip>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-[6px] md:mt-0 font-xs">
              <h1 className="text-md font-medium text-tertiary mb-2">Job Description</h1>

              <div className="relative">
                <div className={`text-primary4 container space-y-4 text-sm pr-2 ${showFullDescription ? 'max-h-full' : 'max-h-[160px] overflow-hidden'}`} dangerouslySetInnerHTML={{ __html: job?.description || '' }} />

                {!showFullDescription && <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none rounded-b-md" />}
              </div>

              <button onClick={() => setShowFullDescription((prev) => !prev)} className="text-black-600 text-xs text-blue-600   hover:underline mt-2 w-fit">
                {showFullDescription ? 'Read Less' : 'Read More'}
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mt-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="w-full sm:w-1/2 space-y-4">
                  <div className="flex items-center space-x-2 text-green-600">
                    <FaCheckCircle className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Device Check</h3>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCamera className={`h-5 w-5 ${permissionGranted ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Camera</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaMicrophone className={`h-5 w-5 ${permissionGranted ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Microphone</span>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                  <UserCamera hideRecLabel={true} height="120px" invitationId="" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <Switch isSelected={permissionGranted} onValueChange={requestPermissions} color="primary" size="sm" isDisabled={isChecking} />
              <span className="text-sm font-medium">{permissionGranted ? 'Camera & Microphone Enabled' : 'Enable Camera & Microphone'}</span>
            </div>

            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          </CardBody>

          <CardFooter>
            <div className="flex flex-col items-end space-y-2">
              <Button onPress={startInterview} isDisabled={!permissionGranted} color="success" isLoading={isLoading}>
                Start Interview
              </Button>
            </div>
          </CardFooter>
        </Card>
        <PoweredBy />
      </main>
    </div>
  );
};

export default InterviewInstruction;
