import React, { useRef, useEffect, useState } from 'react';

interface TranscriptItem {
  secondsFromStart: number;
  message: string;
  role: 'user' | 'bot';
}

interface CustomVideoPlayerProps {
  playTrigger: boolean;
  stopTrigger: boolean;
  transcript: TranscriptItem[];
  videoUrl: string;
  images?: string[] | null;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ playTrigger, stopTrigger, transcript, videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filteredTranscript = transcript?.slice(1) || [];

  // Handle play/pause
  useEffect(() => {
    if (playTrigger && videoRef.current) {
      videoRef.current.play();
    }
  }, [playTrigger]);

  useEffect(() => {
    if (stopTrigger && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [stopTrigger]);

  // Highlighting logic
  useEffect(() => {
    if (!videoRef.current) return;

    const updateActiveSentence = () => {
      const time = videoRef.current?.currentTime || 0;
      let newActiveIndex = -1;
      for (let i = filteredTranscript.length - 1; i >= 0; i--) {
        if (filteredTranscript[i].secondsFromStart <= time) {
          newActiveIndex = i;
          break;
        }
      }
      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex);
        scrollToActiveSentence(newActiveIndex);
      }
    };

    const scrollToActiveSentence = (index: number) => {
      const container = transcriptContainerRef.current;
      const activeElement = document.getElementById(`sentence-${index}`);
      if (!container || !activeElement) return;

      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const scrollTo = container.scrollTop + (elementRect.top - containerRect.top) - container.clientHeight / 2;

      container.scrollTo({ top: scrollTo, behavior: 'smooth' });
    };

    videoRef.current.addEventListener('timeupdate', updateActiveSentence);
    return () => {
      videoRef.current?.removeEventListener('timeupdate', updateActiveSentence);
    };
  }, [activeIndex, filteredTranscript]);

  return (
    <div className="max-w-5xl mx-auto  ">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Video Section */}

        <div className="flex-1 rounded-lg shadow overflow-hidden" style={{ height: '330px' }}>
          <video ref={videoRef} src={videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
        </div>

        {/* Transcript Section */}
        <div className="flex-1">
          <div
            className="transcript"
            ref={transcriptContainerRef}
            style={{
              maxHeight: '330px',
              overflowY: 'auto',
              border: '1px solid #eee',
              padding: '15px',
              borderRadius: '8px',
              scrollBehavior: 'smooth',
            }}
          >
            {filteredTranscript.map((item, index) => (
              <p key={index} id={`sentence-${index}`} className={`text-xs mb-1 p-1 ${index === activeIndex ? 'bg-yellow-100 font-medium' : ''}`} style={{ color: item.role === 'bot' ? '#333' : '#0066cc' }}>
                {item.message}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
