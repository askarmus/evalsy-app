'use client';
import React from 'react';
import { Input, Button, Avatar, DropdownTrigger, Dropdown, DropdownItem, DropdownMenu, Listbox, ListboxItem, CardBody, Card, CardHeader, Badge, Chip } from '@heroui/react';
import { HiringGradeUtil } from '@/app/utils/hiring-grade.util';
import { ChevronRightIcon, Filter, Search } from 'lucide-react';
import { formatRelativeDate } from '@/app/utils/formatRelativeDate';

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

export const ListboxWrapper = ({ children }) => <div className="w-full max-w-[360px] max-h-[700px] overflow-y-auto">{children}</div>;

export default function Sidebar({ selectedTab, setSelectedTab, filterValue, setFilterValue, onSearchChange, items, selectedId, handleViewDetails }: SidebarProps) {
  // Fix filter logic (previously always true)
  const filteredItems = items.filter((item) => selectedTab === 'all' || HiringGradeUtil.getHiringRecommendation(item.totalScore).recommendation === selectedTab);

  // Track selected keys and sync with parent selectedId
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(selectedId ? new Set([selectedId]) : new Set());

  React.useEffect(() => {
    if (selectedId) {
      setSelectedKeys(new Set([selectedId]));
    }
  }, [selectedId]);

  return (
    <Card className="m-4 mt-1">
      <CardHeader>
        <div className="flex flex-col gap-3">
          {/* Title */}

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input
              onChange={(e) => onSearchChange(e.target.value)}
              isClearable
              className="sm:max-w-md w-full"
              size="sm"
              placeholder="Search Result"
              value={filterValue}
              startContent={<Search className="text-secondary" />}
              variant="bordered"
              onClear={() => {
                setFilterValue('');
                onSearchChange('');
              }}
            />

            <Dropdown aria-label="Candidate Score Filter">
              <DropdownTrigger>
                <Button size="sm" variant="bordered" startContent={<Filter className="text-secondary" />} className="capitalize w-full sm:w-auto">
                  {selectedTab === 'all' ? 'All' : selectedTab}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Candidate Score Filter" onAction={(key) => setSelectedTab(key as string)} selectedKeys={[selectedTab]} selectionMode="single">
                <DropdownItem key="all">All</DropdownItem>
                <DropdownItem key="Reject">Reject</DropdownItem>
                <DropdownItem key="Borderline">Borderline</DropdownItem>
                <DropdownItem key="Hire">Hire</DropdownItem>
                <DropdownItem key="Strong Hire">Strong Hire</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <ListboxWrapper>
          <Listbox
            aria-label="Actions"
            selectedKeys={selectedKeys}
            selectionMode="single"
            disallowEmptySelection
            onSelectionChange={(keys) => {
              if (keys !== 'all') {
                const keySet = keys as Set<string>;
                const selected = Array.from(keySet)[0];
                if (selected) {
                  setSelectedKeys(new Set([selected]));
                  handleViewDetails(selected);
                }
              }
            }}
            className="border-0"
          >
            {filteredItems.map((data: any) => {
              const isSelected = selectedKeys.has(data.id); // check if this item is selected
              return (
                <ListboxItem
                  key={data.id}
                  textValue={data.name}
                  className={`rounded-md transition-colors ${isSelected ? 'bg-secondary-100 dark:bg-secondary-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  endContent={
                    <div className="flex items-center gap-1 text-default-400">
                      <Chip size="sm" variant="faded" color={HiringGradeUtil.getTechnicalHiringGrade(data.totalScore).color} className="text-[10px]">
                        {data.totalScore}
                      </Chip>
                      <ChevronRightIcon className="text-sm text-secondary-200" />
                    </div>
                  }
                  startContent={
                    <div className="flex items-center gap-2">
                      <div>
                        {!data?.isRead ? (
                          <Badge size="sm" color="secondary" content="New">
                            <Avatar name={data.name} className="h-8 w-8" src={data.image} />
                          </Badge>
                        ) : (
                          <Avatar name={data.name} className="h-8 w-8" src={data.image} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm pl-2 text-gray-900 dark:text-gray-100">{data.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 pl-2">{data.jobTitle}</p>
                        <p className="text-[10px] text-secondary-500 pl-2">{formatRelativeDate(data.statusUpdateAt)}</p>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </Listbox>
        </ListboxWrapper>
      </CardBody>
    </Card>
  );
}
