'use client';

import { SelectionStatus, statusOptions } from '@/types/selectionStatus';
import { Select, SelectItem } from '@heroui/react';
import { useMemo } from 'react';

interface CandidateStatusDropdownProps {
  selectedStatus: SelectionStatus;
  isLoading?: boolean;
  onChange?: (newStatus: SelectionStatus) => void;
}

export default function CandidateStatusDropdown({ selectedStatus, isLoading, onChange }: CandidateStatusDropdownProps) {
  const selectColor = useMemo(() => {
    switch (selectedStatus) {
      case 'rejected':
        return 'danger';
      case 'shortlisted':
        return 'success';
      case 'pending':
      default:
        return 'default';
    }
  }, [selectedStatus]);

  const handleSelectionChange = (keys: any) => {
    const newStatus = Array.from(keys)[0] as SelectionStatus;
    onChange?.(newStatus);
  };

  return (
    <Select color={selectColor} isLoading={isLoading} label="Select status" classNames={{ base: 'w-36' }} size="sm" selectedKeys={[selectedStatus]} onSelectionChange={handleSelectionChange}>
      {statusOptions.map(({ label, value }) => (
        <SelectItem key={value}>{label}</SelectItem>
      ))}
    </Select>
  );
}
