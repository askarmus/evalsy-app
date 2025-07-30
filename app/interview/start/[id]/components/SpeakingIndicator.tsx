'use client';

import { motion } from 'framer-motion';

interface SpeakingIndicatorProps {
  isSpeaking: boolean;
  volume: number;
}

export default function SpeakingIndicatorSoft({ isSpeaking, volume }: SpeakingIndicatorProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 border-purple-200">
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full bg-purple-500 opacity-40 blur-lg z-0 
  ${isSpeaking ? 'animate-pulse-glow' : ''}`}
          />{' '}
          <div className="relative w-28 h-28 rounded-full  shadow-xl flex items-center justify-center z-10 overflow-hidden">
            <img src="/favicon-large.png" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-3">
          <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" animate={{ width: `${volume}%` }} transition={{ duration: 0.1 }} />
        </div>
        <p className="mt-5 text-center text-lg text-gray-300 font-bold">AI Interviewer</p>
      </div>
    </div>
  );
}
