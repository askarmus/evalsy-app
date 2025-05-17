'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { FaRegEdit } from 'react-icons/fa';

interface Step {
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface StepperHeaderProps {
  isEditMode: boolean;
  currentStep: number;
  stepsData: Step[];
  completedSteps: number[];
  invalidSteps: number[];
}

export const StepperHeader: React.FC<StepperHeaderProps> = ({ isEditMode, currentStep, stepsData, completedSteps, invalidSteps }) => {
  return (
    <Card shadow="sm" className="p-2">
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <FaRegEdit className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{isEditMode ? 'Edit Interview' : 'Add Interview'}</h2>
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {stepsData.length}: {stepsData[currentStep].title}
              </p>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-1">
            {stepsData.map((_, idx) => (
              <div key={idx} className="flex items-center">
                {completedSteps.includes(idx) ? (
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : idx === currentStep ? (
                  <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                ) : invalidSteps.includes(idx) ? (
                  <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                )}

                {idx < stepsData.length - 1 && <div className={`w-3 h-0.5 ${completedSteps.includes(idx) ? 'bg-green-100' : invalidSteps.includes(idx) ? 'bg-red-200' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
