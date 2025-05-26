import React, { useEffect, useRef } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import { FaVideoSlash } from 'react-icons/fa';

type UserCameraProps = {
  hideRecLabel: boolean;
  invitationId: string;
  enableCapture?: boolean;
  isCameraOn: boolean; // Controlled from parent
};

const UserCamera: React.FC<UserCameraProps> = ({ hideRecLabel = false, invitationId, enableCapture = true, isCameraOn }) => {
  const { uploadScreenshot, screenshotInterval } = useInterviewStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        console.error('❌ Error accessing camera:', error);
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
    if (!enableCapture || !isCameraOn) return;

    const takeScreenshot = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) uploadScreenshot(blob, invitationId);
        }, 'image/png');
      }
    };

    const interval = setInterval(takeScreenshot, screenshotInterval);
    return () => clearInterval(interval);
  }, [screenshotInterval, enableCapture, isCameraOn]);

  return (
    <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {isCameraOn ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center">
              <div className="relative w-28 h-28 rounded-full bg-gray-800 shadow-xl flex items-center justify-center z-10">
                <FaVideoSlash className="w-12 h-12 text-gray-400" />
              </div>
              <p className="mt-5 text-center text-sm text-gray-300 font-medium">Video Off</p>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!hideRecLabel && enableCapture && isCameraOn && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
          REC
        </div>
      )}
    </div>
  );
};

export default UserCamera;
