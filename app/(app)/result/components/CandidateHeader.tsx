'use client';
import React, { useState } from 'react';
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
          <h2 className="text-xl font-bold text-secondary">{selectedInterviewerData?.name}</h2>
          <span className="text-sm text-gray-500">{selectedInterviewerData?.jobTitle}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <CandidateStatusDropdown selectedStatus={selectedInterviewerData.selectionStatus} isLoading={isLoading} onChange={handleStatusChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
