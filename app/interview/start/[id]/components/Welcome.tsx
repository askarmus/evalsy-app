'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import { Card, CardBody, CardHeader } from '@heroui/react';
import InterviewNavbar from './InterviewNavbar';
import CandidateInfo from './CandidateInfo';
import PoweredBy from './PoweredBy';

const Welcome: React.FC = () => {
  const { setPhase, candidate, company, job } = useInterviewStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.error('Audio play failed:', error));

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
      setPhase('in-progress');
    }, 2000);
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-screen-lg mx-auto px-6 py-8">
          <InterviewNavbar company={company} />

          <Card shadow="md" radius="md" className="p-6 mt-6">
            <CardHeader>
              <CandidateInfo candidate={candidate} company={company} job={job} addTopPadding={false} />
            </CardHeader>
            <Card className="py-4" shadow="none" radius="none">
              <CardBody className="overflow-visible py-2">
                <div className="p-6   rounded-lg max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold mb-4 text-center">Welcome to the Interview!</h2>
                  <p className="text-md leading-relaxed mt-4">{company.aboutCompany}</p>
                </div>
                <audio ref={audioRef} onEnded={handleAudioEnd}>
                  <source src={company.aboutCompanyAudioUrl} type="audio/wav" />
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

export default Welcome;
