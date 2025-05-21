'use client';
import React, { useState } from 'react';
const featureList = [
  {
    title: 'AI-Powered Interview Experience',
    description: 'AI interview platform with video response, live questions, reviewer insights, and seamless, modern UI for evaluations.',
    image: '/feature-screen/post.png',
  },
  {
    title: 'Instant Interview Invite',
    description: 'Quickly send interview invites with name, email, duration, expiry, and interviewer—simple, fast, and efficient.',
    image: '/feature-screen/invitation.png',
  },
  {
    title: 'AI Resume Screening',
    description: 'Effortlessly screen resumes using AI—auto-score candidates, filter by experience, and manage invitations in one place.',
    image: '/feature-screen/resume-screening.png',
  },
  {
    title: 'AI Resume Screening',
    description: 'Effortlessly screen resumes using AI—auto-score candidates, filter by experience, and manage invitations in one place.',
    image: '/feature-screen/resume-screening.png',
  },
];

export const Features = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="features" aria-label="Features for running your books" className="relative overflow-hidden bg-blue-600 pt-20 pb-28 sm:py-32">
      <img alt="" loading="lazy" width={2245} height={1636} decoding="async" className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]" src="/background-features.5f7a9ac9.jpg" style={{ color: 'transparent' }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">How Evalsy AI Interviewer Works</h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">Manage hiring with ease—automated interviews, quick invites, and AI screening to skip repetitive tasks.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
          {/* Tabs - Scrollable on Mobile */}
          <div className="-mx-4 flex  pb-4  sm:pb-0 lg:col-span-5" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}>
            <div className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal" role="tablist" aria-orientation="vertical">
              {featureList.map((feature, index) => (
                <div key={index} className={`group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 ${activeTab === index ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset' : 'hover:bg-white/10 lg:hover:bg-white/5'}`} onClick={() => setActiveTab(index)} role="tab" aria-selected={activeTab === index} tabIndex={0}>
                  <h3>
                    <button className={`font-display text-lg ${activeTab === index ? 'text-blue-600 lg:text-white' : 'text-blue-100 hover:text-white'}`}>
                      <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                      {feature.title}
                    </button>
                  </h3>
                  <p className={`mt-2 hidden text-sm lg:block ${activeTab === index ? 'text-white' : 'text-blue-100 group-hover:text-white'}`}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content - Image and Description */}
          <div className="lg:col-span-7">
            <div role="tabpanel" tabIndex={0} aria-labelledby={`tab-${activeTab}`}>
              <div className="relative sm:px-6 lg:hidden">
                <div className="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl" />
                <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">{featureList[activeTab].description}</p>
              </div>

              <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                <img alt={featureList[activeTab].title} width={2174} height={1464} className="w-full" sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem" src={featureList[activeTab].image} style={{ color: 'transparent' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
