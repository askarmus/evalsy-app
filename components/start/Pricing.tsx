import Link from "next/link";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { EXTRA_INVITATION_PRICE, EXTRA_RESUME_PRICE, MONTHLY_BASE_INVITATION, MONTHLY_BASE_PRICE, MONTHLY_BASE_RESUME } from "../../../evalsy-shared/constants";

export const Pricing = () => {
  return (
    <section id='pricing' aria-label='Pricing' className='bg-slate-900 py-20 sm:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='md:text-center'>
          <h2 className='font-display text-3xl tracking-tight text-white sm:text-4xl'>
            <span className='relative whitespace-nowrap'>
              <span className='relative'>🚀 Simple, Transparent Pricing </span>
            </span>
          </h2>
          <p className='mt-4 text-lg text-slate-400'>
            Start for just <span className='font-bold'>${MONTHLY_BASE_PRICE}/month</span> – Unlimited Jobs &amp; Flexible Invitations!
          </p>
        </div>
        <div className='-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8'>
          {/* Professional Plan */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 order-first bg-blue-600 py-8 lg:order-none'>
            <h3 className='mt-5 font-display text-lg text-white'>Subscription</h3>
            <p className='mt-2 text-base text-blue-50'>Ideal for growing businesses</p>
            <p className='order-first font-display text-3xl font-light tracking-tight text-white'>${MONTHLY_BASE_PRICE}/m</p>

            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-blue-50'>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>
                  <strong>Unlimited</strong> Job Postings
                </span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>
                  <strong>{MONTHLY_BASE_INVITATION} Invitations</strong> per month
                </span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>
                  <strong>{MONTHLY_BASE_RESUME} AI Resume Screening</strong> per month
                </span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Secure Stripe Billing</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Cancel Anytime</span>
              </li>
            </ul>
          </section>

          {/* Professional Plan */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 order-first boarder-1px-solid border border-gray-300  py-8 lg:order-none'>
            <h3 className='mt-5 font-display text-lg text-white'>SAAS</h3>
            <p className='mt-2 text-base text-blue-50'>Ideal for growing businesses</p>
            <p className='order-first font-display text-3xl font-light tracking-tight text-white'>Invitation</p>

            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-blue-50'>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>
                  <strong>${EXTRA_INVITATION_PRICE} per extra invite</strong> beyond {MONTHLY_BASE_INVITATION}
                </span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Auto-billed at the end of the month</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Usage-based pricing for flexibility</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Cancel Anytime</span>
              </li>
            </ul>
          </section>

          {/* Professional Plan */}
          <section className='flex flex-col rounded-3xl px-6 sm:px-8 order-first bg-blue-600 py-8 lg:order-none'>
            <h3 className='mt-5 font-display text-lg text-white'>SAAS</h3>
            <p className='mt-2 text-base text-blue-50'>Ideal for growing businesses</p>
            <p className='order-first font-display text-3xl font-light tracking-tight text-white'>Resume Screening</p>

            <ul role='list' className='order-last mt-10 flex flex-col gap-y-3 text-sm text-blue-50'>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>
                  <strong>${EXTRA_RESUME_PRICE} per extra resume screening</strong> beyond {MONTHLY_BASE_RESUME}
                </span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Auto-billed at the end of the month</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Usage-based pricing for flexibility</span>
              </li>
              <li className='flex'>
                <AiOutlineCheckCircle className='h-6 w-6 flex-none fill-current stroke-current text-blue-200' />
                <span className='ml-4'>Cancel Anytime</span>
              </li>
            </ul>
          </section>
        </div>

        <div className='mt-10 text-center'>
          <Link className='mt-8 inline-flex items-center justify-center rounded-full bg-green-700 py-4 px-8   font-medium text-white hover:bg-slate-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700' href='/signup'>
            Try for free
          </Link>
          <p className='text-white text-sm mt-3'>Free 14-day trial. No credit card required.</p>
        </div>

        {/* FAQ Section
        <div className='mt-12 text-left shadow-md rounded-lg p-6'>
          <h2 className='text-2xl font-semibold text-white'>FAQ</h2>

          <div className='mt-4 space-y-4'>
            <div>
              <h3 className='font-bold text-white'>What happens if I exceed 50 invitations?</h3>
              <p className='text-gray-400'>
                You will be charged <strong>$0.10 per extra invite</strong>. Stripe will auto-bill you at the end of the month.
              </p>
            </div>

            <div>
              <h3 className='font-bold text-white'>Can I cancel my subscription?</h3>
              <p className='text-gray-400'>Yes! You can cancel anytime before the next billing cycle.</p>
            </div>

            <div>
              <h3 className='font-bold text-white'>Are job postings really unlimited?</h3>
              <p className='text-gray-400'>Yes! You can post as many jobs as you need without any additional charge.</p>
            </div>

            <div>
              <h3 className='font-bold text-white'>How does billing work?</h3>
              <p className='text-gray-400'>
                Your <strong>$20 subscription</strong> renews every month. If you send more than 50 invitations, you’ll be billed based on usage at the end of the billing period.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};
