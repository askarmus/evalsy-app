'use client';

import { useState } from 'react';

import { ArrowRight, DollarSign, Clock, Target, Zap, TrendingUp, Users, CheckCircle, BarChart3 } from 'lucide-react';
import { Badge, Button, Card, CardBody, Chip, Divider } from '@heroui/react';

export function OptimizationComparison() {
  const [activeTab, setActiveTab] = useState('finances');

  const data = [
    {
      id: 'finances',
      label: 'FINANCES',
      icon: <DollarSign className="h-6 w-6" />,
      title: 'Smart Financial Optimization',
      description: 'Reduce hiring costs and maximize ROI with AI-powered recruitment',
      steps: [
        { icon: <BarChart3 className="h-6 w-6 text-white" />, title: 'Analyze Costs', desc: 'Track traditional hiring expenses' },
        { icon: <Zap className="h-6 w-6 text-white" />, title: 'AI Automation', desc: 'Deploy smart screening tools' },
        { icon: <TrendingUp className="h-6 w-6 text-white" />, title: 'Save Money', desc: 'Reduce cost per hire by 80%' },
      ],
      comparison: {
        traditional: { title: 'Traditional Hiring', value: '$20', unit: 'per hire' },
        ai: { title: 'Evalsy AI', value: '$0.8', unit: 'per hire' },
        savings: '80% Cost Savings',
        tagline: 'Automate. Cut. Save.',
      },
    },
    {
      id: 'time',
      label: 'TIME',
      icon: <Clock className="h-6 w-6" />,
      title: 'Accelerated Hiring Timeline',
      description: 'Speed up your hiring process without sacrificing quality',
      steps: [
        { icon: <Users className="h-6 w-6 text-white" />, title: 'Instant Screening', desc: 'AI reviews resumes in seconds' },
        { icon: <CheckCircle className="h-6 w-6 text-white" />, title: 'Quick Matching', desc: 'Find perfect candidates fast' },
        { icon: <Zap className="h-6 w-6 text-white" />, title: 'Rapid Hiring', desc: 'Complete process in 10 days' },
      ],
      comparison: {
        traditional: { title: 'Traditional Hiring', value: '42 days', unit: 'time-to-hire' },
        ai: { title: 'Evalsy AI', value: '10 days', unit: 'time-to-hire' },
        savings: '75% Faster Hiring',
        tagline: 'Streamline. Accelerate. Win.',
      },
    },
    {
      id: 'quality',
      label: 'QUALITY',
      icon: <Target className="h-6 w-6" />,
      title: 'Precision Talent Matching',
      description: 'Find the perfect candidates with AI-powered precision matching',
      steps: [
        {
          icon: <BarChart3 className="h-6 w-6 text-white" />,
          title: 'Skill Analysis',
          desc: 'Deep dive into candidate abilities',
        },
        { icon: <Target className="h-6 w-6 text-white" />, title: 'Perfect Match', desc: 'AI finds ideal culture fit' },
        { icon: <CheckCircle className="h-6 w-6 text-white" />, title: 'Quality Hire', desc: '99% accuracy in matching' },
      ],
      comparison: {
        traditional: { title: 'Manual Screening', value: '65%', unit: 'match rate' },
        ai: { title: 'Evalsy AI', value: '99%', unit: 'match rate' },
        savings: '99% Match Accuracy',
        tagline: 'Analyze. Learn. Hire.',
      },
    },
    {
      id: 'efficiency',
      label: 'EFFICIENCY',
      icon: <Zap className="h-6 w-6" />,
      title: 'Maximum Processing Power',
      description: 'Process more candidates in less time with AI automation',
      steps: [
        { icon: <Users className="h-6 w-6 ttext-white" />, title: 'Bulk Processing', desc: 'Handle hundreds of resumes' },
        { icon: <Zap className="h-6 w-6 text-white" />, title: 'Smart Sorting', desc: 'AI ranks candidates instantly' },
        { icon: <TrendingUp className="h-6 w-6 text-white" />, title: 'Scale Up', desc: 'Process 100+ candidates daily' },
      ],
      comparison: {
        traditional: { title: 'Manual Process', value: '25', unit: 'candidates/day' },
        ai: { title: 'Evalsy AI', value: '100+', unit: 'candidates/day' },
        savings: '100 Candidates Sorted',
        tagline: 'Instant. Smart. Precise.',
      },
    },
  ];

  const currentData = data.find((item) => item.id === activeTab) || data[2];

  return (
    <section id="cost-analysis" className="w-full py-10 md:py-16 lg:py-20    overflow-hidden">
      <div className="container px-4 md:px-6">
        {/* Header */}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {/* Steps */}

          {/* Results Comparison */}
          <Card className="bg-red bg-[#0B0A33]  rounded-3xl mb-6 bg-[url('/66cf226f15f01e88921e897a_Ellipse%202449-1.svg')] bg-cover bg-center">
            <CardBody className="p-6 md:p-8">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-semibold  sm:text-4xl text-white tracking-tighter sm:text-4xl md:text-4xl mb-4">
                  Transform Your Hiring Process with <span className="gradients-primary-2-text-hard">Evalsy</span>
                </h2>
              </div>

              {/* Tab Navigation */}
              <div className="flex flex-wrap justify-center gap-2 mb-10">
                {data.map((item) => (
                  <Button key={item.id} variant={activeTab === item.id ? 'solid' : 'bordered'} onPress={() => setActiveTab(item.id)} className={`px-6 py-2 text-sm font-medium border-2 rounded-full transition-all flex items-center gap-2 ${activeTab === item.id ? 'button-bg-image-active hover:bg-[#3534ff] text-white' : 'bg-transparent text-[#ede8f7] button-bg-image hover:border-[#98FB98] hover:bg-[#98FB98] hover:text-black'}`}>
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative">
                {currentData.steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="rounded-full   p-4 mb-4 border-2 border-[#ede8f7]">{step.icon}</div>
                    <h4 className="text-lg  text-[#ede8f7] font-bold mb-2">{step.title}</h4>
                    <p className="text-[#ede8f7]">{step.desc}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Traditional */}
                <div className="text-center p-6   rounded-l-xl  bg-white  ">
                  <h5 className="font-bold mb-2 text-black">{currentData.comparison.traditional.title}</h5>
                  <div className="text-3xl font-bold  text-black  mb-1">{currentData.comparison.traditional.value}</div>
                  <p className="text-sm text-black">{currentData.comparison.traditional.unit}</p>
                </div>

                {/* AI */}
                <div className="text-center p-6 bg-[#3534ff] rounded-r-xl  ">
                  <h5 className="font-bold mb-2 text-white">{currentData.comparison.ai.title}</h5>
                  <div className="text-3xl font-bold text-white mb-1">{currentData.comparison.ai.value}</div>
                  <p className="text-sm text-gray-100">{currentData.comparison.ai.unit}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
