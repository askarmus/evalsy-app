"use client";
import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { ToastContainer } from "react-toastify";
import CandidateInfo from "./CandidateInfo";

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

        // Find the current word being spoken
        const currentWordIndex = company.timestamps.findIndex((wordData, index) => audioTime >= wordData.time && (index === company.timestamps.length - 1 || audioTime < company.timestamps[index + 1].time));

        if (currentWordIndex !== activeWordIndex) {
          setActiveWordIndex(currentWordIndex);
        }
      };
    }
  }, []);

  const handleAudioEnd = () => {
    //setPhase("in-progress");
  };

  return (
    <>
      <div className='min-h-screen'>
        <main className='max-w-7xl mx-auto px-6 py-8'>
          <Card className='p-8' shadow='sm'>
            <CardHeader>
              <CandidateInfo candidate={candidate} company={company} job={job} />
            </CardHeader>
            <Card className='py-4' shadow='sm'>
              <CardBody className='overflow-visible py-2'>
                <div className='p-6 text-gray-800 rounded-lg max-w-3xl mx-auto'>
                  <h2 className='text-2xl font-bold mb-4 text-center'>Thank You for Completing the AI Interview!</h2>
                  <p className='text-lg leading-relaxed text-gray-700 mt-4'>
                    <p>Your responses have been successfully recorded and are now being evaluated. We will review your results and get back to you if you successfully move to the next stage of the interview process.</p>
                    {company?.timestamps?.map((item, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: index === activeWordIndex ? "yellow" : "transparent",
                          transition: "background-color 0.2s ease-in-out",
                        }}>
                        {item.word}{" "}
                      </span>
                    ))}
                  </p>
                </div>
                <audio ref={audioRef} onEnded={handleAudioEnd}>
                  <source src='https://storage.googleapis.com/evalsy-storage/uploads/tts-audio-1740563598643.mp3' type='audio/mp3' />
                  Your browser does not support the audio element.
                </audio>
              </CardBody>
            </Card>
          </Card>
          <ToastContainer />
        </main>
      </div>
    </>
  );
};

export default ThankYou;
