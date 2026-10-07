'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    id: 'full-body',
    image: '/images/wristband/rifelo-full-body.webp',
    pngFallback: '/images/wristband/rifelo-full-body.png',
    alt: 'Rifelo NFC Wristband - Full Body Matte Finish Hardware',
    label: '01 / Full Silhouette',
    title: 'Engineered Precision',
    description: 'Minimal matte hardware crafted for seamless daily wear and instant dynamic profile sharing.',
    highlight: 'Universal Hardware'
  },
  {
    id: 'surface',
    image: '/images/wristband/rifelo-surface.webp',
    pngFallback: '/images/wristband/rifelo-surface.png',
    alt: 'Rifelo NFC Wristband - High Precision NFC Surface and Microchip',
    label: '02 / Contact Surface',
    title: 'Passive NFC Chipset',
    description: 'Zero batteries. Zero charging. Always-on contactless data transmission at any angle.',
    highlight: 'No Charging Required'
  },
  {
    id: 'adjustable',
    image: '/images/wristband/rifelo-adjustable.webp',
    pngFallback: '/images/wristband/rifelo-adjustable.png',
    alt: 'Rifelo NFC Wristband - Adjustable Waterproof Ergonomic Strap',
    label: '03 / Ergonomic Strap',
    title: 'Waterproof Comfort',
    description: 'Hypoallergenic waterproof silicone strap designed to adjust securely to any wrist size.',
    highlight: '100% Waterproof'
  }
];

export default function NfcWristbandPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance carousel when not hovering/dragging
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  // Deliberate, physical hardware motion curves (as mandated by Rifelo Design System)
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // Slow, heavy, deliberate ease
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className="min-h-screen bg-[#EAE6CB] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-[#EAE6CB] flex flex-col relative overflow-x-hidden font-sans">
      
      {/* Hidden browser preloader for instant zero-latency slide switching */}
      <div className="hidden" aria-hidden="true">
        {SLIDES.map((slide) => (
          <Image
            key={slide.id}
            src={slide.image}
            alt="preloader"
            width={10}
            height={10}
            priority
          />
        ))}
      </div>

      {/* Header / Brand Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 sm:px-8 pt-8 pb-4 flex items-center justify-between z-30">
        <Link 
          href="/" 
          className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#1A1A1A] hover:opacity-80 transition-opacity"
        >
          Rifelo<span className="text-[#9E7D2B]">.</span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/profile"
            className="text-xs sm:text-sm font-semibold text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="https://wa.me/6281234567890"
            target="_blank"
            className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1A1A1A] text-[#EAE6CB] text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#2b2b2b] active:scale-95 transition-all"
          >
            Pre-Order
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-5xl mx-auto px-6 sm:px-8 py-8 sm:py-14 flex-1 flex flex-col items-center justify-center text-center z-10">
        
        {/* Headline & Body Typography (Standardized with Blueprint) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-4 sm:space-y-5 mb-6 sm:mb-10 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1A1A1A] leading-[1.08]">
            Physical Meets Digital.
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-[#1A1A1A]/70 max-w-2xl mx-auto leading-relaxed font-normal">
            The next-generation NFC wearable designed for instant contact exchange, dynamic profile sharing, and effortless physical interactions.
          </p>
        </motion.div>

        {/* Carousel Showcase Container */}
        <div 
          className="relative w-full max-w-sm sm:max-w-lg md:max-w-xl aspect-[4/3] sm:aspect-[16/11] my-4 sm:my-6 flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Backglow to enhance depth */}
          <div className="absolute inset-0 bg-[#1A1A1A]/5 rounded-3xl blur-2xl transform scale-90 pointer-events-none" />

          {/* Active Image Slider */}
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
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) {
                  nextSlide();
                } else if (info.offset.x > 40) {
                  prevSlide();
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              <div className="w-full h-full relative">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.alt}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 512px, 576px"
                  className="object-contain drop-shadow-[0_25px_40px_rgba(26,26,26,0.18)] pointer-events-none select-none transition-transform duration-700"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop Chevron Controls */}
          <button
            onClick={prevSlide}
            aria-label="Previous view"
            className="hidden sm:flex absolute -left-12 lg:-left-14 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/70 hover:bg-white text-[#1A1A1A] border border-[#1A1A1A]/10 items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next view"
            className="hidden sm:flex absolute -right-12 lg:-right-14 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-white/70 hover:bg-white text-[#1A1A1A] border border-[#1A1A1A]/10 items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Spec & Microcopy beneath Carousel */}
        <div className="min-h-[56px] mt-2 sm:mt-4 flex flex-col items-center justify-center max-w-md px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="space-y-1"
            >
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/65 leading-relaxed max-w-sm sm:max-w-md mx-auto">
                {currentSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Indicators / Navigation Dots */}
        <div className="flex items-center gap-2.5 mt-5 mb-8 z-20">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentIndex 
                  ? 'w-8 bg-[#1A1A1A]' 
                  : 'w-2 bg-[#1A1A1A]/20 hover:bg-[#1A1A1A]/40'
              }`}
              aria-label={`View slide ${idx + 1}: ${slide.title}`}
            />
          ))}
        </div>

        {/* Primary Call to Action with Parallel Sizing */}
        <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
          <Link
            href="https://wa.me/6281234567890"
            target="_blank"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#1A1A1A] text-[#EAE6CB] text-xs sm:text-sm font-semibold uppercase tracking-wider active:scale-95 transition-all duration-200 rounded-full shadow-[0_4px_20px_rgba(26,26,26,0.18)] hover:bg-[#2b2b2b]"
          >
            <span>Pre-Order Wristband</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40 hover:bg-[#1A1A1A]/5 rounded-full active:scale-95 transition-all duration-200"
          >
            Explore Ecosystem
          </Link>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-[#1A1A1A]/60 border-t border-[#1A1A1A]/10 gap-2 sm:gap-0 text-center sm:text-left">
        <p>&copy; {new Date().getFullYear()} Rifelo. All physical rights reserved.</p>
        <p className="font-medium">Physical Hardware Meets Dynamic Profile</p>
      </footer>

    </div>
  );
}
