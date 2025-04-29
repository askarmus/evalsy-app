"use client";
import { Input, Tabs, Tab, Chip } from "@heroui/react";
import { FaSearch } from "react-icons/fa";
import React from "react";

export type QuestionType = "all" | "verbal" | "coding";

interface QuestionSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTab: QuestionType;
  setSelectedTab: (value: QuestionType) => void;
  questionsCount: {
    all: number;
    verbal: number;
    coding: number;
  };
}

export const QuestionSearchAndFilter = ({ searchTerm, setSearchTerm, selectedTab, setSelectedTab, questionsCount }: QuestionSearchAndFilterProps) => {
  return (
    <div className='flex justify-between flex-wrap gap-4 items-center'>
      <div className='flex items-center gap-3 flex-wrap md:flex-nowrap'>
        <Input
          size='md'
          isClearable
          className='max-w-md'
          placeholder='Search questions'
          onClear={() => {
            setSearchTerm("");
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<FaSearch />}
          variant='bordered'
        />
      </div>
      <div className='flex flex-row gap-3.5 flex-wrap'>
        <Tabs key='tabs' aria-label='Tabs sizes' size='sm' selectedKey={selectedTab} onSelectionChange={(key) => setSelectedTab(key as QuestionType)}>
          <Tab
            key='all'
            title={
              <>
                <span>All </span>
                <Chip size='sm' variant='faded'>
                  {questionsCount.all}
                </Chip>
              </>
            }
          />
          <Tab
            key='verbal'
            title={
              <>
                <span>Verbal </span>
                <Chip size='sm' variant='faded'>
                  {questionsCount.verbal}
                </Chip>
              </>
            }
          />
          <Tab
            key='coding'
            title={
              <>
                <span>Code </span>
                <Chip size='sm' variant='faded'>
                  {questionsCount.coding}
                </Chip>
              </>
            }
          />
        </Tabs>
      </div>
    </div>
  );
};
