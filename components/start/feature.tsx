'use client';

import { Card, CardBody } from '@heroui/react';
import { FaArrowRight, FaUsers, FaPaperPlane, FaVideo, FaChartBar, FaPlus } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Component() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

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
      image: '/feature-screen/post.png',
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
      image: '/feature-screen/post.png',
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [steps.length, isPlaying]);

  return (
    <div className="min-h-screen p-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 overflow-x-hidden">
      <div className="container mx-auto px-4 py-8">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mx-auto max-w-2xl text-center flex flex-col items-center justify-center">
            <h2 id="faq-title" className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              How AI Interviewer Works
            </h2>
            <p className="mt-4 text-lg tracking-tight text-white">If you can’t find what you’re looking for, email our support team and if you’re lucky someone will get back to you.</p>
          </div>
        </motion.div>

        <div className="mb-2">
          <div className="relative">
            <div className="flex justify-center flex-wrap gap-4">
              {steps.map((step, index) => (
                <motion.div key={index} className="w-64" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} onClick={() => setActiveStep(index)}>
                  <Card shadow="none" className={`transition-all duration-500 transform cursor-pointer p-4 h-full text-center ${activeStep === index ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20'}`}>
                    <CardBody className="p-0">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full transition-all duration-300 ${activeStep === index ? 'bg-white/30' : 'bg-white/20'}`}>
                          <step.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm mb-1">{step.title}</h3>
                          {activeStep === index && (
                            <motion.div className="w-full bg-white/30 rounded-full h-1 mt-2" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.5 }}>
                              <motion.div className="bg-white h-1 rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 8, ease: 'linear' }} key={activeStep} />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <div className="text-center mb-5">{steps[activeStep].description}</div>
            <AnimatePresence mode="wait">
              <motion.div key={activeStep} initial={{ opacity: 0, x: 100, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -100, scale: 0.95 }} transition={{ duration: 0.8, ease: 'easeInOut' }}>
                <div className="relative overflow-hidden rounded-xl ">
                  <motion.img src={steps[activeStep].image} alt={steps[activeStep].title} className="w-full rounded-xl   object-cover " initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
