'use client';
import { Input, Tabs, Tab, Chip } from '@heroui/react';
import { FaSearch } from 'react-icons/fa';
import React from 'react';

interface QuestionSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const QuestionSearchAndFilter = ({ searchTerm, setSearchTerm }: QuestionSearchAndFilterProps) => {
  return (
    <div className="flex justify-between flex-wrap gap-4 items-center">
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        <Input
          size="md"
          isClearable
          className="max-w-md"
          placeholder="Search questions"
          onClear={() => {
            setSearchTerm('');
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<FaSearch />}
          variant="bordered"
        />
      </div>
    </div>
  );
};
