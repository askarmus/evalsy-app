'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface VerticalStepperProps {
  steps: Step[];
  currentStep: number;
  formReady: boolean;
  onStepChange: (index: number) => Promise<boolean>;
}

export const VerticalStepper: React.FC<VerticalStepperProps> = ({ steps, currentStep, formReady, onStepChange }) => {
  return (
    <Card shadow="sm" radius="md" className="p-4">
      <CardBody>
        <div>
          {steps.map((step, index) => {
            const isActive = index === currentStep;

            return (
              <div
                key={index}
                onClick={async () => {
                  if (!formReady || isActive) return;
                  const valid = await onStepChange(index);
                  if (valid) onStepChange(index);
                }}
                className={`
              py-2 mb-4 px-4 flex items-center gap-2 cursor-pointer m-1 rounded-xl transition-colors
              ${isActive ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}
            `}
              >
                <div className={`w-5 h-5 text-xl ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-200'}`}>{step.icon}</div>
                <div>
                  <div className="text-base font-semibold">{step.title}</div>
                  <div className="text-xs">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
