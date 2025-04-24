import React, { useState } from "react";
import { Button, Divider } from "@heroui/react";
import InterviewTimer from "./InterviewTimer";
import { useInterviewStore } from "../stores/useInterviewStore";
import ConfirmDialog from "@/components/ConfirmDialog";

const InterviewNavbar: React.FC<any> = ({ company, hideTimer = false }) => {
  const { phase, endInterview, isLoading } = useInterviewStore();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleEndClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmEnd = async () => {
    try {
      await endInterview();
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error("Error ending interview", error);
    }
  };

  const handleCancelEnd = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <div className='flex justify-between items-center mb-4'>
      <div className='flex items-center gap-2'>
        <div className='font-bold'>{company?.name}</div>
        <Divider orientation='vertical' className='h-8 mr-2 ml-2' />
        <div className=' max-w-md mx-auto'>
          <h2 className='text-xs font-bold  mb-0'>Round One</h2>
          <p className='text-xs'>Technical Interview</p>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        {phase === "in-progress" && (
          <>
            <InterviewTimer />
            <Button onPress={handleEndClick} isDisabled={isLoading} isLoading={isLoading} color='danger' size='sm' variant='flat' radius='full'>
              End Interview
            </Button>
          </>
        )}
      </div>
      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelEnd} title='End Interview' description='Are you sure you want to end the interview?' onConfirm={handleConfirmEnd} confirmButtonText='End' cancelButtonText='Cancel' />
    </div>
  );
};

export default InterviewNavbar;
