'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import { Calendar, Card, CardBody, CardHeader } from '@heroui/react';
import CandidateInfo from './CandidateInfo';
import { motion } from 'framer-motion';
import { FaCalendar, FaCheckCircle } from 'react-icons/fa';
import PoweredBy from './PoweredBy';
import { Mail } from 'lucide-react';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-full max-w-screen-lg mx-auto px-6 py-8">
        <Card className="p-8 bg-white dark:bg-gray-800" shadow="sm" radius="md">
          <Card className="py-4 text-center bg-white dark:bg-gray-800" shadow="none">
            <CardBody className="overflow-visible py-2">
              <div className="p-4 rounded-lg max-w-3xl mx-auto">
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
