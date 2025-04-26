"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@heroui/react";

const tabs = [
  {
    id: "finances",
    label: "FINANCES",
    title: "Optimize your company's finances",
    description: "Reduce hiring costs and maximize ROI with AI-powered recruitment",
    comparison: {
      traditional: {
        title: "Traditional Hiring",
        value: "$20",
        unit: "per hire",
      },
      ai: {
        title: "Evalsy AI",
        value: "$0.8",
        unit: "per hire",
      },
      savings: "80% Cost Savings",
      tagline: "Automate. Cut. Save.",
    },
  },
  {
    id: "time",
    label: "TIME",
    title: "Optimize your company's time",
    description: "Accelerate your hiring process without sacrificing quality",
    comparison: {
      traditional: {
        title: "Traditional Hiring",
        value: "42 days",
        unit: "time-to-hire",
      },
      ai: {
        title: "Evalsy AI",
        value: "10 days",
        unit: "time-to-hire",
      },
      savings: "75% Faster Hiring",
      tagline: "Streamline. Accelerate. Win.",
    },
  },
  {
    id: "quality",
    label: "QUALITY",
    title: "Optimize your company's talent quality",
    description: "Find the perfect candidates with precision matching",
    comparison: {
      traditional: {
        title: "Manual Screening",
        value: "65%",
        unit: "match rate",
      },
      ai: {
        title: "Evalsy AI",
        value: "99%",
        unit: "match rate",
      },
      savings: "99% Match Accuracy",
      tagline: "Analyze. Learn. Hire.",
    },
  },
  {
    id: "efficiency",
    label: "EFFICIENCY",
    title: "Optimize your company's efficiency",
    description: "Process more candidates in less time with AI automation",
    comparison: {
      traditional: {
        title: "Manual Process",
        value: "25",
        unit: "candidates/day",
      },
      ai: {
        title: "Evalsy AI",
        value: "100+",
        unit: "candidates/day",
      },
      savings: "100 Candidates Sorted",
      tagline: "Instant. Smart. Precise.",
    },
  },
];

export function OptimizeSection() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTab = tabs[activeTab];

  return (
    <>
      <section id='testimonials' aria-labelledby='faq-title' className='relative overflow-hidden bg-slate-50 py-20 sm:py-32'>
        <img alt='' loading='lazy' width={1558} height={946} decoding='async' data-nimg={1} className='absolute top-0 left-1/2 max-w-none -translate-y-1/4 translate-x-[-30%]' src='/background-faqs.55d2e36a.jpg' style={{ color: "transparent" }} />
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
          <div className=''>
            <div className='flex justify-center mb-8'>
              <div className='inline-flex bg-gray-100 rounded-full p-1.5'>
                {tabs.map((tab, index) => (
                  <button key={tab.id} onClick={() => setActiveTab(index)} className={cn("relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200", activeTab === index ? "text-white" : "text-gray-600 hover:text-gray-800")}>
                    {activeTab === index && <motion.div layoutId='activeTabBg' className='absolute inset-0 bg-[#2563eb] rounded-full' transition={{ type: "spring", duration: 0.6 }} />}
                    <span className='relative z-10'>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className=' '>
              <div className='relative h-1 w-full max-w-md mx-auto bg-gray-200 rounded-full overflow-hidden mb-12'>
                <motion.div className='h-full bg-[#2563eb]' initial={{ width: "0%" }} animate={{ width: `${((activeTab + 1) / tabs.length) * 100}%` }} transition={{ duration: 0.3 }} />
              </div>

              <AnimatePresence mode='wait'>
                <motion.div key={currentTab.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className='text-center mb-12'>
                  <h2 className='font-display text-3xl tracking-tight  mb-4 sm:text-4xl md:text-5xl'>{currentTab.title}</h2>
                  <p className='text-gray-600 max-w-2xl mx-auto'>{currentTab.description}</p>
                </motion.div>
              </AnimatePresence>

              <div className='grid md:grid-cols-2 gap-20'>
                <AnimatePresence mode='wait'>
                  <motion.div key={`left-${currentTab.id}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5 }} className=' p-8 flex flex-col items-center   border shadow-xl rounded-3xl'>
                    <h3 className='text-gray-800 text-xl font-medium mb-8'>{currentTab.comparison.traditional.title}</h3>
                    <div className='text-gray-900 text-4xl font-bold mb-2 text-1xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400'>{currentTab.comparison.traditional.value}</div>
                    <div className='text-gray-500'>{currentTab.comparison.traditional.unit}</div>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode='wait'>
                  <motion.div key={`right-${currentTab.id}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} className=' p-8 flex flex-col items-center relative overflow-hidden p-6  border shadow-xl rounded-3xl'>
                    <div className='absolute top-0 right-0 bg-[#2563eb] text-white text-xs font-bold px-3 py-1 rounded-bl-lg'>AI-POWERED</div>
                    <h3 className='text-gray-800 text-xl font-medium mb-8'>{currentTab.comparison.ai.title}</h3>
                    <div className='text-[#2563eb] text-4xl font-bold mb-2 text-1xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400'>{currentTab.comparison.ai.value}</div>
                    <div className='text-gray-500'>{currentTab.comparison.ai.unit}</div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className='mt-8 text-center'>
                <div className=' px-6 py-3'>
                  <span className='text-gray-600'>{currentTab.comparison.savings}</span>, <span className='text-gray-600'>{currentTab.comparison.tagline}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className=' '></section>
    </>
  );
}
