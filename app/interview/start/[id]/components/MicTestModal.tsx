import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { useInterviewStore } from '../stores/useInterviewStore';

interface MicTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MicTestModal: React.FC<MicTestModalProps> = ({ isOpen, onClose }) => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>('');
  const [micRecordingUrl, setMicRecordingUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const { setMicDeviceId } = useInterviewStore();

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const uniqueMics = deduplicateMics(devices);
          setAudioDevices(uniqueMics);
          if (uniqueMics.length) setSelectedMicId(uniqueMics[0].deviceId);
        });
      });
    }
  }, [isOpen]);

  const deduplicateMics = (devices: MediaDeviceInfo[]) => {
    const seen = new Set<string>();
    return devices.filter((d) => {
      if (d.kind !== 'audioinput' || seen.has(d.groupId)) return false;
      seen.add(d.groupId);
      return true;
    });
  };

  const testMic = async () => {
    setIsRecording(true);
    setMicRecordingUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedMicId ? { exact: selectedMicId } : undefined },
      });

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setMicRecordingUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 3000);
    } catch (err) {
      console.error('Mic test failed', err);
      setIsRecording(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
        <h2 className="text-lg font-semibold mb-4">Test Your Microphone</h2>

        <label className="text-sm font-medium block mb-1">Select Microphone</label>
        <select
          className="w-full p-2 border rounded-md mb-4"
          value={selectedMicId}
          onChange={(e) => {
            setSelectedMicId(e.target.value);
            setMicDeviceId(e.target.value);
          }}
        >
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || 'Unnamed Microphone'}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-4 mb-3">
          <Button onPress={testMic} isLoading={isRecording} color="warning" size="sm">
            {isRecording ? 'Speak now...' : 'Test Mic'}
          </Button>

          {micRecordingUrl && <span className="text-green-600 text-sm">Recorded!</span>}
        </div>

        {micRecordingUrl && (
          <div className="mb-4">
            <audio controls src={micRecordingUrl} className="w-full" />
          </div>
        )}

        <div className="flex justify-end">
          <Button onPress={onClose} size="sm" variant="ghost">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MicTestModal;
