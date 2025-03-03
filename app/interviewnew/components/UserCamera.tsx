import React, { useEffect, useRef } from "react";
import { useInterviewStore } from "../stores/useInterviewStore";

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
    <div style={{ width: "100%", maxWidth: "400px", position: "relative", textAlign: "center" }}>
      <h3>User Camera</h3>

      {isCameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      ) : (
        <img
          src='https://kohansazandegan.com/Content/img/video-placeholder.png' // ✅ Replace with actual placeholder image
          alt='Camera Off'
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "10px",
            backgroundColor: "#eee",
          }}
        />
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button onClick={toggleCamera} style={{ marginTop: "10px" }}>
        {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
      </button>
    </div>
  );
};

export default UserCamera;
