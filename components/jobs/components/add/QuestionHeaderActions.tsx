'use client';
import React from 'react';
import { Button } from '@heroui/react';
import { PlusCircle, Sparkle } from 'lucide-react';

interface QuestionHeaderActionsProps {
  questionCount: number;
  onGenerateAI: () => void;
  onAddManual: () => void;
}

export const QuestionHeaderActions = ({ questionCount, onGenerateAI, onAddManual }: QuestionHeaderActionsProps) => {
  return (
    <div className="flex justify-between flex-wrap gap-4 items-center">
      <div className="flex flex-row gap-3.5 flex-wrap">
        <Button color="secondary" radius="full" onPress={onGenerateAI} size="sm">
          <Sparkle className="h-5 w-5" />
          AI Generate
        </Button>

        <Button color="secondary" variant="flat" radius="full" size="sm" onPress={onAddManual}>
          <PlusCircle className="h-5 w-5" />
          Add Manually
        </Button>
      </div>
    </div>
  );
};
