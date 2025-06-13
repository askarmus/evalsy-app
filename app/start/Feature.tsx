'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaPlus, FaUsers, FaPaperPlane, FaVideo, FaChartBar } from 'react-icons/fa';
import { Chip } from '@heroui/react';

const steps = [
  {
    icon: FaPlus,
    title: 'Create Interview',
    description: 'Easily design and configure interview questions tailored to your job role. Choose from templates or build your own custom flow.',
    image: '/feature-screen/create-interview.png',
  },
  {
    icon: FaUsers,
    title: 'Shortlist',
    description: 'Efficiently review and filter applicants to identify the most qualified candidates based on resumes and initial screening.',
    image: '/feature-screen/shortlist.png',
  },
  {
    icon: FaPaperPlane,
    title: 'Send Invitations',
    description: 'Quickly send personalized interview invitations to shortlisted candidates with automated scheduling and reminders.',
    image: '/feature-screen/invitation.png',
  },
  {
    icon: FaVideo,
    title: 'Interviewing',
    description: 'Conduct asynchronous or live AI-powered interview sessions to assess candidate responses with speed and consistency.',
    image: '/feature-screen/online-interview.png',
  },
  {
    icon: FaChartBar,
    title: 'View Results',
    description: 'Gain insights through detailed analytics, score breakdowns, and performance summaries to make data-driven hiring decisions.',
    image: '/feature-screen/interview-result.png',
  },
];

export default function Feature() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number[]>(new Array(steps.length).fill(0));

  const INTERVAL_DURATION = 8000;

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % steps.length);
    }, INTERVAL_DURATION);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) =>
        prev.map((val, i) => {
          if (i === selectedIndex) return val >= 100 ? 100 : val + 5;
          return 0;
        })
      );
    }, INTERVAL_DURATION / 20);

    return () => clearInterval(progressInterval);
  }, [selectedIndex]);

  const selectedStep = steps[selectedIndex];

  return (
    <section id="features" className="bg-darkbase py-8  ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold  tracking-tight text-white sm:text-4xl mt-4">How AI Interviewer Works</h2>
        </div>

        <div className="text-center mt-5">
          <p className="mt-4 text-lg text-white">{selectedStep.description}</p>
        </div>

        <div className="mt-8">
          <div className="flex justify-between gap-2 flex-wrap">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex-1 min-w-[40px]">
                  <button
                    onClick={() => {
                      setSelectedIndex(index);
                      setProgress((prev) => prev.map((_, i) => (i === index ? 0 : 0)));
                    }}
                    className={`w-full rounded-full px-4 py-2 flex items-center justify-center gap-3   text-white transition duration-300
    ${selectedIndex === index ? 'bg-darkbase border-1 border-white shadow-md' : 'bg-darkbase-sec border border-transparent hover:border-white opacity-80 hover:opacity-100'}`}
                  >
                    {/* Icon circle */}
                    <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      <Icon className="text-white text-sm" />
                    </div>

                    {/* Text and progress bar – hidden on small devices */}
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="truncate text-xs">{step.title}</span>
                      <div className="w-full h-1 bg-white bg-opacity-20 rounded overflow-hidden mt-1">
                        <motion.div className="h-full bg-white" style={{ width: `${progress[index]}%` }} transition={{ duration: 0.25 }} />
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
          <div className=" overflow-hidden p-4 mt-6 flex items-center justify-center">
            <motion.div key={selectedStep.title} initial={{ opacity: 0, x: 100, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -100, scale: 0.95 }} transition={{ duration: 0.6, ease: 'easeInOut' }} className="text-center w-full">
              <div className="w-full flex justify-center mb-4">
                <motion.img src={selectedStep.image} alt={selectedStep.title} className="w-full max-w-[900px] h-auto object-contain rounded-xl shadow-md" initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
