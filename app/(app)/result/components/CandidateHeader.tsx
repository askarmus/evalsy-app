'use client';
import React from 'react';
import DateFormatter from '@/app/utils/DateFormatter';
import RatingChips from './rating,chips';
import { FaCalendar, FaCheckCircle } from 'react-icons/fa';

interface CandidateHeaderProps {
  selectedInterviewerData: any;
}

export default function CandidateHeader({ selectedInterviewerData }: CandidateHeaderProps) {
  return (
    <div className="border-b">
      <div className="p-6   border-b border-slate-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs font-medium text-gray-500">{selectedInterviewerData?.jobTitle}</div>
              <h1 className="text-xl font-bold">{selectedInterviewerData?.name}</h1>
            </div>
          </div>

          <div className="ml-auto text-sm space-y-1">
            <div className="grid grid-cols-[1fr_0.5fr_1fr] gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaCalendar color="gray" />
                  <span>Completed</span>
                </div>
                <span className="font-bold text-slate-700">{DateFormatter.formatDate(selectedInterviewerData?.statusUpdateAt, true)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaCheckCircle color="gray" />
                  <span>Score</span>
                </div>
                <span className="font-bold text-slate-700"> {selectedInterviewerData?.overallWeight}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FaCheckCircle className="color-slate-200" />
                  <span>Hire Rec.</span>
                </div>
                <span className="font-bold text-slate-700">Low</span>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Completed:</span>
              <span className="text-xs   text-gray-500">{DateFormatter.formatDate(selectedInterviewerData?.statusUpdateAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Total Score:</span>
              {selectedInterviewerData?.overallWeight}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Hire Rec.:</span>
              <RatingChips weight={selectedInterviewerData?.overallWeight} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
