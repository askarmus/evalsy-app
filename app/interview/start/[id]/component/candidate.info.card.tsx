import { Avatar, Card, CardBody, Divider } from "@heroui/react";
import React from "react";
import { AiOutlineBank, AiOutlineHome, AiOutlineMail, AiOutlineUser } from "react-icons/ai";

type CandidateInfoProps = {
  candidateName: string;
  candidateEmail: string;
  job: {
    jobTitle: string;
  };
  company: {
    name: string;
  };
};

const CandidateInfoCard: React.FC<CandidateInfoProps> = ({ candidateName, candidateEmail, job, company }) => {
  const stats = [
    { id: 1, name: "Transactions every 24 hours", value: "44 million" },
    { id: 2, name: "Assets under holding", value: "$119 trillion" },
    { id: 3, name: "New users annually", value: "46,000" },
  ];

  return (
    <div className='w-full mb-10'>
      <dl className='grid grid-cols-1 lg:grid-cols-3'>
        <div className=' flex max-w-xs flex-col  '>
          <div className='flex items-center gap-3 w-full sm:w-auto'>
            <Avatar name='XZ' className='w-12 h-12 text-lg' />
            <div>
              <h2 className='text-lg font-semibold'>Hello, {candidateName}</h2>
              <div className='flex items-center text-gray-500 text-sm gap-1'>
                <AiOutlineMail className='w-4 h-4' />
                <span> {candidateEmail}</span>
              </div>
            </div>
          </div>
        </div>
        <div className=' flex max-w-xs flex-col'>
          <p className='text-gray-400 text-sm'>Interviewing Position</p>
          <div className='flex items-center gap-1 text-black font-semibold'>
            <AiOutlineUser className='w-4 h-4' />
            <span>{job.jobTitle}</span>
          </div>
        </div>
        <div className=' flex max-w-xs flex-col  '>
          <p className='text-gray-400 text-sm'>Company</p>
          <div className='flex items-center gap-1 text-black font-semibold'>
            <AiOutlineBank className='w-4 h-4' />
            <span>{company.name}</span>
          </div>
        </div>
      </dl>
    </div>
  );
};

export default CandidateInfoCard;
