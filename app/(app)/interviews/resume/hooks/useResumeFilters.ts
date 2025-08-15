import { useMemo, useState } from 'react';
import { UploadFile } from '../types/UploadFileType';
import { RangeValue, DateValue } from '@heroui/react';

export const useResumeFilters = (files: UploadFile[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceRange, setExperienceRange] = useState<[number, number]>([0, 30]);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = f.file.name.toLowerCase().includes(term);
      const candidateNameMatch = f.analysisResults?.candidateName?.toLowerCase().includes(term) ?? false;
      const experience = f.analysisResults?.totalExperience ?? 0;
      const experienceMatch = experience >= experienceRange[0] && experience <= experienceRange[1];
      const createdAtDate = new Date(f.createdAt!);
      const dateMatch = !dateRange || ((!dateRange.start || createdAtDate >= new Date(dateRange.start.toString())) && (!dateRange.end || createdAtDate <= new Date(dateRange.end.toString())));

      return (nameMatch || candidateNameMatch) && experienceMatch && dateMatch;
    });
  }, [files, searchTerm, experienceRange, dateRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setExperienceRange([0, 30]);
    setDateRange(null);
  };

  return {
    searchTerm,
    setSearchTerm,
    experienceRange,
    setExperienceRange,
    dateRange,
    setDateRange,
    filteredFiles,
    clearFilters,
  };
};
