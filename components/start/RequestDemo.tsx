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
    <section id="shedule-demo" className=" bg-[url('/02.svg')] bg-cover bg-center  flex items-center justify-center p-4 py-20 sm:py-32">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:block relative h-full rounded-2xl overflow-hidden">
            <div className="relative z-10 p-8 h-full flex flex-col justify-center">
              <div className="mb-12">
                <div className="inline-block   px-4 py-1 border-2 border-black rounded-full mb-5">Demo</div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-semibold  sm:text-4xl text-[#262626]  sm:text-4xl md:text-4xl">
                    Request Your <br></br> <span className="gradients-primary-2-text-hard">Personalized</span> Demo
                  </h2>
                  <p className="text-lg   max-w-md">Only pay for what you use — credits are flexible, fair, and never expire.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card shadow="none" className=" shadow-2xl rounded-2xl  bg-white p-4">
              <CardHeader className="pb-0 pt-4   flex flex-col items-start mb-3">
                <p className="text-xl font-bold text-black">Tell us about your needs</p>
                <p className="text-sm text-black">We will get back to you within 24 hours to schedule your personalized demo.</p>
              </CardHeader>
              <CardBody className="px-1 py-1">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    name="fullName"
                    label="Full Name"
                    labelPlacement="inside"
                    size="sm"
                    isRequired
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      inputWrapper: 'bg-white text-black border-slate-600',
                      input: 'text-black placeholder:text-slate-500',
                    }}
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      name="email"
                      size="sm"
                      type="email"
                      label="Email Address"
                      labelPlacement="inside"
                      isRequired
                      variant="bordered"
                      radius="sm"
                      classNames={{
                        inputWrapper: 'bg-white text-black border-slate-600',
                        input: 'text-black placeholder:text-slate-500',
                      }}
                      value={formData.email}
                      onChange={handleInputChange}
                    />

                    <Input
                      name="mobile"
                      label="Mobile Number"
                      size="sm"
                      isRequired
                      type="tel"
                      variant="bordered"
                      radius="sm"
                      classNames={{
                        inputWrapper: 'bg-white text-black border-slate-600',
                        input: 'text-black placeholder:text-slate-500',
                      }}
                      value={formData.mobile}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Input
                    name="company"
                    label="Company Name"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      inputWrapper: 'bg-white text-black border-slate-600',
                      input: 'text-black placeholder:text-slate-500',
                    }}
                    value={formData.company}
                    onChange={handleInputChange}
                  />

                  <Button radius="full" isLoading={isSubmiting} type="submit" size="md" className="mt-8 text-white  bg-black py-4 px-8 font-medium hover: hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700" endContent={<FaArrowRight className="w-4 h-4 text-white hover:translate-x-1 transition-transform" />}>
                    Request Demo
                  </Button>
                </form>
              </CardBody>
            </Card>
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-start gap-4 md:gap-6 text-sm">
                {['No commitment required', 'Free consultation', '24h response time'].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <FaCheckCircle className="w-4 h-4  " />
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
