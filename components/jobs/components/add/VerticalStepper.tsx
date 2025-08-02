'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';

interface Step {
  icon: React.ReactElement; // ReactElement so we can clone it
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
    <Card shadow="sm" radius="md">
      <CardBody className="p-4">
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
                  py-2 mb-4 px-4 flex items-center gap-2 cursor-pointer m-1 rounded-lg transition-colors
                  ${isActive ? 'bg-secondary-400 text-white' : 'bg-secondary-100 hover:bg-secondary-200'}
                `}
              >
                <div className="w-5 h-5">
                  {React.cloneElement(step.icon, {
                    className: `w-5 h-5 ${isActive ? 'text-white' : 'text-gray-900'}`,
                  })}
                </div>
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
