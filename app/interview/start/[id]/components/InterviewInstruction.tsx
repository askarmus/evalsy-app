import { Button, Card, CardBody, CardFooter, Navbar, NavbarBrand, NavbarContent, NavbarItem, Switch } from "@heroui/react";
import React, { useState } from "react";
import Image from "next/image";
import { useInterviewStore } from "../stores/useInterviewStore";
import CandidateInfo from "./CandidateInfo";
import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";

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
    <div className='min-h-screen'>
      <Navbar position='static' isBordered className='w-full' classNames={{ wrapper: "w-full max-w-full color-line" }}>
        <NavbarBrand>{company.logo ? <Image src={company.logo} alt={`${company.name} Logo`} width={100} height={40} className='w-auto min-h-[30px] max-h-[40px] object-contain' /> : <p className='font-bold text-inherit'>{company.name}</p>}</NavbarBrand>
        <NavbarContent justify='end'>
          <NavbarItem>
            <DarkModeSwitch />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className='max-w-7xl mx-auto px-6 py-8'>
        <Card shadow='sm' className='p-8'>
          <CandidateInfo candidate={candidate} company={company} job={job} />

          <CardBody>
            <div className='mb-5'>
              <div className='text-tiny uppercase font-bold mb-5'>Interview Information</div>
              <ul className='list-disc list-inside space-y-2'>
                <li>
                  <strong>Duration:</strong> {duration / 60} minutes
                </li>
                <li>
                  <strong>Total Questions:</strong> {job.totalQuestions}
                </li>
              </ul>
            </div>

            <div className='text-tiny uppercase font-bold mb-5'>Interview Instructions</div>
            <ul className='list-decimal pl-6 space-y-2'>
              <li>
                <strong>Enable Your Microphone and Camera:</strong> Ensure your microphone and camera are active before starting the session.
              </li>
              <li>
                <strong>Video Recording Notice:</strong> Your video and audio will be recorded for evaluation purposes.
              </li>
              <li>
                <strong>Maintain Eye Contact:</strong> Look directly into the camera for a professional and engaging appearance.
              </li>
              <li>
                <strong>Respond Clearly and Concisely:</strong> Speak clearly, stay on topic, and ensure your responses fit within the given time.
              </li>
              <li>
                <strong>Ensure a Quiet Environment:</strong> Select a well-lit, quiet location free from distractions or interruptions.
              </li>
              <li>
                <strong>Follow On-Screen Prompts:</strong> Carefully read and follow the prompts provided during the interview process.
              </li>
            </ul>

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
            <div className='flex flex-col items-start space-y-2'>
              <Button onPress={startInterview} isDisabled={!permissionGranted} color='primary' isLoading={isLoading}>
                Start Interview
              </Button>

              <div className='text-small tracking-tight text-default-400'>
                <strong>Note:</strong> You must enable your camera & microphone before starting the interview.
              </div>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default InterviewInstruction;
