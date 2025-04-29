"use client";
import React from "react";
import { Chip, Tooltip } from "@heroui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { Question } from "../../types";

interface QuestionAccordionTitleProps {
  index: number;
  startIndex: number;
  question: Question;
  onDelete: (id: string) => void;
}

export const QuestionAccordionTitle = ({ index, startIndex, question, onDelete }: QuestionAccordionTitleProps) => {
  return (
    <div className='flex w-full items-center justify-between'>
      {/* Left Side */}
      <div className='flex items-center text-base'>
        <span className='flex items-center justify-center bg-gray-900 text-primary-foreground rounded-full w-7 h-7 mr-3 text-sm font-medium'>{startIndex + index + 1}</span>
        <span className='truncate font-semibold max-w-[200px] md:max-w-[400px]'>{question.text.length > 80 ? `${question.text.substring(0, 80)}...` : question.text || "New Question"}</span>
      </div>

      {/* Right Side */}
      <div className='flex items-center gap-2'>
        <Chip color='warning' variant='flat' size='sm'>
          {question.type}
        </Chip>
        <Tooltip content='Remove question'>
          <a aria-label='Delete' className='p-1 text-gray-600 hover:text-black rounded-full dark:text-gray-300 dark:hover:text-white' onClick={() => onDelete(question.id)}>
            <AiOutlineDelete className='h-5 w-5' />
          </a>
        </Tooltip>
      </div>
    </div>
  );
};
