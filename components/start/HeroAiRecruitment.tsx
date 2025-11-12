'use client';

import React, { useState } from 'react';

export default function HeroRecruitment() {
  return (
    <section id="shedule-demo" className="    flex items-center justify-center p-4 py-5 sm:py-32">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex-center w-full basis-1/2 md3:pr-4 xl:pr-10">
            <div className="flex w-full flex-col">
              <div>
                <div className="flex w-full gap-[18px] xl:gap-7">
                  <div className="flex flex-col gap-1.5 mf:max-w-[495px]">
                    <div className="flex gap-2 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 30 30" className="h-[26px] w-[26px] md:h-[30px] md:w-[30px]">
                        <path fill="#9f19ddff" d="M16.25 4.07h-7.5c-4.275 0-5.937 1.663-5.937 5.938v10c0 2.875 1.562 5.937 5.937 5.937h7.5c4.275 0 5.938-1.662 5.938-5.937v-10c0-4.275-1.663-5.938-5.938-5.938" opacity="0.4"></path>
                        <path fill="#9f19ddff" d="M14.375 14.223a2.35 2.35 0 1 0 0-4.7 2.35 2.35 0 0 0 0 4.7M27.062 7.707c-.512-.263-1.587-.563-3.05.462l-1.85 1.3c.013.175.025.338.025.525v10c0 .188-.025.35-.025.525l1.85 1.3c.775.55 1.45.725 1.988.725.462 0 .825-.125 1.062-.25.513-.262 1.375-.975 1.375-2.762v-9.063c0-1.787-.862-2.5-1.375-2.762"></path>
                      </svg>
                      <h2 className=" text-[22px]/[23px] md:text-[24px]/[23px] font-[600] text-text-primary">Human-like Interviews</h2>
                    </div>
                    <p className="text-[16px] font-normal text-text-teritary md:text-[18px]/6 xl:text-[18px]/[26px]">Our AI interviewer conducts human-like video interviews, coding assessments, phone and resume screenings, which help you find the right talent faster and easier.</p>
                  </div>
                </div>
                <div className="mb-6 mt-4 w-full border-none border-tertiary/[0.18] lg:mb-[34px] lg:mt-7 xl:mb-10 xl:mt-8"></div>
              </div>
              <div>
                <div className="flex w-full gap-[18px] xl:gap-7">
                  <div className="flex flex-col gap-1.5 mf:max-w-[495px]">
                    <div className="flex gap-2 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 30 30" className="h-[26px] w-[26px] md:h-[30px] md:w-[30px]">
                        <path fill="#9f19ddff" d="M14.998 27.5c6.904 0 12.5-5.596 12.5-12.5s-5.596-12.5-12.5-12.5-12.5 5.596-12.5 12.5 5.596 12.5 12.5 12.5" opacity="0.4"></path>
                        <path fill="#9f19ddff" d="M13.226 19.475c-.25 0-.488-.1-.663-.275l-3.537-3.537a.943.943 0 0 1 0-1.325.943.943 0 0 1 1.325 0l2.875 2.874 6.425-6.424a.943.943 0 0 1 1.325 0 .943.943 0 0 1 0 1.325L13.888 19.2a.94.94 0 0 1-.662.275"></path>
                      </svg>
                      <h2 className=" text-[22px]/[23px] md:text-[24px]/[23px] font-[600] text-text-primary">Data-driven Reports</h2>
                    </div>
                    <p className="text-[16px] font-normal text-text-teritary md:text-[18px]/6 xl:text-[18px]/[26px]">With our AI recruiting tools, you can make your hiring process smarter, simpler and more reliable with detailed data-driven reports.</p>
                  </div>
                </div>
                <div className="mb-6 mt-4 w-full border-none border-tertiary/[0.18] lg:mb-[34px] lg:mt-7 xl:mb-10 xl:mt-8"></div>
              </div>
              <div>
                <div className="flex w-full gap-[18px] xl:gap-7">
                  <div className="flex flex-col gap-1.5 mf:max-w-[495px]">
                    <div className="flex gap-2 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 30 30" className="h-[26px] w-[26px] md:h-[30px] md:w-[30px]">
                        <path
                          fill="#9f19ddff"
                          d="M2.498 16.094v-2.2c0-1.3 1.063-2.375 2.375-2.375 2.263 0 3.188-1.6 2.05-3.563a2.374 2.374 0 0 1 .875-3.237L9.961 3.48c.987-.587 2.262-.237 2.85.75l.137.238c1.125 1.962 2.975 1.962 4.113 0l.137-.238c.587-.987 1.863-1.337 2.85-.75l2.163 1.238a2.374 2.374 0 0 1 .875 3.237c-1.138 1.963-.213 3.563 2.05 3.563 1.3 0 2.375 1.062 2.375 2.375v2.2c0 1.3-1.063 2.375-2.375 2.375-2.263 0-3.188 1.6-2.05 3.562a2.37 2.37 0 0 1-.875 3.238l-2.163 1.237c-.987.588-2.262.238-2.85-.75l-.137-.237c-1.126-1.963-2.976-1.963-4.113 0l-.138.237c-.587.988-1.862 1.338-2.85.75L7.799 25.27a2.374 2.374 0 0 1-.875-3.238c1.138-1.962.213-3.562-2.05-3.562a2.38 2.38 0 0 1-2.375-2.375"
                          opacity="0.4"
                        ></path>
                        <path fill="#9f19ddff" d="M15 19.063a4.062 4.062 0 1 0 0-8.125 4.062 4.062 0 0 0 0 8.124"></path>
                      </svg>
                      <h2 className=" text-[22px]/[23px] md:text-[24px]/[23px] font-[600] text-text-primary">Interview Intelligence</h2>
                    </div>
                    <p className="text-[16px] font-normal text-text-teritary md:text-[18px]/6 xl:text-[18px]/[26px]">Built-in cheat detection and proctoring in our AI recruitment software ensures coding assessments and interviews remain fair, secure, and trustworthy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="p1-1 flex w-full basis-1/2">
              <div className="flex-center w-full">
                <img alt="image" decoding="async" data-nimg="1" src="/images/software-interview.png"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
