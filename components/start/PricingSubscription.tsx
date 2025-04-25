import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

export const PricingSubscription = () => {
  return (
    <section id='pricing' aria-label='Pricing' className='bg-white dark:bg-gray-900'>
      <div className='mx-auto px-4'>
        <div className='-mx-4 mt-5 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8'>
          {/* Subscription Plan */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 bg-blue-100 dark:bg-blue-200 py-8 shadow-md'>
            <h3 className='mt-5 font-display text-lg text-gray-900 dark:text-gray-800'>Subscription</h3>
            <p className='mt-2 text-base text-gray-700 dark:text-gray-800'>Ideal for growing businesses</p>
            <p className='order-first font-display text-3xl font-light tracking-tight text-gray-900 dark:text-gray-800 font-semibold'>$20/m</p>

            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-gray-700 dark:text-gray-800'>
              {["Unlimited Job Postings", "50 Invitations per month", "50 AI Resume Screening per month", "Secure Stripe Billing", "Cancel Anytime"].map((item, idx) => (
                <li className='flex' key={idx}>
                  <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                  <span className='ml-4'>{item.includes("Unlimited") || item.includes("50") ? <strong>{item}</strong> : item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SAAS - Invitation */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-8 shadow-md'>
            <h3 className='mt-5 font-display text-lg text-gray-900 dark:text-white'>SAAS</h3>
            <p className='mt-2 text-base text-gray-700 dark:text-gray-300'>Ideal for growing businesses</p>
            <p className='order-first font-display text-3xl font-light tracking-tight text-gray-900 dark:text-white font-semibold'>Invitation</p>

            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-gray-700 dark:text-gray-300'>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                <span className='ml-4'>
                  <strong>$0.10 per extra invite</strong> beyond 50
                </span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                <span className='ml-4'>Auto-billed at the end of the month</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                <span className='ml-4'>Usage-based pricing for flexibility</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                <span className='ml-4'>Cancel Anytime</span>
              </li>
            </ul>
          </section>

          {/* SAAS - Resume Screening */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 bg-blue-100 dark:bg-blue-200 py-8 shadow-md'>
            <h3 className='mt-5 font-display text-lg text-gray-900 dark:text-gray-800'>SAAS</h3>
            <p className='mt-2 text-base text-gray-700 dark:text-gray-800'>Ideal for growing businesses</p>
            <p className='order-first font-display text-3xl font-light tracking-tight text-gray-900 dark:text-gray-800 font-semibold'>CV Screening</p>

            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-gray-700 dark:text-gray-800'>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                <span className='ml-4'>
                  <strong>$0.10 per extra resume screening</strong> beyond 50
                </span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                <span className='ml-4'>Auto-billed at the end of the month</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                <span className='ml-4'>Usage-based pricing for flexibility</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none text-blue-500' />
                <span className='ml-4'>Cancel Anytime</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
};
