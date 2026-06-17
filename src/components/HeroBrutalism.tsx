'use client';

import { motion } from 'motion/react';
import { Anton } from 'next/font/google';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
});

interface HeroBrutalismProps {
  mainText?: string;
}

export default function HeroBrutalism({
  mainText = "NIGHT",
}: HeroBrutalismProps) {
  return (
    <section className={`fixed inset-0 w-full h-screen bg-black text-white overflow-hidden flex flex-col justify-end p-4 sm:p-8 ${anton.variable} rounded-none z-0`}>
      {/* Noise Texture Overlay using SVG filter for performance */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Giant Text */}
      {mainText && (
        <div className="z-10 w-full overflow-hidden leading-none flex items-center justify-center lg:justify-start h-full">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            whileHover={{ 
              skewX: -2, 
              color: "#d1d5db", // text-gray-300
              transition: { duration: 0.2 } 
            }}
            className="text-[18vw] font-normal uppercase tracking-tighter leading-[0.8] origin-bottom cursor-pointer select-none text-center lg:text-left w-full break-words"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            {mainText}
          </motion.h1>
        </div>
      )}
    </section>
  );
}
