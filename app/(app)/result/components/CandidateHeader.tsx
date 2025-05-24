'use client';
import React from 'react';
import DateFormatter from '@/app/utils/DateFormatter';
import RatingChips from './rating,chips';
import { FaCalendar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface CandidateHeaderProps {
  selectedInterviewerData: any;
}

export default function CandidateHeader({ selectedInterviewerData }: CandidateHeaderProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{selectedInterviewerData?.jobTitle}</span>
          <h2 className="text-xl font-bold">{selectedInterviewerData?.name}</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FaCalendar className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Completed</span>
              <span className="text-sm font-medium">{DateFormatter.formatDate(selectedInterviewerData?.statusUpdateAt, true)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Score</span>
              <span className="text-sm font-medium">{Math.floor(selectedInterviewerData?.totalScore)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Hire Rec.</span>
              <span className="text-sm font-medium">
                <RatingChips weight={selectedInterviewerData?.totalScore} />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaExclamationCircle className="h-4 w-4 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Fraud Risk</span>
              <span className="text-sm font-medium">{selectedInterviewerData?.fraudProbability ?? 0}%</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        <strong>Final Assessment </strong> {selectedInterviewerData?.finalAssessment || 'No final assessment provided.'}
      </p>
    </div>
  );
}
