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
    <Card shadow="sm" className="p-4">
      <CardBody>
        <div className="divide-y divide-gray-200">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={async () => {
                if (!formReady || index === currentStep) return;
                const valid = await onStepChange(index);
                if (valid) onStepChange(index);
              }}
              className={`py-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-2 rounded ${currentStep === index ? 'bg-gray-100' : ''}`}
            >
              {step.icon}
              <div>
                <div className="text-base font-semibold">{step.title}</div>
                <div className="text-xs text-gray-600">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
