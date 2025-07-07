import Link from 'next/link';
import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';

export const Pricing = () => {
  return (
    <section id="pricing" className="bg-gradient-6 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-4xl font-semibold  sm:text-4xl text-[#262626]">
            Simple, <span className="gradients-primary-2-text-hard">Usage-Based Pricing </span>for AI Interviewing
          </h2>
          <p className="mt-4 text-lg  ">Start for free no credit card required and pay only for what you use. Our flexible credit system ensures you never waste features.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
          {/* Free Trial */}
          <div className=" p-8 shadow-2xl rounded-2xl  bg-white">
            <h3 className="text-2xl font-semibold">Free Trial</h3>
            <p className="mt-2 text-sm ">Get started with no risk — no credit card required.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                10 free credits
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                Unlimited job postings
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                Full access to AI interviews
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                Cancel anytime, no commitment
              </li>
            </ul>
          </div>

          {/* Credit Packages */}
          <div className="p-8 shadow-2xl rounded-2xl  bg-white">
            <h3 className="text-2xl font-semibold">Credit Packages</h3>
            <p className="mt-2 text-sm  ">Buy once, use anytime — credits never expire.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                50 Credits – <strong>$10</strong>
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                200 Credits – <strong>$35</strong>
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                500 Credits – <strong>$75</strong>
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                Credits never expire
              </li>
            </ul>
          </div>

          {/* Credit Usage */}
          <div className="shadow-2xl rounded-2xl  bg-white p-8">
            <h3 className="text-2xl font-semibold">Pay-as-You-Go</h3>
            <p className="mt-2 text-sm">Pay only for the time and services you use.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                Resume screening – 1 credit per resume
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                Manual interview invite – 3 credits
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                AI voice interview – 1 credit per minute
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-[#3534ff] mr-3 h-5 w-5" />
                Real-time usage tracking in your dashboard
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Link className="mt-8 text-white   btn-gradient round-md rounded-lg py-3 px-8 font-medium   hover:   hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700" href="/signup">
            Try for free
          </Link>
          <p className=" text-sm mt-3">Start with 10 free credits – no credit card required.</p>
        </div>
        ``
      </div>
    </section>
  );
};
