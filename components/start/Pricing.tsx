import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

export const Pricing = () => {
  return (
    <section id='pricing' aria-label='Pricing' className='bg-slate-900 py-20 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='md:text-center'>
          <h2 className='font-display text-3xl tracking-tight text-white sm:text-4xl'>
            <span className='relative whitespace-nowrap'>
              <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
              <span className='relative'>Transparent Pricing,</span>
            </span>{" "}
            Built for Scale
          </h2>
          <p className='mt-4 text-lg text-slate-400'>Whether you arere a startup or enterprise, we have got you covered.</p>
        </div>
        <div className='-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8'>
          {/* Starter Plan */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 lg:py-8'>
            <h3 className='mt-5 font-display text-lg text-white'>Starter</h3>
            <p className='mt-2 text-base text-slate-400'>Perfect for startups and small teams</p>
            <p className='order-first font-display text-5xl font-light tracking-tight text-white'>$29</p>
            <span className='text-sm text-slate-400'>/month</span>
            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-slate-200'>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>AI-generated questions & evaluations</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Video interview recording & analysis</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Customizable evaluation criteria</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Reporting & analytics dashboard</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Team collaboration tools</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>3 Active Jobs</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>30 Invitations/Month</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>10GB Video storage</span>
              </li>
            </ul>
            <a className='mt-8 inline-flex items-center justify-center rounded-full bg-slate-700 py-2 px-4 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700' href='/register'>
              Get Started
            </a>
          </section>

          {/* Professional Plan */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 order-first bg-blue-600 py-8 lg:order-none'>
            <h3 className='mt-5 font-display text-lg text-white'>Professional</h3>
            <p className='mt-2 text-base text-blue-50'>Ideal for growing businesses</p>
            <p className='order-first font-display text-5xl font-light tracking-tight text-white'>$79</p>
            <span className='text-sm text-blue-100'>/month</span>
            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-blue-50'>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Everything in Starter</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Priority customer support</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>10 Active Jobs</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>100 Invitations/Month</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>50GB Video storage</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Advanced analytics</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Custom branding</span>
              </li>
            </ul>
            <a className='mt-8 inline-flex items-center justify-center rounded-full bg-white py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white' href='/register'>
              Start Free Trial
            </a>
          </section>

          {/* Enterprise Plan */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 lg:py-8'>
            <h3 className='mt-5 font-display text-lg text-white'>Enterprise</h3>
            <p className='mt-2 text-base text-slate-400'>For large organizations</p>
            <div className='order-first'>
              <p className='font-display text-5xl font-light tracking-tight text-white'>Custom</p>
              <p className='mt-2 text-sm text-slate-400'>Starting at $199/month</p>
            </div>
            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-slate-200'>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Everything in Professional</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Dedicated account manager</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>24/7 premium support</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Custom API integrations</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>SLA & Enterprise-grade security</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Unlimited Active Jobs</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>Unlimited Invitations</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-slate-400' />
                <span className='ml-4'>1TB+ Video storage</span>
              </li>
            </ul>
            <a className='mt-8 inline-flex items-center justify-center rounded-full bg-slate-700 py-2 px-4 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700' href='/contact'>
              Contact Sales
            </a>
          </section>
        </div>
      </div>
    </section>
  );
};
