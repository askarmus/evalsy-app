'use client';
import { useState, useEffect, useMemo } from 'react';
import { Select, SelectItem } from '@heroui/react';
import { SelectionStatus, statusOptions } from '@/types/selectionStatus';

interface CandidateStatusDropdownProps {
  selectedStatus: SelectionStatus;
  isLoading?: boolean;
  onChange?: (newStatus: SelectionStatus) => void;
}

export default function CandidateStatusDropdown({ selectedStatus, isLoading, onChange }: CandidateStatusDropdownProps) {
  const [localStatus, setLocalStatus] = useState<SelectionStatus>(selectedStatus);

  useEffect(() => {
    // Sync with parent when prop changes
    setLocalStatus(selectedStatus);
  }, [selectedStatus]);

  const selectColor = useMemo(() => {
    switch (localStatus) {
      case 'rejected':
        return 'danger';
      case 'shortlisted':
        return 'success';
      case 'pending':
      default:
        return 'secondary';
    }
  }, [localStatus]);

  const handleSelectionChange = (keys: any) => {
    const newStatus = Array.from(keys)[0] as SelectionStatus;
    setLocalStatus(newStatus);
    onChange?.(newStatus);
  };

  return (
    <Select color={selectColor} isLoading={isLoading} label="Select status" classNames={{ base: 'w-36' }} size="sm" selectedKeys={[localStatus]} onSelectionChange={handleSelectionChange}>
      {statusOptions.map(({ label, value }) => (
        <SelectItem key={value}>{label}</SelectItem>
      ))}
    </Select>
  );
}
