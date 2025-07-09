'use client';

import { Alert, Button, Card, CardBody } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';

export default function MediaPermission({ onPermissionChange }: { onPermissionChange?: (status: 'pending' | 'granted' | 'denied' | 'blocked') => void }) {
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied' | 'blocked'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micAudioUrl, setMicAudioUrl] = useState<string | null>(null);
  const [micDeviceLabel, setMicDeviceLabel] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermissions = async () => {
    setErrorMessage(null);
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((d) => d.kind === 'videoinput');
      const hasMic = devices.some((d) => d.kind === 'audioinput');

      if (!hasCamera && !hasMic) {
        throw { name: 'NotFoundError' };
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: hasCamera, audio: hasMic });

      const hasVideo = stream.getVideoTracks().length > 0;
      const hasAudio = stream.getAudioTracks().length > 0;

      if (!hasVideo) {
        setPermissionStatus('blocked');
        setErrorMessage('Camera not detected. Please connect or enable your camera in system settings.');
        return;
      }

      if (!hasAudio) {
        setPermissionStatus('blocked');
        setErrorMessage('Microphone not detected. Please connect or enable your microphone in system settings.');
        return;
      }

      streamRef.current = stream;

      const audioTrack = stream.getAudioTracks()[0];
      const micDevice = devices.find((device) => device.kind === 'audioinput' && device.label === audioTrack?.label);
      if (micDevice) {
        setMicDeviceLabel(micDevice.label);
      }

      setPermissionStatus('granted');
    } catch (err: any) {
      console.warn('Permission error:', err);

      if (err.name === 'NotFoundError') {
        setPermissionStatus('blocked');
        setErrorMessage('No camera or microphone found. Please check if your devices are disconnected or disabled at system level.');
        return;
      }

      if (err.name === 'NotAllowedError') {
        setPermissionStatus('denied');
        setErrorMessage('Access denied. Please allow camera and microphone permissions in your browser settings and reload the page.');
        return;
      }

      setPermissionStatus('denied');
      setErrorMessage('Could not access media devices. Check antivirus, browser privacy settings, or try another browser.');
    }
  };

  const testMic = async () => {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(micStream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setMicAudioUrl(url);
        setIsTestingMic(false);
        setCountdown(null);
        micStream.getTracks().forEach((track) => track.stop());
      };

      setIsTestingMic(true);
      setCountdown(3);
      mediaRecorder.start();

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev && prev > 1) return prev - 1;
          clearInterval(countdownInterval);
          return null;
        });
      }, 1000);

      setTimeout(() => {
        mediaRecorder.stop();
      }, 3000);
    } catch (err) {
      console.error('Mic test error:', err);
      setIsTestingMic(false);
      setCountdown(null);
      setErrorMessage('Microphone test failed. Please ensure your mic is connected and not in use.');
    }
  };

  useEffect(() => {
    requestPermissions();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (micAudioUrl) {
        URL.revokeObjectURL(micAudioUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (permissionStatus === 'granted' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => console.warn('Autoplay failed:', err));
    }
  }, [permissionStatus]);

  useEffect(() => {
    if (micAudioUrl && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Audio auto-play failed:', err);
      });
    }
  }, [micAudioUrl]);

  useEffect(() => {
    if (onPermissionChange) {
      onPermissionChange(permissionStatus);
    }
  }, [permissionStatus, onPermissionChange]);

  return (
    <Card shadow="sm">
      <CardBody>
        <h1 className="text-md font-bold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-1 2H5a2 2 0 01-2-2V8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2z" />
          </svg>
          Media Permissions
        </h1>

        {errorMessage && <Alert color="danger" title={errorMessage} className="mb-4 text-sm" />}

        {permissionStatus === 'granted' && (
          <Card shadow="none">
            <CardBody>
              <Alert
                color="success"
                title={
                  <>
                    ✅ Camera and microphone permissions granted.
                    <br />
                    📷 Camera: <strong>{videoRef.current?.srcObject ? 'Active' : 'Unavailable'}</strong>
                    <br />
                    🎤 Microphone: <strong>{micDeviceLabel || 'Active'}</strong>
                  </>
                }
                className="mb-5"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <Card shadow="sm">
                  <CardBody>
                    <h2 className="text-md font-semibold mb-2">Camera Preview</h2>
                    <video ref={videoRef} className="w-full border rounded shadow" autoPlay playsInline muted style={{ height: 200, backgroundColor: 'black' }} />
                  </CardBody>
                </Card>

                <div className="flex flex-col">
                  <Card shadow="sm" className="mb-4">
                    <CardBody>
                      <Button onPress={testMic} isDisabled={isTestingMic} color="warning">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm-7 9a7 7 0 0014 0M5 10v1a7 7 0 0014 0v-1M12 19v4m-4 0h8" />
                        </svg>
                        {isTestingMic ? `Testing Mic... (${countdown}s)` : 'Test Microphone (3 sec)'}
                      </Button>

                      {micAudioUrl && (
                        <div>
                          <p className="text-sm mb-1 text-gray-700 mt-5">Playback your recorded audio:</p>
                          <audio ref={audioRef} src={micAudioUrl} controls className="w-full" />
                        </div>
                      )}
                    </CardBody>
                  </Card>
                  {micDeviceLabel && (
                    <Alert
                      hideIcon
                      className="mb-4 text-xs"
                      color="default"
                      title={
                        <>
                          Microphone in use: <strong>{micDeviceLabel}</strong>
                        </>
                      }
                    />
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
}
