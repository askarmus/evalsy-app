'use client';

import { Alert, Button, Card, CardBody } from '@heroui/react';
import { Mic, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaCamera, FaCheckCircle, FaMicrophone } from 'react-icons/fa';

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
        {errorMessage && <Alert color="danger" title={errorMessage} className="mb-4 text-sm" />}

        {permissionStatus === 'granted' && (
          <Card shadow="none">
            <CardBody>
              <Alert color="success" title="Camera and microphone permissions granted." hideIcon className="mb-5" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <Card shadow="none">
                  <CardBody>
                    <div className="mb-6 flex items-center gap-[5px] mb-3 md:mb-4 ">
                      <Video className="w-5 h-5 text-xl text-secondary-400" />
                      <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Video Preview</h1>
                    </div>

                    <video ref={videoRef} className="w-full border rounded shadow" autoPlay playsInline muted style={{ height: 200, backgroundColor: 'black' }} />
                  </CardBody>
                </Card>

                <div className="flex flex-col">
                  <Card shadow="none" className="mb-4">
                    <CardBody>
                      <div className="mb-6 flex items-center gap-[5px] mb-3 md:mb-4 ">
                        <Mic className="w-5 h-5 text-xl text-secondary-400" />
                        <h1 className=" text-xl/[24px] font-semibold text-tertiary  md:text-[20px]/[24px]">Microphone</h1>
                      </div>

                      {micDeviceLabel && (
                        <Alert
                          hideIcon
                          className="mb-4 mt-4 text-xs"
                          color="secondary"
                          title={
                            <>
                              Mic in use: <strong>{micDeviceLabel}</strong>
                            </>
                          }
                        />
                      )}
                      <Button onPress={testMic} isDisabled={isTestingMic} color="default">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm-7 9a7 7 0 0014 0M5 10v1a7 7 0 0014 0v-1M12 19v4m-4 0h8" />
                        </svg>
                        {isTestingMic ? `Testing Mic... (${countdown}s)` : 'Test Mic (3 sec)'}
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
      </CardBody>
    </Card>
  );
}
