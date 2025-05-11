// types/ResumeFiltersType.ts
import { RangeValue, DateValue } from '@heroui/react';

export interface ResumeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRecommendations: string[];
  onRecommendationChange: (option: string, isSelected: boolean) => void;
  experienceRange: [number, number];
  onExperienceChange: (range: [number, number]) => void;
  dateRange: RangeValue<DateValue> | null;
  onDateChange: (range: RangeValue<DateValue> | null) => void;
  onClearFilters: () => void;
}
