'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const data = [
  {
    id: 'finances',
    label: 'FINANCES',
    title: "Optimize your company's finances",
    description: 'Reduce hiring costs and maximize ROI with AI-powered recruitment',
    comparison: {
      traditional: {
        title: 'Traditional Hiring',
        value: '$20',
        unit: 'per hire',
      },
      ai: {
        title: 'Evalsy AI',
        value: '$0.8',
        unit: 'per hire',
      },
      savings: '80% Cost Savings',
      tagline: 'Automate. Cut. Save.',
    },
  },
  {
    id: 'time',
    label: 'TIME',
    title: "Optimize your company's time",
    description: 'Accelerate your hiring process without sacrificing quality',
    comparison: {
      traditional: {
        title: 'Traditional Hiring',
        value: '42 days',
        unit: 'time-to-hire',
      },
      ai: {
        title: 'Evalsy AI',
        value: '10 days',
        unit: 'time-to-hire',
      },
      savings: '75% Faster Hiring',
      tagline: 'Streamline. Accelerate. Win.',
    },
  },
  {
    id: 'quality',
    label: 'QUALITY',
    title: "Optimize your company's talent quality",
    description: 'Find the perfect candidates with precision matching',
    comparison: {
      traditional: {
        title: 'Manual Screening',
        value: '65%',
        unit: 'match rate',
      },
      ai: {
        title: 'Evalsy AI',
        value: '99%',
        unit: 'match rate',
      },
      savings: '99% Match Accuracy',
      tagline: 'Analyze. Learn. Hire.',
    },
  },
  {
    id: 'efficiency',
    label: 'EFFICIENCY',
    title: "Optimize your company's efficiency",
    description: 'Process more candidates in less time with AI automation',
    comparison: {
      traditional: {
        title: 'Manual Process',
        value: '25',
        unit: 'candidates/day',
      },
      ai: {
        title: 'Evalsy AI',
        value: '100+',
        unit: 'candidates/day',
      },
      savings: '100 Candidates Sorted',
      tagline: 'Instant. Smart. Precise.',
    },
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(data[0].id);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate tabs every 5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const currentIndex = data.findIndex((item) => item.id === activeTab);
      const nextIndex = (currentIndex + 1) % data.length;
      setActiveTab(data[nextIndex].id);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab, isPaused]);

  const activeItem = data.find((item) => item.id === activeTab) || data[0];

  return (
    <main className="min-h-screen bg-[#121217] py-12 px-4 sm:px-6 lg:px-8 text-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          {/* Header Content - Now Full Width */}
          <div className="max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1.5 bg-[#1e1e24] rounded-full text-sm font-medium text-gray-300 mb-6">Our partners</div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Transform Your Hiring Process with <span className="text-blue-400">Evalsy AI</span>
            </h1>
            <p className="text-lg text-gray-400 mb-8">See how our AI-powered recruitment platform outperforms traditional hiring methods across key metrics</p>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2">
              {data.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsPaused(true);
                    // Resume auto-rotation after 10 seconds of inactivity
                    setTimeout(() => setIsPaused(false), 10000);
                  }}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 ${activeTab === item.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-900/30' : 'bg-[#1e1e24] text-gray-300 hover:bg-[#2a2a33]'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-[#1e1e24] rounded-2xl shadow-xl overflow-hidden" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-3">{activeItem.title}</h2>
            <p className="text-gray-400 mb-8 text-lg">{activeItem.description}</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional Method */}
              <div className="bg-[#16161c] rounded-xl p-6 relative">
                <div className="absolute top-0 right-0 bg-[#2a2a33] text-gray-300 px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">Traditional</div>
                <h3 className="text-xl font-semibold text-gray-300 mt-4">{activeItem.comparison.traditional.title}</h3>
                <div className="mt-6 mb-4">
                  <span className="text-4xl font-bold text-gray-200">{activeItem.comparison.traditional.value}</span>
                  <span className="text-gray-400 ml-2">{activeItem.comparison.traditional.unit}</span>
                </div>
                <div className="h-2 w-full bg-[#2a2a33] rounded-full"></div>
              </div>

              {/* Evalsy AI Method */}
              <div className="bg-[#16161c] rounded-xl p-6 relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">AI-Powered</div>
                <h3 className="text-xl font-semibold text-blue-400 mt-4">{activeItem.comparison.ai.title}</h3>
                <div className="mt-6 mb-4">
                  <span className="text-4xl font-bold text-blue-400">{activeItem.comparison.ai.value}</span>
                  <span className="text-blue-600 ml-2">{activeItem.comparison.ai.unit}</span>
                </div>
                <div className="h-2 w-full bg-[#2a2a33] rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Savings Highlight */}
            <div className="mt-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">{activeItem.comparison.savings}</h3>
                <p className="text-blue-100">{activeItem.comparison.tagline}</p>
              </div>
              <a href="#shedule-demo" className="mt-4 md:mt-0 bg-white text-blue-700 px-6 py-3 rounded-full font-medium flex items-center group transition-all hover:bg-gray-100">
                Request a Demo
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <div className="mt-10 flex justify-center">
          <div className="flex space-x-2">
            {data.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 10000);
                }}
                className={`w-3 h-3 rounded-full transition-all ${activeTab === item.id ? 'bg-blue-500 w-6' : 'bg-gray-700 hover:bg-gray-600'}`}
                aria-label={`View ${item.label} information`}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
