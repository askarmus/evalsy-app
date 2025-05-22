'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type FeatureItem = {
  title: string;
  description: string;
  image: string;
  progressTime: number;
};

export const Features = () => {
  const features: FeatureItem[] = [
    {
      title: 'Create Interview',
      image: '/feature-screen/create-interview.png',
      progressTime: 3000,
      description: 'Design interview flow',
    },
    {
      title: 'Shortlist Candidates',
      image: '/feature-screen/post.png',
      progressTime: 4000,
      description: 'AI resume screening',
    },
    {
      title: 'Send Invitations',
      image: '/feature-screen/invitation.png',
      progressTime: 4000,
      description: 'Invite shortlisted candidates',
    },
    {
      title: 'Conduct Interviews',
      image: '/feature-screen/post.png',
      progressTime: 5000,
      description: 'AI-led video interviews',
    },
    {
      title: 'View Results',
      image: '/feature-screen/post.png',
      progressTime: 4000,
      description: 'Analyze interview scores',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress(100);
    const progressTime = features[currentIndex]?.progressTime ?? 4000;
    const step = 100 / (progressTime / 50);
    let localProgress = 100;

    const interval = setInterval(() => {
      localProgress -= step;

      if (localProgress <= 0) {
        clearInterval(interval);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
      } else {
        setProgress(localProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section id="testimonials" aria-labelledby="faq-title" className="relative overflow-hidden bg-slate-50 py-20 sm:py-32">
      <img alt="" loading="lazy" width={2245} height={1636} decoding="async" className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]" src="/background-features.5f7a9ac9.jpg" style={{ color: 'transparent' }} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center justify-center">
          <h2 id="faq-title" className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            How AI Interviewer Works
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">If you can’t find what you’re looking for, email our support team and if you’re lucky someone will get back to you.</p>
        </div>

        <div className="flex flex-wrap mt-12">
          <div className="flex w-full flex-col lg:flex-row items-center justify-center">
            {/* Sidebar Menu */}
            <div className="w-full lg:w-1/3 flex lg:justify-end justify-center">
              <div className="flex flex-row lg:flex-col items-center justify-center space-x-4 lg:space-x-0 lg:space-y-4">
                {features.map((feature, index) => (
                  <motion.div key={feature.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className=" min-w-[300px] text-white group relative rounded-full px-4 py-4 lg:rounded-l-xl lg:rounded-r-none lg:p-4 bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset">
                    {feature.title}
                    <p className="mt-0 hidden text-xs lg:block text-gray-300">{feature.description}</p>
                    {index === currentIndex && (
                      <div className="w-full h-1 bg-indigo-300 rounded overflow-hidden mt-1">
                        <motion.div className="h-full bg-white" initial={{ width: '100%' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.05, ease: 'linear' }} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Feature Image */}
            <div className="w-full mt-8 lg:mt-0 flex items-center justify-center overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.img key={features[currentIndex].image} src={features[currentIndex].image} alt={features[currentIndex].title} className="max-w-full max-h-[70vh] rounded-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
