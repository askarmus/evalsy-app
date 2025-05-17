import { Button, Card, CardBody, CardFooter, Chip, Switch } from '@heroui/react';
import React, { useEffect, useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import CandidateInfo from './CandidateInfo';
import { FaCamera, FaCheckCircle, FaMicrophone } from 'react-icons/fa';
import PoweredBy from './PoweredBy';
import InterviewNavbar from './InterviewNavbar';
import UserCamera from './UserCamera';
import MicTestModal from './MicTestModal';

const InterviewInstruction: React.FC<any> = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [micTested, setMicTested] = useState(false);
  const [micModalOpen, setMicModalOpen] = useState(false);

  const { startInterview, setMicDeviceId, duration, isLoading, company, candidate, job } = useInterviewStore();

  const requestPermissions = async () => {
    if (permissionGranted) return;
    setIsChecking(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mt-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-start sm:gap-6">
                  <div className="flex items-center space-x-2 text-green-600 mb-2 sm:mb-0">
                    <FaCheckCircle className="h-5 w-5" />
                    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Device Check</h3>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCamera className={`h-5 w-5 ${permissionGranted ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Camera</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaMicrophone className={`h-5 w-5 ${micTested ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Microphone</span>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                  <UserCamera hideRecLabel={true} height="50px" invitationId="" enableCapture={false} />
                </div>
              </div>
            </div>

            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          </CardBody>
          <CardFooter>
            <div className="flex items-center justify-between w-full  ">
              <div className="flex items-center space-x-4">
                <Switch isSelected={permissionGranted} onValueChange={requestPermissions} color="primary" size="sm" isDisabled={isChecking} />
                <span className="text-sm font-medium">{permissionGranted ? 'Camera & Mic Enabled' : 'Click to Enable Camera & Mic'}</span>

                {permissionGranted && (
                  <Button onPress={() => setMicModalOpen(true)} color="primary" size="sm">
                    Test Microphone
                  </Button>
                )}
              </div>

              <Button onPress={startInterview} isDisabled={!permissionGranted || !micTested} color="success" isLoading={isLoading}>
                Start Interview
              </Button>
            </div>
          </CardFooter>
        </Card>
        <PoweredBy />
        <MicTestModal
          isOpen={micModalOpen}
          onClose={() => {
            setMicModalOpen(false);
            setMicTested(true);
          }}
        />
      </main>
    </div>
  );
};

export default InterviewInstruction;
