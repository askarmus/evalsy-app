'use client';

import { Card, CardBody } from '@heroui/react';
import { FaDesktop, FaExchangeAlt, FaExclamation } from 'react-icons/fa';
import PoweredBy from './PoweredBy';

const MobileWarning = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-900 bg-gray-100 px-4">
      <Card className="max-w-md w-full p-6 space-y-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
        <CardBody>
          <div className="flex justify-center mb-4 text-red-500 text-5xl">
            <FaExclamation />
          </div>

          <h2 className="text-xl font-semibold text-center mb-2">Please switch to a larger screen</h2>

          <p className="text-center text-gray-600 dark:text-gray-300">
            This interview is best experienced on a <strong>desktop</strong>,<strong> laptop</strong>, or <strong>tablet</strong>.
            <br />
            Some features may not work properly on mobile devices.
          </p>
        </CardBody>
      </Card>

      <div className="mt-6">
        <PoweredBy />
      </div>
    </div>
  );
};

export default MobileWarning;
