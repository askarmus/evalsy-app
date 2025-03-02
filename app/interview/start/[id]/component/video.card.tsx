"use client";

import { useState, useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { updateScreeshot } from "@/services/interview.service";
import { upload } from "@/services/company.service";
import { Card, CardBody, CardHeader } from "@heroui/react";

interface VideoRecorderProps {
  invitationId: string;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ invitationId }) => {
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { startRecording, stopRecording, mediaBlobUrl, previewStream } = useReactMediaRecorder({
    video: true,
    onStop: () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.srcObject = null;
        videoRef.current.src = mediaBlobUrl || "";
      }
    },
  });

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    startRecording(); // Start recording automatically on page load

    const interval = setInterval(() => {
      captureScreenshot();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      clearInterval(interval);
      stopRecording(); // Stop recording when component unmounts
    };
  }, []);

  const captureScreenshot = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `screenshot-${Date.now()}.png`, { type: "image/png" });
      const response = await upload(file);
      setScreenshotUrls((prev) => [...prev, response.url]);

      // Send screenshot URL to backend
      await updateScreeshot({
        invitationId,
        fileName: response.data.url,
      });
    }, "image/png");
  };

  return (
    <Card className='py-4' shadow='sm'>
      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
        <p className='text-tiny uppercase font-bold'>Video</p>
      </CardHeader>
      <CardBody>
        <video ref={videoRef} autoPlay className='w-full aspect-video bg-black rounded-lg' />
      </CardBody>
    </Card>
  );
};

export default VideoRecorder;
