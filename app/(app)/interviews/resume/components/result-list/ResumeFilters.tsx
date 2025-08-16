// components/ResumeFilters.tsx
import { Input, Slider, DateRangePicker, Checkbox, Button } from '@heroui/react';
import { FaSearch } from 'react-icons/fa';
import { ResumeFiltersProps } from '../../types/ResumeFiltersType';

export const ResumeFilters = ({ searchTerm, onSearchChange, dateRange, onDateChange, onClearFilters }: ResumeFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex flex-wrap gap-6 items-center flex-grow">
        <div className="relative">
          <Input size="md" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} isClearable aria-label="Search resumes" placeholder="Search Result" startContent={<FaSearch className="text-secondary" />} variant="bordered" />
        </div>

        <div className="min-w-[200px]">
          <DateRangePicker size="md" variant="bordered" aria-label="Filter by Date" value={dateRange} onChange={onDateChange} visibleMonths={1} />
        </div>
      </div>

      <div className="flex-shrink-0">
        <Button size="sm" variant="bordered" radius="full" color="secondary" onPress={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
