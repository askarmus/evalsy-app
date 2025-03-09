import React, { useEffect, useRef } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";
import { Card, CardBody, CardFooter, CardHeader, Switch } from "@heroui/react";
import { AiOutlineClose, AiOutlineVideoCamera } from "react-icons/ai";

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
    <Card className='py-4' shadow='sm'>
      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
        <p className='text-tiny uppercase font-bold'>Video</p>
      </CardHeader>
      <CardBody>
        {isCameraOn ? <video ref={videoRef} autoPlay playsInline className='w-full aspect-video bg-black rounded-lg' /> : <img src='https://kohansazandegan.com/Content/img/video-placeholder.png' alt='Camera Off' className='w-full aspect-video bg-black rounded-lg' />}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardBody>
      <CardFooter>
        <Switch isSelected={isCameraOn} color='primary' size='lg' onValueChange={toggleCamera} thumbIcon={({ isSelected }) => (isSelected ? <AiOutlineClose /> : <AiOutlineClose />)} />
      </CardFooter>
    </Card>
  );
};

export default UserCamera;
