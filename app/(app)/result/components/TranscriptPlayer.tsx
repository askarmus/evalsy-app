import { useState, useRef, useEffect } from 'react';

export default function AudioPlayerWithHighlight({ transcript, recordingUrl }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Update active sentence based on currentTime
  useEffect(() => {
    if (!audioRef.current) return;

    const updateActiveSentence = () => {
      const time = audioRef.current?.currentTime || 0;
      const newActiveIndex = transcript.findLastIndex((item) => item.secondsFromStart <= time);

      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex);
        scrollToActiveSentence(newActiveIndex);
      }
    };

    const scrollToActiveSentence = (index: number) => {
      const container = transcriptContainerRef.current;
      const activeElement = document.getElementById(`sentence-${index}`);

      if (!container || !activeElement) return;

      // Calculate positions
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      const containerTop = containerRect.top;
      const elementRelativeTop = elementRect.top - containerTop;

      // Calculate desired scroll position
      const scrollTo = container.scrollTop + elementRelativeTop - container.clientHeight / 2;

      // Smooth scroll within the container only
      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth',
      });
    };

    audioRef.current.addEventListener('timeupdate', updateActiveSentence);
    return () => {
      audioRef.current?.removeEventListener('timeupdate', updateActiveSentence);
    };
  }, [activeIndex, transcript]);

  return (
    <div className="container">
      <div className="audio-player">
        <audio ref={audioRef} src={recordingUrl} controls className="w-full" />
      </div>

      <div className="transcript" ref={transcriptContainerRef}>
        {transcript.map((item, index) => (
          <p
            key={index}
            id={`sentence-${index}`}
            className={`sentence text-xs ${index === activeIndex ? 'active' : ''}`}
            style={{
              color: item.role === 'bot' ? '#333' : '#0066cc',
              margin: '5px 0',
              padding: '4px 6px',
            }}
          >
            {item.message}
          </p>
        ))}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .audio-player {
          margin-bottom: 10px;
        }
        .transcript {
          max-height: 270px;
          overflow-y: auto;
          border: 1px solid #eee;
          padding: 15px;
          border-radius: 8px;
          scroll-behavior: smooth;
        }
        .sentence.active {
          background-color: #fffde7;
          font-weight: 300;
        }
      `}</style>
    </div>
  );
}
