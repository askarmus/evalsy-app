"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

const comparisons = [
  {
    id: "finances",
    title1: "Traditional Method",
    title2: "AI-Powered Solution",
    value1: "$20",
    value2: "$0.8",
    unit: "per task",
    icons: 8,
  },
  {
    id: "productivity",
    title1: "Manual Process",
    title2: "AI Automation",
    value1: "8hrs",
    value2: "15min",
    unit: "per project",
    icons: 6,
  },
  {
    id: "quality",
    title1: "Human Only",
    title2: "Human + AI",
    value1: "76%",
    value2: "94%",
    unit: "accuracy",
    icons: 5,
  },
  {
    id: "experience",
    title1: "Traditional",
    title2: "AI Enhanced",
    value1: "3.2",
    value2: "4.8",
    unit: "satisfaction",
    icons: 7,
  },
];

export function ComparisonSection() {
  const [activeComparison, setActiveComparison] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveComparison((prev) => (prev + 1) % comparisons.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const comparison = comparisons[activeComparison];

  return (
    <div className='bg-[#1a2e0d] px-4 md:px-6 lg:px-8 pb-16'>
      <div className='container mx-auto'>
        <img alt='' loading='lazy' width={1558} height={946} decoding='async' data-nimg={1} className='absolute top-0 left-1/2 max-w-none -translate-y-1/4 translate-x-[-30%]' src='../../background-faqs.55d2e36a.jpg' style={{ color: "transparent" }} />

        <div className='grid md:grid-cols-2 gap-6'>
          <AnimatePresence mode='wait'>
            <motion.div key={`left-${comparison.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className='bg-[#2a3e1d] rounded-lg p-6 flex flex-col items-center'>
              <h3 className='text-white text-xl font-medium mb-6'>{comparison.title1}</h3>
              <div className='flex justify-center mb-4'>
                {Array.from({ length: comparison.icons }).map((_, i) => (
                  <div key={i} className='w-8 h-8 rounded-full bg-[#d4b675] flex items-center justify-center text-[#1a2e0d] mx-1'>
                    $
                  </div>
                ))}
              </div>
              <div className='text-[#d4b675] text-5xl font-bold mb-2'>{comparison.value1}</div>
              <div className='text-white'>{comparison.unit}</div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode='wait'>
            <motion.div key={`right-${comparison.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className='bg-[#2a3e1d] rounded-lg p-6 flex flex-col items-center'>
              <h3 className='text-white text-xl font-medium mb-6'>{comparison.title2}</h3>
              <div className='flex justify-center mb-4'>
                <div className='w-8 h-8 rounded-full bg-[#8ce563] flex items-center justify-center text-[#1a2e0d] mx-1'>$</div>
                {Array.from({ length: comparison.icons - 1 }).map((_, i) => (
                  <div key={i} className='w-8 h-8 rounded-full bg-[#3a4e2d] flex items-center justify-center text-gray-500 mx-1'>
                    $
                  </div>
                ))}
              </div>
              <div className='text-[#8ce563] text-5xl font-bold mb-2'>{comparison.value2}</div>
              <div className='text-white'>{comparison.unit}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className='mt-12 text-center'>
          <Button className='bg-[#8ce563] hover:bg-[#7ad152] text-[#1a2e0d] font-bold px-8 py-6 text-lg'>Get Started Free</Button>
        </div>
      </div>
    </div>
  );
}
