import React, { useEffect, useRef } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import { Card, CardBody, CardFooter, CardHeader, Switch } from "@heroui/react";
import { FaReply } from "react-icons/fa";

const UserCamera: React.FC = () => {
  const { isCameraOn, toggleCamera, uploadScreenshot, screenshotInterval } = useInterviewStore();
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
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <div className='h-3 w-3 rounded-full bg-red-500 animate-pulse'></div>
          <h3 className='font-medium text-sm'> RECORDING </h3>
        </div>
      </div>
      <div className='relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-200 shadow-lg'>
        <video ref={videoRef} autoPlay playsInline className='absolute inset-0 w-full h-full object-cover' />

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <div className='absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1'>
          <span className='h-2 w-2 rounded-full bg-white animate-pulse text-xs'></span>
          REC
        </div>
      </div>
    </>
  );
};

export default UserCamera;
