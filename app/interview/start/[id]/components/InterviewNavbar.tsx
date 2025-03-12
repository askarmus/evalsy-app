import React, { useState } from "react";
import Image from "next/image";
import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import InterviewTimer from "./InterviewTimer";
import { useInterviewStore } from "../stores/useInterviewStore";
import ConfirmDialog from "@/components/ConfirmDialog";

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
    <Navbar position='static' isBordered className='w-full' classNames={{ wrapper: "w-full max-w-full color-line" }}>
      <NavbarBrand>{company?.logo ? <Image src={company?.logo} alt={`${company?.name} Logo`} width={100} height={40} className='w-auto min-h-[30px] max-h-[40px] object-contain' /> : <p className='font-bold text-inherit'>{company?.name}</p>}</NavbarBrand>
      <NavbarContent justify='end'>
        <NavbarItem>
          <InterviewTimer />
        </NavbarItem>
        <NavbarItem>
          {phase === "in-progress" && (
            <Button onPress={handleEndClick} isDisabled={isLoading} isLoading={isLoading} color='danger' size='sm' variant='flat'>
              End Interview
            </Button>
          )}
        </NavbarItem>
        <NavbarItem>
          <DarkModeSwitch />
        </NavbarItem>
      </NavbarContent>
      <ConfirmDialog isOpen={isConfirmDialogOpen} onClose={handleCancelEnd} title='End Interview' description='Are you sure you want to end the interview?' onConfirm={handleConfirmEnd} confirmButtonText='End' cancelButtonText='Cancel' />
    </Navbar>
  );
};

export default InterviewNavbar;
