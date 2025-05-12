// components/ResumeFilters.tsx
import { Input, Slider, DateRangePicker, Checkbox, Button } from '@heroui/react';
import { FaSearch } from 'react-icons/fa';
import { ResumeFiltersProps } from '../../types/ResumeFiltersType';

const statusOptions = ['strong', 'weak', 'conditional'];

export const ResumeFilters = ({ searchTerm, onSearchChange, selectedRecommendations, onRecommendationChange, experienceRange, onExperienceChange, dateRange, onDateChange, onClearFilters }: ResumeFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex flex-wrap gap-6 items-center flex-grow">
        <div className="relative">
          <Input size="md" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} isClearable aria-label="Search resumes" placeholder="Search Result" startContent={<FaSearch />} variant="bordered" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <Checkbox size="md" key={option} isSelected={selectedRecommendations.includes(option)} onValueChange={(isSelected) => onRecommendationChange(option, isSelected)}>
              {option}
            </Checkbox>
          ))}
        </div>

        <div className="min-w-[200px]">
          <Slider
            size="md"
            aria-label="Experience Range"
            label={`Experience `}
            minValue={0}
            maxValue={30}
            step={1}
            value={experienceRange}
            onChange={(val) => {
              if (Array.isArray(val)) {
                onExperienceChange(val as [number, number]);
              }
            }}
            showTooltip
            className="w-full"
          />
        </div>
        <div className="min-w-[200px]">
          <DateRangePicker size="md" variant="bordered" aria-label="Filter by Date" value={dateRange} onChange={onDateChange} visibleMonths={1} />
        </div>
      </div>

      <div className="flex-shrink-0">
        <Button size="md" variant="bordered" onPress={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
