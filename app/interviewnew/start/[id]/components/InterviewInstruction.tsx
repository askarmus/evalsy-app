import { Button, Card, CardBody, CardFooter, Checkbox, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import React, { useState } from "react";
import Image from "next/image";
import { useInterviewStore } from "../stores/useInterviewStore";
import CandidateInfo from "./CandidateInfo";
import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";

const InterviewInstruction: React.FC<any> = () => {
  const [isChecked, setIsChecked] = useState(false);
  const { startInterview, duration, isLoading, company, candidate, job, questions } = useInterviewStore();

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar position='static' isBordered className='w-full' classNames={{ wrapper: "w-full max-w-full color-line" }}>
        <NavbarBrand>{company.logo ? <Image src={company.logo} alt={`${company.name} Logo`} width={100} height={40} className='w-auto min-h-[30px] max-h-[40px] object-contain' /> : <p className='font-bold text-inherit'>{company.name}</p>}</NavbarBrand>
        <NavbarContent justify='end'>
          <NavbarItem>
            <DarkModeSwitch />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <main className='max-w-7xl mx-auto px-6 py-8'>
        <Card className='p-8' shadow='none'>
          <CandidateInfo candidate={candidate} company={company} job={job} />

          <CardBody>
            <div className='mb-5'>
              <div className='text-tiny uppercase font-bold mb-5'>Interview Information</div>

              <ul className='list-disc list-inside text-gray-700 space-y-1'>
                <li>
                  <strong>Duration:</strong> {duration} minutes
                </li>
                <li>
                  <strong>Total Questions:</strong> {questions.length}
                </li>
              </ul>
            </div>

            <div className='text-tiny uppercase font-bold mb-5'>Interview instruction</div>
            <ul className='list-decimal pl-6 space-y-1 text-gray-700'>
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

            <div className='mt-6'>
              <Checkbox color='primary' size='lg' isSelected={isChecked} onValueChange={setIsChecked}>
                I have read and understood all the instructions above.
              </Checkbox>
            </div>
          </CardBody>
          <CardFooter>
            <div className='flex flex-col items-start space-y-2'>
              <Button onPress={() => startInterview()} isDisabled={!isChecked} color='primary' isLoading={isLoading}>
                Start Interview
              </Button>

              <div className='text-small tracking-tight text-default-400'>
                <strong>Note:</strong> You must check the box before proceeding to the interview. The Start button will only be enabled after you confirm.
              </div>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default InterviewInstruction;
