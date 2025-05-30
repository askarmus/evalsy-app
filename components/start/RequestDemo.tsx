'use client';

import React, { useState } from 'react';
import { Input, Button, Card, CardHeader, CardBody, toast } from '@heroui/react';
import { FaArrowRight, FaChartLine, FaCheckCircle, FaClock, FaDollarSign } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { showToast } from '@/app/utils/toastUtils';

export default function RequestDemo() {
  const [isSubmiting, setISubmiting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    mobile: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setISubmiting(true);

    try {
      const result = await emailjs.send(
        'service_9z5foln', // Your EmailJS service ID
        'template_bd8ds3t', // Your EmailJS template ID
        formData,
        '5QUKIiJdXWi3K2KIR' // Your EmailJS public key
      );
      console.log('SUCCESS!', result.status, result.text);
      showToast.success('Demo request submitted successfully!');
      setFormData({ fullName: '', email: '', company: '', mobile: '' });
    } catch (error) {
      console.error('FAILED...', error);
      showToast.error('Something went wrong. Please try again later.');
    } finally {
      setISubmiting(false);
    }
  };

  return (
    <section id="shedule-demo" className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block relative h-full min-h-[600px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-blue-600">
              <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
            </div>
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="  mb-2">
                <h2 className="text-3xl font-bold text-white   leading-tight">
                  Request your <br></br> personalized demo
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FaClock className="w-5 h-5 text-blue-400" />
                    <span className="text-blue-400 font-bold text-lg">75%</span>
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">Faster Hiring</div>
                  <div className="text-slate-400 text-xs">Streamline. Accelerate. Win.</div>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <FaDollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-bold text-lg">80%</span>
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">Cost Savings</div>
                  <div className="text-slate-400 text-xs">Automate. Cut. Save.</div>
                </div>
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <FaChartLine className="w-5 h-5 text-blue-400" />
                  <h3 className="text-white font-semibold">Optimize your company&rsquo;s finances</h3>
                </div>
                <p className="text-slate-300 text-sm mb-4">Reduce hiring costs and maximize ROI with AI-powered recruitment</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">FINANCES</div>
                  <div className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs font-medium border border-slate-600/30">TIME</div>
                  <div className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs font-medium border border-slate-600/30">QUALITY</div>
                  <div className="bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full text-xs font-medium border border-slate-600/30">EFFICIENCY</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card className="rounded-3xl bg-white/5 p-8 text-white border border-slate-700 shadow-md">
              <CardHeader className="pb-0 pt-4   flex flex-col items-start mb-3">
                <p className="text-xl font-bold text-white">Tell us about your needs</p>
                <p className="text-sm text-slate-400">We will get back to you within 24 hours to schedule your personalized demo.</p>
              </CardHeader>
              <CardBody className="px-1 py-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    name="fullName"
                    label="Full Name"
                    placeholder="Enter your full name"
                    isRequired
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      inputWrapper: 'bg-white text-black border-slate-300',
                      input: 'text-black placeholder:text-slate-500',
                    }}
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="you@company.com"
                      isRequired
                      variant="bordered"
                      radius="sm"
                      classNames={{
                        inputWrapper: 'bg-white text-black border-slate-300',
                        input: 'text-black placeholder:text-slate-500',
                      }}
                      value={formData.email}
                      onChange={handleInputChange}
                    />

                    <Input
                      name="mobile"
                      label="Mobile Number"
                      placeholder="+1 555 123 4567"
                      isRequired
                      type="tel"
                      variant="bordered"
                      radius="sm"
                      classNames={{
                        inputWrapper: 'bg-white text-black border-slate-300',
                        input: 'text-black placeholder:text-slate-500',
                      }}
                      value={formData.mobile}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Input
                    name="company"
                    label="Company Name"
                    placeholder="Your company name"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      inputWrapper: 'bg-white text-black border-slate-300',
                      input: 'text-black placeholder:text-slate-500',
                    }}
                    value={formData.company}
                    onChange={handleInputChange}
                  />

                  <Button isLoading={isSubmiting} type="submit" size="lg" className="mt-8 inline-flex items-center justify-center rounded-full bg-green-700 py-4 px-8 font-medium text-white hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700" endContent={<FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}>
                    Request Demo
                  </Button>
                </form>
              </CardBody>
            </Card>
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-start gap-4 md:gap-6 text-slate-400 text-sm">
                {['No commitment required', 'Free consultation', '24h response time'].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <FaCheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
