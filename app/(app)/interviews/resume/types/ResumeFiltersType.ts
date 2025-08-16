// types/ResumeFiltersType.ts
import { RangeValue, DateValue } from '@heroui/react';

export interface ResumeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateRange: RangeValue<DateValue> | null;
  onDateChange: (range: RangeValue<DateValue> | null) => void;
  onClearFilters: () => void;
}
