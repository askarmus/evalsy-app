import { Button, Card, CardBody, CardFooter, Chip, Switch } from "@heroui/react";
import React, { useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import CandidateInfo from "./CandidateInfo";
import { FaCamera, FaCheckCircle, FaMicrophone } from "react-icons/fa";
import PoweredBy from "./PoweredBy";
import InterviewNavbar from "./InterviewNavbar";

const InterviewInstruction: React.FC<any> = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      setErrorMessage("");
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      setPermissionGranted(false);
      setErrorMessage("Permission denied! Please enable your camera and microphone to proceed.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <main className='w-full max-w-screen-xl mx-auto px-6 py-8'>
        <InterviewNavbar company={company} />
        <Card shadow='sm' radius='sm' className='p-8 mt-6'>
          <CandidateInfo candidate={candidate} company={company} job={job} addTopPadding={false} />

          <CardBody>
            <div className='flex flex-col md:flex-row gap-4 md:items-center mb-8'>
              <div className='flex flex-col'>
                <span className='text-md font-semibold  '>Duration</span>
                <Chip size='sm' className='mt-2' color='danger' variant='faded' radius='lg'>
                  {duration / 60} minutes
                </Chip>
              </div>

              <div className='flex flex-col'>
                <span className='text-md font-semibold '>Total Questions</span>
                <Chip size='sm' className='mt-2' color='danger' variant='faded' radius='lg'>
                  {job.totalQuestions}
                </Chip>
              </div>
            </div>

            <div className='mt-8 flex flex-col gap-[6px] md:mt-0 font-xs'>
              <h1 className='text-md font-medium text-tertiary'>Job Description</h1>

              <div className='relative'>
                <div className={`text-primary4 container space-y-4 text-sm  pr-2 ${showFullDescription ? "max-h-full" : "max-h-[160px] overflow-hidden"}`}>{job?.description}</div>

                {!showFullDescription && <div className='absolute bottom-0 left-0 right-0 h-16 pointer-events-none rounded-b-md' />}
              </div>

              <button onClick={() => setShowFullDescription((prev) => !prev)} className='text-black-600 text-xs font-semibold  hover:underline mt-2 w-fit'>
                {showFullDescription ? "Read Less" : "Read More"}
              </button>
            </div>

            <div className='bg-gray-50 rounded-lg p-4 mt-6'>
              <div className='flex items-center gap-2 mb-3'>
                <FaCheckCircle className='h-4 w-4 text-green-600' />
                <h3 className='text-sm font-semibold text-slate-800'>Device Check</h3>
              </div>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <FaCamera className={`h-4 w-4 ${permissionGranted ? "text-green-600" : "text-slate-400"}`} />
                  <FaMicrophone className={`h-4 w-4 ${permissionGranted ? "text-green-600" : "text-slate-400"}`} />
                  <span className='text-sm font-medium text-slate-700'>Camera & Microphone</span>
                </div>
              </div>
            </div>

            <div className='mt-6 flex items-center space-x-3'>
              <Switch isSelected={permissionGranted} onValueChange={requestPermissions} color='primary' size='sm' isDisabled={isChecking} />
              <span className='text-sm font-medium'>{permissionGranted ? "Camera & Microphone Enabled" : "Enable Camera & Microphone"}</span>
            </div>

            {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
          </CardBody>

          <CardFooter>
            <div className='flex flex-col items-end space-y-2'>
              <Button onPress={startInterview} isDisabled={!permissionGranted} color='success' isLoading={isLoading}>
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
