'use client';
import React, { useState } from 'react';
import DateFormatter from '@/app/utils/DateFormatter';
import RatingChips from './rating,chips';
import { FaCalendar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import CandidateStatusDropdown from './CandidateStatusDropdown';
import { updateSelectionStatus } from '@/services/interview.service';
import { showToast } from '@/app/utils/toastUtils';
import { SelectionStatus } from '@/types/selectionStatus';

interface CandidateHeaderProps {
  selectedInterviewerData: any;
}

export default function CandidateHeader({ selectedInterviewerData }: CandidateHeaderProps) {
  const [isLoading, setIsLoading] = useState(false); // ✅ set to true by default
  const [selectedStatus, setSelectedStatus] = useState<SelectionStatus>((selectedInterviewerData?.selectionStatus?.toLowerCase?.() as SelectionStatus) || 'pending');

  const handleStatusChange = async (status: SelectionStatus) => {
    try {
      setIsLoading(true);
      await updateSelectionStatus({ id: selectedInterviewerData.id, selectionStatus: status });
      setSelectedStatus(status);
      showToast.success('Selection status updated');
    } catch (error: any) {
      console.error('Failed to update selection status:', error);
      showToast.error(error?.message || 'Failed to update selection status');
    } finally {
      setIsLoading(false);
    }
  };

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
              <span className="text-sm font-medium">{selectedInterviewerData?.fraudProbability ?? 0} %</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <CandidateStatusDropdown selectedStatus={selectedStatus} isLoading={isLoading} onChange={handleStatusChange} />
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
