"use client";
import React from "react";
import { Button } from "@heroui/react";
import { FaBrain, FaPlusCircle } from "react-icons/fa";

interface QuestionHeaderActionsProps {
  questionCount: number;
  onGenerateAI: () => void;
  onAddManual: () => void;
}

export const QuestionHeaderActions = ({ questionCount, onGenerateAI, onAddManual }: QuestionHeaderActionsProps) => {
  return (
    <div className='flex justify-between flex-wrap gap-4 items-center'>
      <div className='flex items-center gap-3 flex-wrap md:flex-nowrap'>
        <h1 className='font-semibold'>
          {questionCount === 1 ? "Question" : "Questions"} ({questionCount})
        </h1>
      </div>
      <div className='flex flex-row gap-3.5 flex-wrap'>
        <Button onPress={onGenerateAI} className='text-white bg-purple-600 hover:bg-purple-700' size='md'>
          <FaBrain className='h-5 w-5' />
          Generate using AI
        </Button>

        <Button className='' size='md' color='default' onPress={onAddManual}>
          <FaPlusCircle className='h-5 w-5' />
          Add Manually
        </Button>
      </div>
    </div>
  );
};
