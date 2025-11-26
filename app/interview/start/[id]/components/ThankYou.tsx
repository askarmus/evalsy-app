'use client';
import React from 'react';
import { Card, CardBody } from '@heroui/react';
import PoweredBy from './PoweredBy';
import { Brain, CheckCircle, Sparkles } from 'lucide-react';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center   relative">
      <div className="w-full max-w-screen-md px-6 py-8">
        <Card className="p-8 bg-white dark:bg-gray-800 relative" shadow="none" radius="md">
          {/* Top-right and bottom-left icons */}

          <CardBody className="py-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-6">AI Interview Completed Successfully</h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">Thank you for taking the time to complete our AI-powered interview. Your responses have been recorded and our HR team will review them shortly.</p>
          </CardBody>
        </Card>

        <div className="mt-6">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
