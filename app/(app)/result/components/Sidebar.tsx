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
      <div className="md:hidden sticky top-16 z-10 border-b p-2">
        <button className="inline-flex items-center justify-between w-full rounded-md text-sm font-medium h-10 px-4 py-2 border hover:bg-accent hover:text-accent-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <div className="flex items-center gap-2">
            <span>All Candidates</span>
          </div>
        </button>
      </div>

      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-80 border-r overflow-y-auto`}>
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold mb-4">All Candidates</h2>
          <Tabs aria-label="Performance Tabs" size="sm" selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as string)}>
            <Tab key="all" title="All" />
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

        <div className="overflow-auto h-[700px]">
          <ul className="divide-y">
            {items.map((data: any) => (
              <li onClick={() => handleViewDetails(data.id)} key={data.id} className={`flex items-center cursor-pointer justify-between p-4 transition-colors ${selectedId === data.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <RatingBadges weight={data.overallWeight}>
                    <Avatar name={data.name} className="h-10 w-10" src={data.image} />
                  </RatingBadges>

                  <div>
                    <h3 className="font-medium text-sm pl-2">{data.name}</h3>
                    <p className="text-xs text-gray-500">{data.jobTitle}</p>
                    <p className="text-xs text-gray-500">{formatRelativeDate(data.statusUpdateAt)}</p>
                  </div>
                </div>

                {/* Right Arrow Icon */}
                <div className="ml-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
