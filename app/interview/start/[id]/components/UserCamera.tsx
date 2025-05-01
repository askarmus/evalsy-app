import React, { useEffect, useRef } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";

const UserCamera: React.FC<{ height?: string; hideRecLabel: boolean }> = ({ height, hideRecLabel = false }) => {
  const { isCameraOn, uploadScreenshot, screenshotInterval } = useInterviewStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const interviewId = "12345"; // Replace with actual interview ID

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (!isCameraOn || !videoRef.current) return;

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("❌ Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    const takeScreenshot = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) uploadScreenshot(blob, interviewId);
        }, "image/png");
      }
    };

    const interval = setInterval(takeScreenshot, screenshotInterval);
    return () => clearInterval(interval);
  }, [screenshotInterval]);

  return (
    <>
      <div className={`relative w-auto overflow-hidden ${height ? "" : "aspect-video"}`} style={{ height: height || undefined }}>
        <video ref={videoRef} autoPlay playsInline className='w-full h-full object-cover' />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {!hideRecLabel && (
          <div className='absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
            <span className='h-1 w-1 rounded-full bg-white animate-pulse'></span>
            REC
          </div>
        )}
      </div>
    </>
  );
};

export default UserCamera;
