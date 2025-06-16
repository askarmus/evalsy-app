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
            <div className="flex flex-col">
              <CandidateStatusDropdown selectedStatus={selectedStatus} isLoading={isLoading} onChange={handleStatusChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
