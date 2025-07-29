'use client';
import React from 'react';
import { Card, CardBody } from '@heroui/react';

import PoweredBy from './PoweredBy';
import { Brain, CheckCircle, Sparkles } from 'lucide-react';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 bg-[url('/02.svg')] bg-cover bg-center">
      <div className="w-full max-w-screen-md mx-auto px-6 py-8">
        <Card className="p-8 bg-white dark:bg-gray-800" shadow="lg" radius="md">
          <Card className="py-4 text-center bg-white dark:bg-gray-800" shadow="none">
            <CardBody className="overflow-visible py-2">
              <div className="p-4   mx-auto">
                <div className="flex justify-center mb-6">
                  <div className={`rounded-full    "bg-green-100"}`}>
                    <CheckCircle className={`w-16 h-16  "text-green-600"}`} />
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <Sparkles className="w-full h-full text-purple-500" />
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
                  <Brain className="w-full h-full text-purple-500" />
                </div>
                <div className="p-6 text-center">
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-6">AI Interview Completed Successfully</h2>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed transition-all duration-700 delay-900 opacity-100 translate-y-0">Thank you for taking the time to complete our AI-powered interview. Your responses have been recorded and our HR team will review them shortly.</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Card>

        <PoweredBy />
      </div>
    </div>
  );
};

export default ThankYou;
