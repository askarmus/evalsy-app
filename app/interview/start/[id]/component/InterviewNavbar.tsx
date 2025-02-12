import React from "react";
import Image from "next/image";
import CountdownTimer from "@/components/countdown.timer";
import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";
import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

interface Company {
  name: string;
  logo?: string;
}

interface InterviewNavbarProps {
  company: Company;
  totalMinutes: number;
  startTime: string;
  onInterviewComplete: () => void;
}

const InterviewNavbar: React.FC<InterviewNavbarProps> = ({ company, totalMinutes, startTime, onInterviewComplete }) => {
  return (
    <Navbar
      position='static'
      isBordered
      className='w-full'
      classNames={{
        wrapper: "w-full max-w-full color-line",
      }}>
      <NavbarBrand>{company.logo ? <Image src={company.logo} alt={`${company.name} Logo`} width={100} height={40} className='w-auto min-h-[30px] max-h-[40px] object-contain' /> : <p className='font-bold text-inherit'>{company.name}</p>}</NavbarBrand>

      <NavbarContent justify='end'>
        <NavbarItem className='hidden lg:flex'>
          <CountdownTimer totalMinutes={totalMinutes} startTime={startTime} onComplete={onInterviewComplete} />
        </NavbarItem>
        <NavbarItem>
          <DarkModeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default InterviewNavbar;
