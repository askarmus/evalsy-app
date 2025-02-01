import React from "react";
import Image from "next/image";
import CountdownTimer from "@/components/countdown.timer";

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

const InterviewNavbar: React.FC<InterviewNavbarProps> = ({
  company,
  totalMinutes,
  startTime,
  onInterviewComplete,
}) => {
  return (
    <nav className="flex items-center justify-between w-full bg-white shadow-md  ">
      {/* Company Logo or Name */}
      <div className="flex items-center">
        {company.logo ? (
          <Image
            src={company.logo}
            alt={`${company.name} Logo`}
            width={100}
            height={40}
            className="w-auto min-h-[30px] max-h-[40px] object-contain"
          />
        ) : (
          <p className="font-bold text-lg text-gray-800">{company.name}</p>
        )}
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center gap-2">
        <CountdownTimer
          totalMinutes={totalMinutes}
          startTime={startTime}
          onComplete={onInterviewComplete}
        />
      </div>
    </nav>
  );
};

export default InterviewNavbar;
