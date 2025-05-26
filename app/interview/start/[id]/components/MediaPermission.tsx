'use client';

import { Alert, Button, Card, CardBody } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';

export default function MediaPermission({ onPermissionChange }: { onPermissionChange?: (status: 'pending' | 'granted' | 'denied' | 'blocked') => void }) {
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied' | 'blocked'>('pending');
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micAudioUrl, setMicAudioUrl] = useState<string | null>(null);
  const [micDeviceLabel, setMicDeviceLabel] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setPermissionStatus('granted');

      const audioTrack = stream.getAudioTracks()[0];
      const devices = await navigator.mediaDevices.enumerateDevices();
      const micDevice = devices.find((device) => device.kind === 'audioinput' && device.label === audioTrack.label);
      if (micDevice) {
        setMicDeviceLabel(micDevice.label);
      }
    } catch (err) {
      console.warn('Permission error:', err);

      navigator.permissions?.query({ name: 'camera' as PermissionName }).then((cameraStatus) => {
        navigator.permissions?.query({ name: 'microphone' as PermissionName }).then((micStatus) => {
          if (cameraStatus.state === 'denied' || micStatus.state === 'denied') {
            setPermissionStatus('blocked');
          } else {
            setPermissionStatus('denied');
          }
        });
      });
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
      setCountdown(5);
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
      }, 5000);
    } catch (err) {
      console.error('Mic test error:', err);
      setIsTestingMic(false);
      setCountdown(null);
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
      videoRef.current.play().catch((err) => console.warn('Autoplay failed:', err));
    }
  }, [permissionStatus]);

  useEffect(() => {
    if (micAudioUrl && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn('Auto-play failed:', err);
      });
    }
  }, [micAudioUrl]);

  useEffect(() => {
    if (onPermissionChange) {
      onPermissionChange(permissionStatus);
    }
  }, [permissionStatus, onPermissionChange]);
  return (
    <div className="p-0 max-w-4xl mx-auto">
      <h1 className="text-md font-bold mb-4 flex items-center gap-2">
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-1 2H5a2 2 0 01-2-2V8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2z" />
        </svg>
        Media Permissions
      </h1>

      {permissionStatus === 'blocked' && <Alert color="danger" title={`Camera or microphone is blocked in your browser settings. \nPlease click the lock icon in your browser's address bar and allow camera/microphone access manually, then reload the page.`} />}

      {permissionStatus === 'granted' && (
        <Card shadow="none">
          <CardBody>
            <Alert color="success" title="Permission granted successfull." className="mb-5"></Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <Card shadow="sm">
                <CardBody>
                  <h2 className="text-md font-semibold mb-2">Camera Preview</h2>
                  <video ref={videoRef} className="w-full border rounded shadow" autoPlay playsInline muted style={{ height: 200, backgroundColor: 'black' }} />
                </CardBody>
              </Card>

              <div className="flex flex-col">
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

                <Card shadow="sm">
                  <CardBody>
                    <Button onPress={testMic} isDisabled={isTestingMic} color="warning">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm-7 9a7 7 0 0014 0M5 10v1a7 7 0 0014 0v-1M12 19v4m-4 0h8" />
                      </svg>
                      {isTestingMic ? `Testing Mic... (${countdown}s)` : 'Test Microphone (5 sec)'}
                    </Button>

                    {micAudioUrl && (
                      <div>
                        <p className="text-sm mb-1 text-gray-700 mt-5">Playback your recorded audio:</p>
                        <audio ref={audioRef} src={micAudioUrl} controls className="w-full" />
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
