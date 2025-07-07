"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@heroui/react";

const tabs = [
  { id: "finances", label: "FINANCES", icon: "💰" },
  { id: "productivity", label: "PRODUCTIVITY", icon: "⏱️" },
  { id: "quality", label: "QUALITY", icon: "✅" },
  { id: "experience", label: "EXPERIENCE", icon: "🌟" },
];

export function Tabs() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='bg-[#1a2e0d] py-16 px-4 md:px-6 lg:px-8 text-center'>
      <div className='container mx-auto'>
        <h2 className='text-4xl md:text-5xl font-bold text-white mb-12'>Optimize your company&apos;s...</h2>

        <div className='relative flex justify-center mb-8'>
          <div className='flex space-x-2 bg-[#2a3e1d] rounded-full p-1'>
            {tabs.map((tab, index) => (
              <button key={tab.id} onClick={() => setActiveTab(index)} className={cn("relative px-4 py-2 rounded-full transition-colors duration-200 font-medium", activeTab === index ? "text-[#1a2e0d]" : "text-white")}>
                {activeTab === index && <motion.div layoutId='activeTab' className='absolute inset-0 bg-[#8ce563] rounded-full' transition={{ type: "spring", duration: 0.6 }} />}
                <span className='relative flex items-center'>
                  <span className='mr-2'>{tab.icon}</span>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className='h-1 w-full max-w-3xl mx-auto bg-[#2a3e1d] rounded-full overflow-hidden'>
          <motion.div className='h-full bg-[#8ce563]' initial={{ width: "0%" }} animate={{ width: `${((activeTab + 1) / tabs.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>
    </div>
  );
}
