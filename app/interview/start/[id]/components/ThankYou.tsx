"use client";
import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import { Card, CardBody, CardHeader } from "@heroui/react";
import CandidateInfo from "./CandidateInfo";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import PoweredBy from "./PoweredBy";

const ThankYou: React.FC = () => {
  const { setPhase, candidate, company, job } = useInterviewStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.error("Audio play failed:", error));

      audioRef.current.ontimeupdate = () => {
        const audioTime = audioRef.current?.currentTime || 0;
        setCurrentTime(audioTime);

        // ✅ Prevent error if `company?.timestamps` is undefined
        if (!company?.timestamps) return;

        // Find the current word being spoken
        const currentWordIndex = company.timestamps.findIndex((wordData, index) => audioTime >= wordData.time && (index === company.timestamps.length - 1 || audioTime < company.timestamps[index + 1].time));

        if (currentWordIndex !== activeWordIndex) {
          setActiveWordIndex(currentWordIndex);
        }
      };
    }
  }, [company?.timestamps]); // ✅ Add dependency to prevent undefined errors

  const handleAudioEnd = () => {
    setPhase("in-progress");
  };

  return (
    <>
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-screen-xl mx-auto px-6 py-8'>
          <Card className='p-8' shadow='sm' radius='sm'>
            <Card className='py-4 text-center' shadow='none'>
              <CardBody className='overflow-visible py-2'>
                <div className='p-4   rounded-lg max-w-3xl mx-auto'>
                  <div className='p-6 text-center'>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className='mb-6 inline-flex justify-center'>
                      <div className='rounded-full bg-emerald-100 p-2'>
                        <FaCheckCircle className='h-10 w-10 text-emerald-600' />
                      </div>
                    </motion.div>

                    <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className='text-3xl font-bold tracking-tight mb-4'>
                      <div className='text-lg leading-relaxed  text-center  mt-4'>
                        <div> Thank You for Completing the AI Interview!</div>
                      </div>
                    </motion.h1>

                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className=' max-w-xl mx-auto mb-8'>
                      <div className='text-lg    text-center  mt-4'>
                        <div>{company.thankYouMessage}</div>
                      </div>
                    </motion.p>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }} className='flex flex-col sm:flex-row gap-3 justify-center'></motion.div>
                  </div>
                </div>
                <audio ref={audioRef} onEnded={handleAudioEnd}>
                  <source src={company.thankYouAudioUrl} type='audio/wav' />
                  Your browser does not support the audio element.
                </audio>
              </CardBody>
            </Card>
          </Card>

          <PoweredBy />
        </div>
      </div>
    </>
  );
};

export default ThankYou;
