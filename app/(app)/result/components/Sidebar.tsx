'use client';
import React from 'react';
import { Tabs, Tab, Input, Button, Avatar, Badge } from '@heroui/react';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';
import RatingChips from './rating,chips';
import { formatRelativeDate } from '@/app/utils/formatRelativeDate';
import RatingBadges from './rating,badge';

interface SidebarProps {
  sidebarOpen: boolean;
  selectedTab: string;
  setSelectedTab: (key: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  fetchInterviewResult: () => void;
  items: any[];
  selectedId: string | null;
  setSidebarOpen: (val: boolean) => void;
  handleViewDetails: (id: string) => void;
}

export default function Sidebar({ sidebarOpen, selectedTab, setSelectedTab, filterValue, setFilterValue, onSearchChange, isLoading, fetchInterviewResult, items, selectedId, setSidebarOpen, handleViewDetails }: SidebarProps) {
  return (
    <>
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block `}>
        <h3 className="text-1xl font-semibold mb-5">All Candidate </h3>

        <div className="mb-5">
          <Tabs aria-label="Performance Tabs" size="sm" selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
            <Tab key="all" title={<span className="text-xs">All</span>} />
            <Tab key="below-average" title={<span className="text-xs">Low</span>} />
            <Tab key="average" title="Avg" />
            <Tab key="good" title="Good" />
            <Tab key="excellent" title="Best" />
          </Tabs>

          <div className="flex items-center mt-5">
            <Input
              onChange={(e) => onSearchChange(e.target.value)}
              isClearable
              className="max-w-md"
              size="sm"
              placeholder="Search Result"
              value={filterValue}
              startContent={<FaSearch />}
              variant="bordered"
              onClear={() => {
                setFilterValue('');
                onSearchChange('');
              }}
            />

            <Button className="ml-3" isIconOnly variant="ghost" size="sm" isLoading={isLoading} onPress={fetchInterviewResult}>
              <FaSyncAlt />
            </Button>
          </div>
        </div>

        <ul className="divide-y">
          {items.map((data: any) => (
            <li onClick={() => handleViewDetails(data.id)} key={data.id} className={`flex items-center cursor-pointer justify-between pt-2 pb-2 transition-colors ${selectedId === data.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                <RatingBadges weight={data.overallWeight}>
                  <Avatar name={data.name} className="h-8 w-8" src={data.image} />
                </RatingBadges>

                <div>
                  <h3 className="font-medium text-sm pl-2 text-gray-800">{data.name}</h3>
                  <p className="text-xs text-gray-500 pl-2">{data.jobTitle}</p>
                </div>
              </div>

              <div className="ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
