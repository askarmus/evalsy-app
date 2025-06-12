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
    <section id="shedule-demo" className="min-h-screen bg-darkbase  flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block relative h-full   rounded-2xl overflow-hidden">
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="  mb-2">
                <div className="  mb-12">
                  <h2 className="font-display text-4xl font-bold text-white sm:text-4xl">Request your personalized demo</h2>
                  <p className="mt-4 text-lg text-white ">Only pay for what you use — credits are flexible, fair, and never expire.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card className="rounded-3xl bg-white/5 p-8 text-white   shadow-md">
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

                  <Button isLoading={isSubmiting} type="submit" size="lg" className="mt-8 inline-flex items-center justify-center rounded-full bg-white  py-4 px-8 font-medium   hover:text-white  hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700" endContent={<FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}>
                    Request Demo
                  </Button>
                </form>
              </CardBody>
            </Card>
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-start gap-4 md:gap-6 text-slate-400 text-sm">
                {['No commitment required', 'Free consultation', '24h response time'].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <FaCheckCircle className="w-4 h-4 text-gray-400" />
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
