'use client';

import React, { useState } from 'react';
import { Input, Button, Card, CardHeader, CardBody, toast } from '@heroui/react';
import { FaArrowRight, FaChartLine, FaCheckCircle, FaClock, FaDollarSign } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { showToast } from '@/app/utils/toastUtils';
import { Zap } from 'lucide-react';

export default function RequestDemoHero() {
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
    <Card shadow="none" className="border-2 border-[#c820d8] rounded-3xl bg-[url('/66cf226f15f01e88921e897a_Ellipse%202449-1.svg')] bg-cover bg-top p-4">
      <CardHeader className="pb-0 pt-4   flex flex-col items-start ">
        <div className="flex gap-2  items-start mb-4">
          <div className="rounded-full   p-1 mb-4 border-2 border-[#3534ff]">
            <Zap className="h-6 w-6 text-[#3534ff]" />
          </div>
          <p className="text-2xl font-bold text-black ">Request a Free Demo</p>
        </div>
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
            radius="lg"
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
              radius="lg"
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
              radius="lg"
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
            radius="lg"
            classNames={{
              inputWrapper: 'bg-white text-black border-slate-600',
              input: 'text-black placeholder:text-slate-500',
            }}
            value={formData.company}
            onChange={handleInputChange}
          />

          <Button radius="md" isLoading={isSubmiting} type="submit" size="md" className="mt-8 text-white  btn-gradient py-4 px-8 font-medium hover: hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700" endContent={<FaArrowRight className="w-4 h-4 text-white hover:translate-x-1 transition-transform" />}>
            Submit
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
