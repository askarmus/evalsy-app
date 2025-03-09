"use client";
import React, { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { ToastContainer } from "react-toastify";
import InterviewNavbar from "./InterviewNavbar";
import CandidateInfo from "./CandidateInfo";

const Welcome: React.FC = () => {
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
        const currentWordIndex = company?.timestamps?.findIndex((wordData, index) => audioTime >= wordData.time && (index === company.timestamps.length - 1 || audioTime < company.timestamps[index + 1].time));

        if (currentWordIndex !== activeWordIndex) {
          setActiveWordIndex(currentWordIndex);
        }
      };
    }
  }, []);

  const handleAudioEnd = () => {
    setTimeout(() => {
      setPhase("in-progress");
    }, 2000); // Ensuring a smooth transition
  };
  return (
    <>
      <InterviewNavbar company={company} />
      <div className='min-h-screen'>
        <main className='max-w-7xl mx-auto px-6 py-8'>
          <Card className='p-8'>
            <CardHeader>
              <CandidateInfo candidate={candidate} company={company} job={job} />
            </CardHeader>
            <Card className='py-4' shadow='sm'>
              <CardBody className='overflow-visible py-2'>
                <div className='p-6   rounded-lg max-w-3xl mx-auto'>
                  <h2 className='text-2xl font-bold mb-4 text-center'>Welcome to the Interview!</h2>
                  <p>{company.aboutCompany}</p>
                  <p className='text-lg leading-relaxed mt-4'>
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
                  <source src={company.aboutCompanyAudioUrl} type='audio/mp3' />
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

export default Welcome;
