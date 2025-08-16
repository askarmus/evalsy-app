import { useMemo, useState } from 'react';
import { UploadFile } from '../types/UploadFileType';
import { RangeValue, DateValue } from '@heroui/react';

export const useResumeFilters = (files: UploadFile[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = f.file.name.toLowerCase().includes(term);
      const candidateNameMatch = f.analysisResults?.candidateName?.toLowerCase().includes(term) ?? false;

      const createdAtDate = new Date(f.createdAt!);
      const dateMatch = !dateRange || ((!dateRange.start || createdAtDate >= new Date(dateRange.start.toString())) && (!dateRange.end || createdAtDate <= new Date(dateRange.end.toString())));

      return (nameMatch || candidateNameMatch) && dateMatch;
    });
  }, [files, searchTerm, dateRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    filteredFiles,
    clearFilters,
  };
};
