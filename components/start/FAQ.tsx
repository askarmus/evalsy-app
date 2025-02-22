import React from "react";

export const FAQ = () => {
  return (
    <section id='faq' aria-labelledby='faq-title' className='relative overflow-hidden bg-slate-50 py-20 sm:py-32'>
      <img alt='' loading='lazy' width={1558} height={946} decoding='async' data-nimg={1} className='absolute top-0 left-1/2 max-w-none -translate-y-1/4 translate-x-[-30%]' src='/background-faqs.55d2e36a.jpg' style={{ color: "transparent" }} />
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative'>
        <div className='mx-auto max-w-2xl lg:mx-0'>
          <h2 id='faq-title' className='font-display text-3xl tracking-tight text-slate-900 sm:text-4xl'>
            What people are saying about us.
          </h2>
          <p className='mt-4 text-lg tracking-tight text-slate-700'>If you can’t find what you’re looking for, email our support team and if you’re lucky someone will get back to you.</p>
        </div>
        <div className='flex flex-wrap -m-4 mt-8'>
          <div className='w-full p-4 md:w-1/3'>
            <div className='p-6 border shadow-xl rounded-3xl'>
              <a className='inline-flex items-center mb-2'>
                <img alt='blog' src='https://randomuser.me/api/portraits/men/32.jpg' className='flex-shrink-0 object-cover object-center w-8 h-8 rounded-full' />
                <span className='flex flex-col flex-grow pl-4'>
                  <span className='text-xs uppercase text-slate-600'>James Miller</span>
                </span>
              </a>
              <p className='text-sm leading-relaxed text-gray-500'>&quot;Hiring has never been this smooth! With AI automation, we filled roles faster than ever. Truly effortless and efficient!&quot;</p>
            </div>
            <div className='p-6 mt-4 border shadow-xl rounded-3xl'>
              <a className='inline-flex items-center mb-2'>
                <img alt='blog' src='https://randomuser.me/api/portraits/men/45.jpg' className='flex-shrink-0 object-cover object-center w-8 h-8 rounded-full' />
                <span className='flex flex-col flex-grow pl-4'>
                  <span className='text-xs uppercase text-slate-600'>Lucy Henderson</span>
                </span>
              </a>
              <p className='text-sm leading-relaxed text-gray-500'>&quot;I was blown away by how simple the hiring process became. The AI did the heavy lifting, letting me focus on choosing the best candidates.&quot;</p>
            </div>
          </div>
          <div className='w-full p-4 md:w-1/3'>
            <div className='p-6 border shadow-xl rounded-3xl'>
              <a className='inline-flex items-center mb-2'>
                <img alt='blog' src='https://randomuser.me/api/portraits/men/76.jpg' className='flex-shrink-0 object-cover object-center w-8 h-8 rounded-full' />
                <span className='flex flex-col flex-grow pl-4'>
                  <span className='text-xs uppercase text-slate-600'>Michael Lee</span>
                </span>
              </a>
              <p className='text-sm leading-relaxed text-gray-500'>&quot;From endless paperwork to streamlined hiring—this AI tool transformed our recruitment. Its like having an extra HR team!&quot;</p>
            </div>
            <div className='p-6 mt-4 border shadow-xl rounded-3xl'>
              <a className='inline-flex items-center mb-2'>
                <img alt='blog' src='https://randomuser.me/api/portraits/women/12.jpg' className='flex-shrink-0 object-cover object-center w-8 h-8 rounded-full' />
                <span className='flex flex-col flex-grow pl-4'>
                  <span className='text-xs uppercase text-slate-600'>Sophia Turner</span>
                </span>
              </a>
              <p className='text-sm leading-relaxed text-gray-500'>&quot;Effortless is an understatement. The AI handled everything from screening to scheduling, saving us hours of manual work.&quot;</p>
            </div>
          </div>
          <div className='w-full p-4 md:w-1/3'>
            <div className='p-6 border shadow-xl rounded-3xl'>
              <a className='inline-flex items-center mb-2'>
                <img alt='blog' src='https://randomuser.me/api/portraits/men/84.jpg' className='flex-shrink-0 object-cover object-center w-8 h-8 rounded-full' />
                <span className='flex flex-col flex-grow pl-4'>
                  <span className='text-xs uppercase text-slate-600'>David Nguyen</span>
                </span>
              </a>
              <p className='text-sm leading-relaxed text-gray-500'>&quot;What used to take weeks now takes days. The AI makes hiring so simple that I wonder how we ever managed without it.&quot;</p>
            </div>
            <div className='p-6 mt-4 border shadow-xl rounded-3xl'>
              <a className='inline-flex items-center mb-2'>
                <img alt='blog' src='https://randomuser.me/api/portraits/women/67.jpg' className='flex-shrink-0 object-cover object-center w-8 h-8 rounded-full' />
                <span className='flex flex-col flex-grow pl-4'>
                  <span className='text-xs uppercase text-slate-600'>Emily Clark</span>
                </span>
              </a>
              <p className='text-sm leading-relaxed text-gray-500'>&quot;This tool turned hiring chaos into clarity. With AI automation, we found top talent without breaking a sweat! It’s a complete game-changer for our team.&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
