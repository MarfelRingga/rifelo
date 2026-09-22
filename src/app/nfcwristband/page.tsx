'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const IMAGES = [
  "https://i.ibb.co.com/j9NqDvHM/rifelo-full-body.png",
  "https://i.ibb.co.com/p6d0rswp/rifelo-surface.png",
  "https://i.ibb.co.com/SX27Bqvj/rifelo-adjustable.png"
];

export default function NfcWristbandPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.94,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1] as const,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[#EAE6CB] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#EAE6CB] flex flex-col items-center justify-center relative overflow-x-hidden font-sans select-none">
      
      {/* Minimal Top Logo */}
      <div className="absolute top-8 left-0 w-full flex justify-center z-50">
        <Link href="/" className="text-xs font-bold tracking-[0.2em] uppercase text-[#1A1A1A] hover:scale-105 transition-transform">
          Rifelo<span className="text-[#9E7D2B]">.</span>
        </Link>
      </div>
      
      {/* Main Hero Container */}
      <main className="w-full max-w-5xl px-6 py-20 sm:py-28 flex flex-col items-center text-center z-10 flex-1 justify-center">
        
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="space-y-4 mb-8 sm:mb-12"
        >
          <motion.p 
            whileHover={{ scale: 1.05 }}
            className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#9E7D2B] bg-[#1A1A1A]/5 px-4 py-1.5 rounded-full"
          >
            Tap. Wear. Share.
          </motion.p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#1A1A1A] leading-tight">
            The Future of <br className="hidden sm:block" /> Physical Networking.
          </h1>
        </motion.div>
        
        {/* Image Carousel with Playful Spring Physics & Interactive Floating */}
        <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/11] mb-14 flex items-center justify-center">
          
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) {
                  nextSlide();
                } else if (info.offset.x > 40) {
                  prevSlide();
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              <div className="w-full h-full relative">
                <Image
                  src={IMAGES[currentIndex]}
                  alt={`Rifelo NFC Wristband Showcase ${currentIndex + 1}`}
                  fill
                  className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)] pointer-events-none"
                  referrerPolicy="no-referrer"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Playful Interactive Dots */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {IMAGES.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.8 }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-9 bg-[#1A1A1A]' 
                    : 'w-2.5 bg-[#1A1A1A]/20 hover:bg-[#1A1A1A]/50'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="https://wa.me/6281234567890"
            target="_blank"
            className="inline-flex items-center justify-center px-12 py-4 sm:py-5 bg-[#1A1A1A] text-[#EAE6CB] text-xs font-bold uppercase tracking-widest active:scale-95 transition-all duration-200 rounded-full shadow-[0_4px_20px_rgba(26,26,26,0.12)] hover:bg-[#2e2e2e]"
          >
            Pre-Order Now
          </Link>
        </motion.div>
        
      </main>
      
    </div>
  );
}
