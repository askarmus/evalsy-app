import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface ReactiveMicVisualizerProps {
  stream: MediaStream;
}

const ReactiveMicVisualizer: React.FC<ReactiveMicVisualizerProps> = ({ stream }) => {
  const volume = useMotionValue(0);
  const scale = useTransform(volume, [0, 1], [1, 1.3]);
  const glowRadius = useTransform(volume, [0, 1], [3, 16]);
  const glowShadow = useTransform(glowRadius, (r) => `0 0 ${r}px #3b82f6`);

  const rafRef = useRef<number | null>(null);
  const [ripples, setRipples] = useState<string[]>([]); // use string IDs

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.fftSize);

    const getVolume = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] - 128;
        sum += v * v;
      }

      const rms = Math.sqrt(sum / dataArray.length);
      const normalized = Math.min(rms / 50, 1);
      volume.set(normalized);

      if (normalized > 0.2) {
        setRipples((prev) => [...prev, crypto.randomUUID()]); // ✅ use unique key
      }

      rafRef.current = requestAnimationFrame(getVolume);
    };

    getVolume();

    return () => {
      cancelAnimationFrame(rafRef.current!);
      audioContext.close();
    };
  }, [stream, volume]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRipples((prev) => prev.slice(-10)); // keep only last 10 ripples
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* Voice-triggered ripple waves */}
      {ripples.map((id) => (
        <motion.div key={id} className="absolute w-full h-full rounded-full border border-blue-400" initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
      ))}

      {/* Center glowing pulse */}
      <motion.div
        className="rounded-full"
        style={{
          width: 12,
          height: 12,
          backgroundColor: '#3b82f6',
          scale,
          boxShadow: glowShadow,
        }}
      />
    </div>
  );
};

export default ReactiveMicVisualizer;
