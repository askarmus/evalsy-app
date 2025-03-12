import { Avatar, Card, CardBody } from "@heroui/react";
import React from "react";
import { AiOutlineBank, AiOutlineMail, AiOutlineUser } from "react-icons/ai";

const CandidateInfo: React.FC<any> = ({ candidate, job, company }) => {
  return (
    <div className='w-full mb-10 px-4 sm:px-6'>
      <Card>
        <CardBody>
          <dl className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Candidate Info */}
            <div className='flex flex-col'>
              <div className='flex items-center gap-3'>
                <Avatar name={candidate.name?.charAt(0) || "C"} className='w-12 h-12 text-lg hidden sm:flex' color='primary' />
                <div>
                  <h2 className='text-lg font-semibold'>Hello, {candidate.name}</h2>
                  <div className='flex items-center text-gray-500 text-sm gap-1'>
                    <AiOutlineMail className='w-4 h-4' />
                    <span>{candidate.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interviewing Position */}
            <div className='flex flex-col'>
              <p className='text-gray-400 text-sm'>Interviewing Position</p>
              <div className='flex items-center gap-1 font-semibold'>
                <AiOutlineUser className='w-4 h-4' />
                <span>{job.jobTitle}</span>
              </div>
            </div>

            {/* Company Info */}
            <div className='flex flex-col'>
              <p className='text-gray-400 text-sm'>Company</p>
              <div className='flex items-center gap-1 font-semibold'>
                <AiOutlineBank className='w-4 h-4' />
                <span>{company.name}</span>
              </div>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
};

export default CandidateInfo;
