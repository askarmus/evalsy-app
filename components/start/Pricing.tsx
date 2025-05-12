import Link from 'next/link';
import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { EXTRA_INVITATION_PRICE, EXTRA_RESUME_PRICE, MONTHLY_BASE_INVITATION, MONTHLY_BASE_PRICE, MONTHLY_BASE_RESUME } from '../../constants';

export const Pricing = () => {
  return (
    <section id="pricing" className="bg-slate-900 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">Simple, Pay-As-You-Go Pricing</h2>
          <p className="mt-4 text-lg text-slate-400">
            Start with as low as <strong>$10</strong>. Buy credits and use them however you need — no subscriptions, no limits.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
          {/* Free Trial */}
          <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-lg">
            <h3 className="text-2xl font-semibold">Free Trial</h3>
            <p className="mt-2 text-sm text-blue-100">Get started with no risk — no credit card required.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-blue-200 mr-3 h-5 w-5" />
                10 free credits
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-blue-200 mr-3 h-5 w-5" />
                Unlimited job postings
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-blue-200 mr-3 h-5 w-5" />
                Access to all features
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-blue-200 mr-3 h-5 w-5" />
                No commitment, cancel anytime
              </li>
            </ul>
          </div>

          {/* Credit Packages */}
          <div className="rounded-3xl bg-white/5 p-8 text-white border border-slate-700 shadow-md">
            <h3 className="text-2xl font-semibold">Credit Packages</h3>
            <p className="mt-2 text-sm text-slate-400">Pick the pack that fits your hiring volume.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-slate-400 mr-3 h-5 w-5" />
                50 Credits – <strong>$10</strong>
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-slate-400 mr-3 h-5 w-5" />
                200 Credits – <strong>$35</strong>
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-slate-400 mr-3 h-5 w-5" />
                500 Credits – <strong>$75</strong>
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-slate-400 mr-3 h-5 w-5" />
                Credits never expire
              </li>
            </ul>
          </div>

          {/* Credit Usage */}
          <div className="rounded-3xl bg-white/5 p-8 text-white border border-slate-700 shadow-md">
            <h3 className="text-2xl font-semibold">Credit Usage</h3>
            <p className="mt-2 text-sm text-slate-400">Only pay for what you use — nothing more.</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-slate-400 mr-3 h-5 w-5" />1 credit per resume screened
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-slate-400 mr-3 h-5 w-5" />3 credits per interview invite
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-slate-400 mr-3 h-5 w-5" />
                Transparent, usage-based pricing
              </li>
              <li className="flex items-center">
                <AiOutlineCheckCircle className="text-slate-400 mr-3 h-5 w-5" />
                Secure checkout via Stripe
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link className="mt-8 inline-flex items-center justify-center rounded-full bg-green-700 py-4 px-8   font-medium text-white hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700" href="/signup">
            Try for free
          </Link>
          <p className="text-white text-sm mt-3">Start with 10 free credits – no credit card required.</p>
        </div>
      </div>
    </section>
  );
};
