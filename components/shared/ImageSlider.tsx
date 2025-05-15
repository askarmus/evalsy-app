'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

type ImageSliderProps = {
  images?: string[] | null;
  autoSlide?: boolean;
  interval?: number;
};

const fallbackImage = '/No_Image_Available.jpg';

export default function ImageSlider({ images, autoSlide = true, interval = 3000 }: ImageSliderProps) {
  // Filter out invalid/empty image URLs
  const validImages = Array.isArray(images) ? images.filter((src): src is string => typeof src === 'string' && src.trim() !== '') : [];

  const imagesToUse = validImages.length > 0 ? validImages : [fallbackImage];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const hasMultiple = imagesToUse.length > 1;

  useEffect(() => {
    if (!autoSlide || !hasMultiple) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev === imagesToUse.length - 1 ? 0 : prev + 1));
      setDirection(1);
    }, interval);

    return () => clearInterval(timer);
  }, [autoSlide, interval, hasMultiple, imagesToUse.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === imagesToUse.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? imagesToUse.length - 1 : prev - 1));
  };

  // Ensure we never pass an empty src to <Image />
  const safeCurrent = Math.min(current, imagesToUse.length - 1);
  const currentImage = imagesToUse[safeCurrent] || fallbackImage;
  const isFallback = currentImage === fallbackImage;

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden bg-slate-100 rounded-xl border h-60">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={safeCurrent} initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }} transition={{ duration: 0.4 }} className="absolute inset-0">
          <Image src={currentImage} alt="Candidate photo" fill className="object-cover" sizes="100vw" priority={!isFallback} />
        </motion.div>
      </AnimatePresence>

      {hasMultiple && (
        <>
          <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition z-10">
            <FaArrowLeft size={8} />
          </button>

          <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white transition z-10">
            <FaArrowRight size={8} />
          </button>
        </>
      )}
    </div>
  );
}
