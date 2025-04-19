import React, { useState } from "react";
import Image from "next/image";
import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";
import { Button, Divider, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import InterviewTimer from "./InterviewTimer";
import { useInterviewStore } from "../stores/useInterviewStore";
import ConfirmDialog from "@/components/ConfirmDialog";
import { FaChair } from "react-icons/fa";

const InterviewNavbar: React.FC<any> = ({ company }) => {
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
        {company?.logo ? <Image src={company?.logo} alt={`${company?.name} Logo`} width={80} height={35} className='w-auto min-h-[30px] max-h-[40px] object-contain' /> : <p className='font-bold text-inherit'>{company?.name}</p>}
        <Divider orientation='vertical' className='h-8 mr-2 ml-2' />
        <div className=' max-w-md mx-auto'>
          <h2 className='text-xs font-bold text-gray-800 mb-0'>Round One</h2>
          <p className='text-sm text-gray-600'>Technical Interview</p>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <InterviewTimer />
        {phase === "in-progress" && (
          <Button onPress={handleEndClick} isDisabled={isLoading} isLoading={isLoading} color='danger' size='sm' variant='flat' radius='full'>
            End Interview
          </Button>
        )}
      </div>
      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelEnd} title='End Interview' description='Are you sure you want to end the interview?' onConfirm={handleConfirmEnd} confirmButtonText='End' cancelButtonText='Cancel' />
    </div>
  );
};

export default InterviewNavbar;
