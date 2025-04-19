import { Button, Card, CardBody, CardFooter, Navbar, NavbarBrand, NavbarContent, NavbarItem, Switch } from "@heroui/react";
import React, { useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import CandidateInfo from "./CandidateInfo";
import { FaAngleRight, FaCamera, FaCheck, FaCheckCircle, FaMicrophone, FaVideo } from "react-icons/fa";

const InterviewInstruction: React.FC<any> = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isChecking, setIsChecking] = useState(false); // Prevents toggling when requesting permissions
  const [errorMessage, setErrorMessage] = useState("");

  const { startInterview, duration, isLoading, company, candidate, job, questions } = useInterviewStore();

  const requestPermissions = async () => {
    if (permissionGranted) {
      // Prevent switching OFF since it's required for the interview
      return;
    }

    setIsChecking(true); // Disable switch during permission request

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setPermissionGranted(true);
      setErrorMessage("");
      stream.getTracks().forEach((track) => track.stop()); // Stop media after checking
    } catch (error) {
      setPermissionGranted(false);
      setErrorMessage("Permission denied! Please enable your camera and microphone to proceed.");
    } finally {
      setIsChecking(false); // Re-enable switch
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <main className='w-full max-w-screen-xl mx-auto px-6 py-8'>
        <Card shadow='none' className='p-8'>
          <CandidateInfo candidate={candidate} company={company} job={job} />

          <CardBody>
            <div className='mb-5'>
              <div className='text-tiny uppercase font-semibold  mb-5'>Interview Information</div>
              <ul className='list-disc list-inside space-y-2'>
                <li>
                  <strong className='semibold'>Duration:</strong> {duration / 60} minutes
                </li>
                <li>
                  <strong>Total Questions:</strong> {job.totalQuestions}
                </li>
              </ul>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2'>
                <FaVideo className='h-5 w-5 text-violet-500' />
                Interview Instructions
              </h3>
              <ol className='space-y-3 list-decimal list-inside text-slate-700'>
                <li className='pl-2'>
                  <span className='font-medium text-slate-800'>Enable Your Microphone and Camera:</span>
                  <span className='text-slate-600'> Ensure your microphone and camera are active before starting the session.</span>
                </li>
                <li className='pl-2'>
                  <span className='font-medium text-slate-800'>Video Recording Notice:</span>
                  <span className='text-slate-600'> Your video and audio will be recorded for evaluation purposes.</span>
                </li>
                <li className='pl-2'>
                  <span className='font-medium text-slate-800'>Maintain Eye Contact:</span>
                  <span className='text-slate-600'> Look directly into the camera for a professional and engaging appearance.</span>
                </li>
                <li className='pl-2'>
                  <span className='font-medium text-slate-800'>Respond Clearly and Concisely:</span>
                  <span className='text-slate-600'> Speak clearly, stay on topic, and ensure your responses fit within the given time.</span>
                </li>
                <li className='pl-2'>
                  <span className='font-medium text-slate-800'>Ensure a Quiet Environment:</span>
                  <span className='text-slate-600'> Select a well-lit, quiet location free from distractions or interruptions.</span>
                </li>
                <li className='pl-2'>
                  <span className='font-medium text-slate-800'>Follow On-Screen Prompts:</span>
                  <span className='text-slate-600'> Carefully read and follow the prompts provided during the interview process.</span>
                </li>
              </ol>
            </div>

            <div className='bg-violet-50 rounded-lg p-4 mt-6'>
              <div className='flex items-center gap-2 mb-3'>
                <FaCheckCircle className='h-5 w-5 text-green-600' />
                <h3 className='text-lg font-semibold text-slate-800'>Device Check</h3>
              </div>
              <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <FaCamera className={`h-4 w-4 ${permissionGranted ? "text-green-600" : "text-slate-400"}`} />
                  <FaMicrophone className={`h-4 w-4 ${permissionGranted ? "text-green-600" : "text-slate-400"}`} />
                  <span className='text-sm font-medium text-slate-700'>Camera & Microphone</span>
                </div>
              </div>
            </div>
            {/* Fixed Permission Toggle */}
            <div className='mt-6 flex items-center space-x-3'>
              <Switch
                isSelected={permissionGranted}
                onValueChange={requestPermissions}
                color='primary'
                size='sm'
                isDisabled={isChecking} // Disable switch while checking
              />
              <span className='text-sm font-medium'>{permissionGranted ? "Camera & Microphone Enabled" : "Enable Camera & Microphone"}</span>
            </div>

            {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
          </CardBody>

          <CardFooter>
            <div className='flex flex-col items-end space-y-2'>
              <Button onPress={startInterview} isDisabled={!permissionGranted} color='primary' isLoading={isLoading}>
                Start Interview
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default InterviewInstruction;
