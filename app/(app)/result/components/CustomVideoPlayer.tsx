import React, { useRef, useState, useEffect } from "react";

const CustomVideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const updateProgress = () => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    const duration = video.duration;
    const percent = (current / duration) * 100;
    setProgress(percent);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener("timeupdate", updateProgress);
    return () => {
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  return (
    <div className='flex flex-col space-y-4 items-start'>
      {/* ✅ Visible Video */}
      <video ref={videoRef} className='w-full max-w-md rounded-lg shadow' src='https://interviewer-ai-videos.s3-accelerate.amazonaws.com/sample_candidate_video/austin_00%40domain.tld/e39bd8e8-96e4-49de-a4ff-d474476f432f.mp4?AWSAccessKeyId=AKIAIXAEKUJAAA3N7HDQ&Expires=1746348875&Signature=TvN9kdVpEwr40zzYHiFqAqLcUZk%3D' crossOrigin='anonymous' playsInline />

      {/* Custom Controls */}
      <div className='flex items-center space-x-4'>
        <button onClick={togglePlay} className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-md'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-white' viewBox='0 0 24 24' fill='currentColor'>
            {isPlaying ? <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' /> : <path d='M8 5v14l11-7z' />}
          </svg>
        </button>

        <div className='w-40 h-2 bg-gray-200 rounded flex'>
          <div className='bg-orange-500 h-full rounded-l' style={{ width: `${progress}%` }} />
          <div className='bg-gray-300 h-full rounded-r' style={{ width: `${100 - progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
