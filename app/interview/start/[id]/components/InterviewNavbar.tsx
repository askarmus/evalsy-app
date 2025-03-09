import React from "react";
import Image from "next/image";
import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import InterviewTimer from "./InterviewTimer";
import { useInterviewStore } from "../stores/useInterviewStore";

const InterviewNavbar: React.FC<any> = ({ company }) => {
  const { phase, endInterview } = useInterviewStore();

  return (
    <Navbar position='static' isBordered className='w-full' classNames={{ wrapper: "w-full max-w-full color-line" }}>
      <NavbarBrand>{company?.logo ? <Image src={company?.logo} alt={`${company?.name} Logo`} width={100} height={40} className='w-auto min-h-[30px] max-h-[40px] object-contain' /> : <p className='font-bold text-inherit'>{company?.name}</p>}</NavbarBrand>
      <NavbarContent justify='end'>
        <NavbarItem className='hidden lg:flex'>
          <InterviewTimer />
        </NavbarItem>
        <NavbarItem className='hidden lg:flex'>
          {phase === "in-progress" && (
            <Button onPress={endInterview} color='danger' size='sm' variant='flat'>
              End Interview
            </Button>
          )}
        </NavbarItem>
        <NavbarItem>
          <DarkModeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default InterviewNavbar;
