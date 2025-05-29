'use client';

import { Button, Input, Textarea, Card, CardHeader, CardBody, CardFooter } from '@heroui/react';
import React from 'react';

export const RequestDemo = () => {
  return (
    <section id="request-demo" className="bg-slate-950 py-20 sm:py-32">
      <div className="text-center">
        <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">Request a Demo</h2>
        <p className="mt-4 text-lg text-slate-400">Only pay for what you use — credits are flexible, fair, and never expire. .</p>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white/5 border border-slate-800 shadow-md backdrop-blur-md">
          <CardBody className="space-y-4">
            <Input isRequired type="text" label="Full Name" placeholder="Enter your name" className="text-white" classNames={{ inputWrapper: 'bg-slate-800', input: 'text-white' }} />
            <Input isRequired type="email" label="Email" placeholder="you@example.com" className="text-white" classNames={{ inputWrapper: 'bg-slate-800', input: 'text-white' }} />
            <Input type="text" label="Company" placeholder="Company Name" className="text-white" classNames={{ inputWrapper: 'bg-slate-800', input: 'text-white' }} />
            <Textarea label="Message" placeholder="Tell us a bit about what you're looking for..." className="text-white" classNames={{ inputWrapper: 'bg-slate-800', input: 'text-white' }} />
          </CardBody>
          <CardFooter className="flex justify-center mt-6">
            <Button color="success" className="text-white px-8 py-3 rounded-full">
              Request Demo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};
