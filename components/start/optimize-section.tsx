'use client';

import { BrainCircuit, UserCheck, PieChart } from 'lucide-react';
import { Card, CardBody } from '@heroui/react';

export function OptimizationComparison() {
  const data = [
    {
      icon: <UserCheck className="h-6 w-6 text-white" />,
      title: 'Human-Like AI Interviews',
      desc: 'Experience realistic, human-like video interviews and resume screenings powered by our advanced AI interviewer helping you identify top talent effortlessly.',
    },
    {
      icon: <PieChart className="h-6 w-6 text-white" />,
      title: 'Data-Driven Insights',
      desc: 'Gain actionable insights with detailed, data-driven hiring reports. Make smarter, faster, and more confident recruitment decisions every time.',
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-white" />,
      title: 'Intelligent Interview Analytics',
      desc: 'Leverage built-in cheat detection and proctoring to ensure every interview remains fair, secure, and transparent.',
    },
  ];

  return (
    <section id="cost-analysis" className="w-full    lg:py-30 overflow-hidden">
      <div className="container  ">
        <div className=" w-full mx-auto">
          <Card className="bg-[#0B0A33] rounded-3xl mb-6 bg-[url('/66cf226f15f01e88921e897a_Ellipse%202449-1.svg')] bg-cover bg-center">
            <CardBody className="p-6 md:p-8">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-semibold text-white tracking-tighter mb-4 mt-6">AI Recruiting Platform for Modern Teams</h2>
                <p className="text-lg text-white max-w-2xl mx-auto">Streamline hiring with intelligent AI agents that interview, screen, and shortlist top talent faster than ever before.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-5">
                {/* LEFT: Feature Cards */}

                {/* RIGHT: Image */}
                <div className="flex justify-center lg:justify-end">
                  <img src="/images/dig.png" alt="AI Recruiting Dashboard" className="w-full max-w-[500px] rounded-2xl shadow-lg" />
                </div>

                <div className="flex flex-col gap-8">
                  {data.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 text-[#ede8f7] text-left">
                      {/* Icon Left */}
                      <div className="flex-shrink-0  bg-[#14124b]">{step.icon}</div>

                      {/* Title + Description */}
                      <div>
                        <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                        <p className="text-base leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
