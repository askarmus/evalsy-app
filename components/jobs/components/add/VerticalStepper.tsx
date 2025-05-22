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
    <Card shadow="sm" className="p-4  ">
      <CardBody>
        <div className=" ">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={async () => {
                if (!formReady || index === currentStep) return;
                const valid = await onStepChange(index);
                if (valid) onStepChange(index);
              }}
              className={`py-2 px-4 flex items-center gap-3 cursor-pointer px-1 m-1 rounded-xl 
            ${currentStep === index ? 'bg-gray-100 dark:bg-gray-800 rounded-xl' : 'hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl'}`}
            >
              {step.icon}
              <div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">{step.title}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
