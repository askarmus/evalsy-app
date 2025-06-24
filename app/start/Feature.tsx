'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaPlus, FaUsers, FaPaperPlane, FaVideo, FaChartBar, FaPlay } from 'react-icons/fa';
import { Badge, Button, Card, CardBody, Chip, CircularProgress } from '@heroui/react';
import { CircularProgress1 } from './CircularProgress';

const statistics = [
  {
    percentage: '46%',
    description: 'Companies using AI in their hiring process achieve more successful hires.',
    source: 'Harvard Business Review',
    logo: 'HBR',
  },
  {
    percentage: '20%',
    description: 'More efficient hiring with AI-powered tools, helping businesses scale faster and smarter.',
    source: 'McKinsey & Company',
    logo: 'M&C',
  },
  {
    percentage: '81%',
    description: 'of companies are now allocating more resources toward automated recruiting tools to stay competitive.',
    source: 'USC',
    logo: 'USC',
  },
];

const steps = [
  {
    icon: FaPlus,
    title: 'Create',
    description: 'Easily design and configure interview questions tailored to your job role. Choose from templates or build your own custom flow.',
    image: '/feature-screen/create-interview.png',
    active: true,
  },
  {
    icon: FaUsers,
    title: 'Shortlist',
    description: 'Efficiently review and filter applicants to identify the most qualified candidates based on resumes and initial screening.',
    image: '/feature-screen/shortlist.png',
    active: false,
  },
  {
    icon: FaPaperPlane,
    title: 'Send Invitations',
    description: 'Quickly send personalized interview invitations to shortlisted candidates with automated scheduling and reminders.',
    image: '/feature-screen/invitation.png',
    active: false,
  },
  {
    icon: FaVideo,
    title: 'Interviewing',
    description: 'Conduct asynchronous or live AI-powered interview sessions to assess candidate responses with speed and consistency.',
    image: '/feature-screen/online-interview.png',
    active: false,
  },
  {
    icon: FaChartBar,
    title: 'View Results',
    description: 'Gain insights through detailed analytics, score breakdowns, and performance summaries to make data-driven hiring decisions.',
    image: '/feature-screen/interview-result.png',
    active: false,
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
    <section id="how-it-work" className="w-full py-12 md:py-24 lg:py-32 bg-darkbase">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - How AI Interviewer Works */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-black bg-white rounded-lg overflow-hidden">
              <CardBody className="p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black" style={{ fontFamily: 'Courier, monospace' }}>
                  How AI Interviewer Works
                </h2>
                <p className="mb-4 text-sm"> {steps[selectedIndex].description}</p>

                {/* Video Player Area */}
                <div className="bg-gray-100 rounded-lg mb-8 aspect-video flex items-center justify-center border-2 border-gray-200">
                  <div className="w-full flex justify-center mb-4 p-1">
                    <img src={selectedStep.image} alt={selectedStep.title} className="w-full max-w-[900px] h-auto object-contain  " />
                  </div>
                </div>

                {/* Process Steps */}
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CircularProgress1 lable={(index + 1).toString()} size={33} progress={progress[index]} />
                      <span className={`text-sm font-medium ${step.active ? 'text-black' : 'text-gray-600'}`}>{step.title}</span>
                      {index < steps.length - 1 && <div className="hidden md:block w-4 h-px bg-gray-300 mx-2" />}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Section - Statistics */}
          <div className="space-y-6">
            {statistics.map((stat, index) => (
              <Card key={index} className="border-2 border-black bg-white rounded-lg">
                <CardBody className="p-6">
                  <div className="mb-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-black mb-2" style={{ fontFamily: 'Courier, monospace' }}>
                      {stat.percentage}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{stat.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 bg-black text-white text-xs font-bold flex items-center justify-center rounded">{stat.logo}</div>
                    <span className="text-xs text-gray-600 font-medium">{stat.source}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
