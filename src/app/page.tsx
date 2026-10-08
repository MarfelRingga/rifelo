'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useMotionValue, useAnimation, animate, useAnimationFrame } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Database, 
  Cpu, 
  Sparkles,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Briefcase,
  Mail,
  Send,
  Clock,
  CheckCheck,
  ExternalLink,
  ChevronDown,
  Trash2,
  Phone,
  Globe,
  MessageCircle,
  Twitter,
  ListOrdered,
  BarChart3,
  Users,
  User,
  Instagram,
  Linkedin,
  Github,
  AtSign,
  Music,
  Link as LinkIcon,
  RefreshCw
} from 'lucide-react';

import { decodeMessageSettings } from '@/lib/messageSettings';
import { getPlatformInfo } from '@/lib/platforms';
import PublicProfileView from '@/components/profile/PublicProfileView';

const DEFAULT_MARFEL_PROFILE = {
  id: "0b6ff8f5-f571-4e32-9119-89b9e81cbdde",
  username: "marfel",
  fullName: "Marfel RP",
  bio: "Trust yourself",
  company: "Rifelo",
  email: "marfelringga@gmail.com",
  phone: "628159999410",
  website: "",
  jobTitle: "Founder",
  links: [
    {
      id: "4021c1bc-262c-444d-9a71-8cbf8726adba",
      url: "rifelo.id",
      title: "Instagram",
      is_visible: true,
      sort_order: 1
    },
    {
      id: "8f314800-d9f0-41c3-ad4a-00465a756cc6",
      url: "https://rifelo.id",
      title: "Website",
      is_visible: true,
      sort_order: 3
    }
  ],
  isPublic: true,
  allowMessages: true,
  messagePlaceholderName: "Name / Company",
  messagePlaceholderContent: "Tell me about your project or idea...",
  profileMode: "professional",
  themePreset: "glassmorphism",
  customTheme: {
    accent: {
      name: "Emerald Forest",
      value: "#059669"
    },
    fontFamily: "var(--font-heading), system-ui, serif",
    borderRadius: "rounded"
  },
  isEmbeddedPreview: true
};

const CircleNameDisplay = ({ name, isVisible }: { name: string; isVisible: boolean }) => {
  const lines = (name || 'Untitled').split('\n').slice(0, 3);
  const maxLineLength = Math.max(...lines.map(l => l.length));
  let textSizeClass = 'text-lg';
  if (maxLineLength > 8 || lines.length > 1) textSizeClass = 'text-base';
  if (maxLineLength > 12 || lines.length === 3) textSizeClass = 'text-sm';
  if (maxLineLength > 18) textSizeClass = 'text-xs';

  return (
    <div className={`font-black ${textSizeClass} tracking-widest text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] relative z-20 transition-opacity duration-[2000ms] px-2 text-center flex flex-col items-center justify-center leading-tight w-full h-full ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {lines.map((line, idx) => (
        <span key={idx} className="block w-full break-words">
          {line}
        </span>
      ))}
    </div>
  );
};

function PrivacyControlMockup() {
  const [isInstagramHidden, setIsInstagramHidden] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    const cycle = () => {
      t1 = setTimeout(() => {
        setIsToggling(true);
        t2 = setTimeout(() => {
          setIsInstagramHidden(prev => !prev);
          setIsToggling(false);
        }, 250);
      }, 2400);
    };

    cycle();
    const interval = setInterval(cycle, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full max-w-[230px] mx-auto flex flex-col gap-2.5 select-none text-left">
      {/* 1. Instagram Link Item (from /profile) */}
      <motion.div
        animate={{
          opacity: isInstagramHidden ? 0.6 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-2xl border transition-all ${
          isInstagramHidden
            ? 'bg-slate-50/70 border-slate-200/60'
            : 'bg-white border-slate-200/90 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200/70 flex items-center justify-center shrink-0 shadow-2xs">
            <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
          </div>
          <div className="flex-1 truncate">
            <p className="text-xs sm:text-[13px] font-semibold text-slate-900 truncate leading-tight">
              Instagram
            </p>
            <p className="text-[9.5px] sm:text-[10px] text-slate-400 truncate leading-tight mt-0.5">
              rifelo.id
            </p>
          </div>
        </div>

        {/* Action controls directly matching /profile */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <motion.div
            animate={isToggling ? { scale: 0.8 } : { scale: 1 }}
            transition={{ duration: 0.15 }}
            className={`p-1.5 rounded-md transition-colors ${
              isInstagramHidden
                ? 'text-slate-400 bg-slate-100'
                : 'text-slate-900 bg-slate-100 border border-slate-200/60'
            }`}
          >
            {isInstagramHidden ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </motion.div>
          <div className="p-1.5 text-slate-400 rounded-md">
            <Trash2 className="w-3.5 h-3.5" />
          </div>
          <div className="p-1.5 text-slate-400 rounded-md">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>

      {/* 2. Whatsapp Link Item (from /profile with 62xxxxxxxxxx) */}
      <div className="flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white border border-slate-200/70 flex items-center justify-center shrink-0 shadow-2xs">
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800" />
          </div>
          <div className="flex-1 truncate">
            <p className="text-xs sm:text-[13px] font-semibold text-slate-900 truncate leading-tight">
              Whatsapp
            </p>
            <p className="text-[9.5px] sm:text-[10px] text-slate-400 truncate leading-tight mt-0.5 font-mono">
              62xxxxxxxxxx
            </p>
          </div>
        </div>

        {/* Action controls directly matching /profile */}
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <div className="p-1.5 text-slate-900 bg-slate-100 border border-slate-200/60 rounded-md">
            <Eye className="w-3.5 h-3.5" />
          </div>
          <div className="p-1.5 text-slate-400 rounded-md">
            <Trash2 className="w-3.5 h-3.5" />
          </div>
          <div className="p-1.5 text-slate-400 rounded-md">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DirectInboxMockup() {
  const [viewState, setViewState] = useState<'send' | 'received'>('send');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;

    const run = () => {
      setViewState('send');
      setIsSending(false);

      // Trigger button press at 2.6s
      t1 = setTimeout(() => {
        setIsSending(true);

        // Switch to received view at 3.2s
        t2 = setTimeout(() => {
          setViewState('received');
          setIsSending(false);
        }, 600);
      }, 2600);
    };

    run();
    const interval = setInterval(run, 7200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none p-1 sm:p-2">
      <AnimatePresence mode="wait">
        {viewState === 'send' ? (
          <motion.div
            key="send"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-[220px] bg-white rounded-2xl p-3 sm:p-3.5 shadow-sm border border-slate-100 flex flex-col gap-1.5 text-left"
          >
            {/* Header directly from /u/username MessageForm */}
            <div className="mb-0.5">
              <h4 className="text-[11.5px] sm:text-xs font-bold tracking-tight text-slate-900 leading-none">
                Leave a Message
              </h4>
              <p className="text-[8px] sm:text-[8.5px] text-slate-500 font-medium mt-1 leading-tight">
                Send a secret message or say hello.
              </p>
            </div>

            {/* Name Input directly from /u/username */}
            <div className="w-full px-2.5 py-1.5 border border-slate-200/90 rounded-xl bg-white text-[8px] sm:text-[8.5px] text-slate-400 font-medium">
              Your Name (Optional)
            </div>

            {/* Message Textarea directly from /u/username with exact requested input text */}
            <div className="w-full px-2.5 py-1.5 border border-slate-200/90 rounded-xl bg-white text-[8px] sm:text-[8.5px] text-slate-800 font-medium leading-relaxed min-h-[46px]">
              Hi, I'm the one who just talked to you on the bus, nice portfolio btw!
            </div>

            {/* Send Button styled with minimalist monochrome */}
            <motion.div
              animate={isSending ? { scale: 0.95, opacity: 0.9 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center justify-center px-3 py-1.5 sm:py-2 text-[9px] sm:text-[9.5px] font-bold rounded-xl shadow-2xs cursor-pointer select-none bg-[#1A1A1A] hover:bg-black text-white"
            >
              <Send className="w-3 h-3 mr-1.5 text-white" />
              {isSending ? 'Sending...' : 'Send Message'}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="received"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-[220px] bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-3.5 flex flex-col justify-between text-left"
          >
            {/* Top row directly from /inbox: Avatar A + Name A + Timestamp */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200/70 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0 select-none">
                A
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 text-xs leading-none">
                  A
                </div>
                <div className="flex items-center text-[8.5px] font-medium text-slate-400 mt-0.5">
                  <Clock className="w-2.5 h-2.5 mr-1 shrink-0 opacity-70 text-slate-400" />
                  <span className="tabular-nums">28/09/26 • 15:39</span>
                </div>
              </div>
            </div>

            {/* Message Body Box directly from /inbox with exact requested text */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/70 text-slate-800 text-[8.5px] sm:text-[9px] leading-relaxed break-words">
              Hi, I'm the one who just talked to you on the bus, nice portfolio btw!
            </div>

            {/* Card Bottom: Read status directly from /inbox */}
            <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-end text-[8.5px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Read</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CircleResonanceMockup() {
  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center select-none overflow-hidden p-6">
      {/* Deep Ambient Monochrome Glow behind the central circle */}
      <div 
        className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full pointer-events-none transition-transform duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 75%)',
          filter: 'blur(22px)',
        }}
      />
      
      {/* Pulsing Aura Wave */}
      <motion.div 
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute w-36 h-36 sm:w-42 sm:h-42 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 45%, transparent 70%)',
          filter: 'blur(14px)',
        }}
      />

      {/* Orbit Stage */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
        {/* 4 Neutral Silver Auras revolving smoothly around the circle */}
        <div className="absolute inset-0 animate-[spin_24s_linear_infinite]">
          {/* Aura 1: Top (0°) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-5 h-5 rounded-full bg-white/20 blur-sm animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-white/80" />
            </div>
          </div>

          {/* Aura 2: Right (90°) */}
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-5 h-5 rounded-full bg-white/20 blur-sm animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-white/80" />
            </div>
          </div>

          {/* Aura 3: Bottom (180°) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-5 h-5 rounded-full bg-white/20 blur-sm animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-white/80" />
            </div>
          </div>

          {/* Aura 4: Left (270°) */}
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-5 h-5 rounded-full bg-white/20 blur-sm animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] border border-white/80" />
            </div>
          </div>
        </div>

        {/* Large Central Circle with 'Rifelo' in Matte Obsidian */}
        <div 
          className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-full flex items-center justify-center z-10 shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(255,255,255,0.05)] border border-white/15 transition-transform duration-500 group-hover:scale-105"
          style={{
            background: 'radial-gradient(circle at 45% 45%, #222222 0%, #141414 70%, #0a0a0a 100%)',
          }}
        >
          {/* Subtle inner rim */}
          <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
          
          {/* Text 'Rifelo' */}
          <span className="text-white font-bold text-base sm:text-lg tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Rifelo
          </span>
        </div>
      </div>
    </div>
  );
}

function SpecialCustomDirectMockup() {
  const [urlText, setUrlText] = useState('https://rifelo.id');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fullText = 'https://rifelo.id';
    let isMounted = true;
    
    const runCycle = async () => {
      while (isMounted) {
        // 1. Initial pause with full text
        setUrlText(fullText);
        setIsSaved(false);
        await new Promise((resolve) => setTimeout(resolve, 1800));
        if (!isMounted) return;

        // 2. Trigger Save Changes
        setIsSaved(true);
        await new Promise((resolve) => setTimeout(resolve, 2500));
        if (!isMounted) return;

        setIsSaved(false);

        // 3. Backspace
        for (let i = fullText.length; i >= 'https://'.length; i--) {
          if (!isMounted) return;
          setUrlText(fullText.substring(0, i));
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        await new Promise((resolve) => setTimeout(resolve, 400));
        if (!isMounted) return;

        // 4. Re-type
        for (let i = 'https://'.length; i <= fullText.length; i++) {
          if (!isMounted) return;
          setUrlText(fullText.substring(0, i));
          await new Promise((resolve) => setTimeout(resolve, 70));
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    };

    runCycle();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none p-1 sm:p-2">
      <div className="w-full max-w-[210px] sm:max-w-[215px] bg-white rounded-2xl p-2.5 sm:p-3 shadow-sm border border-slate-100 flex flex-col gap-1.5 text-left select-none">
        {/* Field: Interaction Mode & Destination (from /tags) */}
        <div>
          <label className="block text-[8px] sm:text-[8.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Interaction Mode & Destination
          </label>
          
          {/* Trigger button directly from /tags */}
          <div className="flex items-center justify-between w-full p-1.5 px-2 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <ExternalLink className="w-3 h-3 text-slate-700" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-[11px] font-semibold text-slate-900 truncate leading-none">
                  Custom URL
                </div>
                <div className="text-[7.5px] sm:text-[8px] text-slate-400 truncate leading-none mt-0.5">
                  https://rifelo.id
                </div>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
          </div>
        </div>

        {/* Destination URL Field (from /tags) */}
        <div>
          <label className="block text-[8px] sm:text-[8.5px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
            Destination URL
          </label>
          <div className="w-full px-2 py-1 sm:py-1.5 rounded-lg border border-slate-200/80 bg-white text-[8.5px] sm:text-[9px] font-normal text-slate-900 flex items-center shadow-2xs overflow-hidden">
            <span className="truncate">{urlText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-px h-3 bg-slate-900 ml-0.5"
            />
          </div>
        </div>

        {/* Bottom Actions: Save Changes (from /tags) */}
        <div className="pt-1 border-t border-slate-100 mt-0.5">
          <motion.div
            animate={isSaved ? { scale: [1, 0.96, 1] } : {}}
            transition={{ duration: 0.25 }}
            className={`w-full py-1.5 rounded-lg font-semibold text-[8.5px] sm:text-[9px] transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer ${
              isSaved 
                ? 'bg-[#1A1A1A] text-white' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-white" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface PremiumDesignCardProps {
  item: {
    title: string;
    badge: string;
    desc: string;
    img: string;
  };
  index: number;
  activeCarouselSlide: number;
  setActiveCarouselSlide: React.Dispatch<React.SetStateAction<number>>;
  isFront: boolean;
  diff: number;
}

function PremiumDesignCard({ item, index, activeCarouselSlide, setActiveCarouselSlide, isFront, diff }: PremiumDesignCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  const targetZIndex = isFront ? 30 : diff === 1 ? 20 : 10;
  const [zIndexVal, setZIndexVal] = useState(targetZIndex);

  useEffect(() => {
    if (isFront) {
      setZIndexVal(30);
    } else if (diff === 1) {
      setZIndexVal(20);
    } else {
      // Keep z-index higher (e.g., 25) to slide underneath the top card (30) 
      // but stay on top of the middle card (20) during transit, then settle to 10
      setZIndexVal(25);
      const timer = setTimeout(() => {
        setZIndexVal(10);
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [isFront, diff]);

  const scaleVal = diff === 0 ? 1 : diff === 1 ? 0.94 : 0.88;
  const yVal = diff === 0 ? 0 : diff === 1 ? 16 : 32;

  const handleDragEnd = (event: any, info: any) => {
    if (!isFront) return;
    const swipeOffset = info.offset.x;
    const swipeVelocity = info.velocity.x;

    // Menentukan jika drag melewati batas sehingga digeser
    if (swipeOffset < -60 || swipeVelocity < -200) {
      setActiveCarouselSlide((prev) => (prev + 1) % 3);
    } else if (swipeOffset > 60 || swipeVelocity > 200) {
      setActiveCarouselSlide((prev) => (prev - 1 + 3) % 3);
    }
  };

  return (
    <motion.div
      style={{
        zIndex: zIndexVal,
        x,
        rotate,
        willChange: "transform",
      }}
      animate={{
        scale: scaleVal,
        y: yVal,
        x: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 1,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={isFront ? 0.8 : 0}
      onDragEnd={handleDragEnd}
      onClick={() => {
        if (!isFront) {
          setActiveCarouselSlide(index);
        }
      }}
      className={`absolute inset-0 bg-white rounded-3xl p-5 shadow-[0_8px_25px_rgba(0,0,0,0.06)] border border-[#0c0e0b]/5 flex flex-col items-center group ${isFront ? 'cursor-grab active:cursor-grabbing hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]' : 'cursor-pointer'}`}
    >
      <div className="w-full aspect-square relative rounded-2xl overflow-hidden bg-[#F4F3EE]/40 mb-4 flex items-center justify-center border border-black/5 shadow-inner select-none pointer-events-none">
         <Image src={item.img} alt={item.title} fill className={`${item.title === 'Versatile Style' ? 'object-contain p-2' : 'object-cover'} select-none pointer-events-none`} referrerPolicy="no-referrer" />
      </div>
      
      <div className="text-left w-full px-3 pb-1 flex-grow flex flex-col justify-between select-none pointer-events-none">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-700 mb-2 block">{item.badge}</span>
          <h3 className="text-lg font-bold tracking-tight text-[#0c0e0b] mb-2">{item.title}</h3>
          <p className="text-xs sm:text-sm text-[#0c0e0b]/70 leading-relaxed font-medium line-clamp-3">{item.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track window scroll to hide navbar on scroll down and show on scroll up / at top
  const { scrollY } = useScroll();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollYRef.current;
    if (latest <= 60) {
      setIsNavbarVisible(true);
    } else if (latest > previous + 8) {
      setIsNavbarVisible(false);
    } else if (latest < previous - 8) {
      setIsNavbarVisible(true);
    }
    lastScrollYRef.current = latest;
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);

  const leftXDesktop = useTransform(scrollYProgress, [0, 0.7], [-600, -5]);
  const leftXMobile = useTransform(scrollYProgress, [0, 0.7], [-350, -5]);
  const rightXDesktop = useTransform(scrollYProgress, [0, 0.7], [600, 5]);
  const rightXMobile = useTransform(scrollYProgress, [0, 0.7], [350, 5]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.7 && !isConnected) {
      setIsConnected(true);
    } else if (latest < 0.7 && isConnected) {
      setIsConnected(false);
    }
  });

  const [contactLink, setContactLink] = useState('mailto:support@rifelo.com');
  const [getYoursNowLink, setGetYoursNowLink] = useState('/rifelo');
  const [globalLinks, setGlobalLinks] = useState<{id: string, title: string, url: string, is_visible?: boolean}[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [circleView, setCircleView] = useState<'public' | 'member'>('public');
  const [isProfilePublic, setIsProfilePublic] = useState(true);
  
  // Resonance animation states identical 100% to /c/circle (UnifiedCirclePage)
  const [phase, setPhase] = useState<'pulsing' | 'rotating' | 'accelerating' | 'merged'>('rotating');
  const rotation = useMotionValue(0);
  const speed = useMotionValue(36);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (phase === 'accelerating') {
      timeout = setTimeout(() => {
        setPhase('merged');
      }, 3000); // 3.0 seconds to allow multiple fast orbits first as in /c/circle
    }
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase === 'rotating' || phase === 'pulsing') {
      animate(speed, 36, { duration: 1, ease: "easeOut" });
    } else if (phase === 'accelerating') {
      animate(speed, 1080, { duration: 3.0, ease: "easeIn" });
    } else if (phase === 'merged') {
      animate(speed, 18, { duration: 3.0, ease: "easeOut" });
    }
  }, [phase, speed]);

  useAnimationFrame((t, delta) => {
    rotation.set(rotation.get() + (speed.get() * (delta / 1000)));
  });

  const [activeIndexes, setActiveIndexes] = useState<number[]>([0, 1]); // initial 2 members active state
  const [mounted, setMounted] = useState(false);
  const [demoProfile, setDemoProfile] = useState<any>(DEFAULT_MARFEL_PROFILE);
  const [showDemoMessage, setShowDemoMessage] = useState(true);
  const [demoCircleMembers, setDemoCircleMembers] = useState<any[]>([]);
  const [demoCircle, setDemoCircle] = useState<any>({ name: 'Rifelo', resonanceColor: '#D4AF37' });
  
  const [activeCarouselSlide, setActiveCarouselSlide] = useState(0);
  const [bentoActiveIndex, setBentoActiveIndex] = useState(0);
  const bentoContainerRef = useRef<HTMLDivElement>(null);

  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail })
      });
    } catch (err) {
      console.log('Newsletter subscription api error:', err);
    }
    setSubscribeStatus('success');
  };

  const getDemoMemberName = (index: number) => {
    const defaultList = [
      { name: 'Marfel RP (Admin)', color: '#059669' },
      { name: 'Marfel (Member)', color: '#2563EB' },
      { name: 'Sarah K.', color: '#FF9500' },
      { name: 'Alex T.', color: '#FF2D55' },
      { name: 'Elena R.', color: '#AF52DE' },
      { name: 'David M.', color: '#00C7BE' }
    ];
    if (demoCircleMembers && demoCircleMembers[index] && demoCircleMembers[index].profiles) {
      const p = demoCircleMembers[index].profiles;
      const roleStr = demoCircleMembers[index].role ? ` (${demoCircleMembers[index].role.trim()})` : '';
      return {
        name: (p.full_name || p.username || defaultList[index].name) + (index < 2 ? roleStr : ''),
        color: demoCircleMembers[index].color || defaultList[index].color
      };
    }
    return defaultList[index] || { name: `Member ${index + 1}`, color: '#1A1A1A' };
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rifelo",
    "url": "https://rifelo.id",
    "sameAs": [
      "https://instagram.com/rifelo.id"
    ],
    "description": "Rifelo is a dynamic profile platform that lets you share your profile with a single tap using NFC."
  };

  const handleResonanceDemo = () => {
    if (phase === 'accelerating') return;
    if (phase === 'merged') {
      setPhase('rotating');
      return;
    }
    setPhase('accelerating');
  };

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('id, value')
          .in('id', ['contact_support_link', 'get_yours_now_link', 'global_platforms_links']);
        
        if (!error && data) {
          const contactSetting = data.find(s => s.id === 'contact_support_link');
          const getYoursSetting = data.find(s => s.id === 'get_yours_now_link');
          const globalLinksSetting = data.find(s => s.id === 'global_platforms_links');
          
          if (contactSetting?.value) setContactLink(contactSetting.value);
          if (getYoursSetting?.value) setGetYoursNowLink(getYoursSetting.value);
          if (globalLinksSetting?.value) {
            try {
              setGlobalLinks(JSON.parse(globalLinksSetting.value));
            } catch(e) {}
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    const fetchDemoProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*, profile_links(*)')
          .ilike('username', 'marfel')
          .maybeSingle();

        if (data) {
          const links = (data.profile_links || []).filter((l: any) => l.is_visible !== false);
          links.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
          const decodedSettings = decodeMessageSettings(data.message_placeholder_name || '');
          setShowDemoMessage(decodedSettings.isEnabled);
          
          setDemoProfile({
            id: data.id,
            username: data.username,
            fullName: data.full_name || 'Marfel RP',
            bio: data.bio || 'Trust yourself',
            company: data.company || 'Rifelo',
            email: data.email || 'marfelringga@gmail.com',
            phone: data.phone || '628159999410',
            website: data.website || '',
            jobTitle: data.job_title || 'Founder',
            links: links.length > 0 ? links : DEFAULT_MARFEL_PROFILE.links,
            isPublic: data.is_public !== false,
            allowMessages: decodedSettings.isEnabled,
            messagePlaceholderName: decodedSettings.cleanName || 'Name / Company',
            messagePlaceholderContent: data.message_placeholder_content || 'Tell me about your project or idea...',
            profileMode: data.profile_mode || 'professional',
            themePreset: data.theme_preset || 'glassmorphism',
            customTheme: data.custom_theme || DEFAULT_MARFEL_PROFILE.customTheme,
            isEmbeddedPreview: true
          });
        }
      } catch (err) {}
    };

    const fetchDemoCircle = async () => {
      try {
        const { data: circle } = await supabase
          .from('circles')
          .select('id, name, slug, description')
          .eq('slug', 'circle')
          .maybeSingle();
        if (circle?.id) {
          let resColor = '#D4AF37';
          try {
            const parsed = JSON.parse(circle.description);
            if (parsed.resonanceColor) resColor = parsed.resonanceColor;
          } catch (e) {}
          setDemoCircle({ ...circle, resonanceColor: resColor });

          const { data: members } = await supabase
            .from('circle_members')
            .select('id, role, color, profile_id, profiles(id, full_name, username, avatar_url)')
            .eq('circle_id', circle.id);
          if (members && members.length > 0) {
            setDemoCircleMembers(members);
          }
        }
      } catch (err) {}
    };

    fetchSettings();
    fetchDemoProfile();
    fetchDemoCircle();
  }, []);

  // Update carousel center item on mount
  useEffect(() => {
    // IntersectionObserver handles initial state naturally
  }, []);

  useEffect(() => {
    if (isConnected) {
      const timeout = setTimeout(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([150, 150, 150]);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isConnected]);

  // Derived transforms based on mobile state
  const leftX = isMobile ? leftXMobile : leftXDesktop;
  const rightX = isMobile ? rightXMobile : rightXDesktop;

  const resonanceColor = demoCircle?.resonanceColor || '#D4AF37';
  const currentCircleName = demoCircle?.name || 'Rifelo';
  const circleMembersList = (demoCircleMembers && demoCircleMembers.length > 0)
    ? [
        ...demoCircleMembers.map((m: any, i: number) => ({
          id: m.id || `m-${i}`,
          name: m.profiles?.full_name || m.profiles?.username || `Member ${i + 1}`,
          color: m.color || (i === 0 ? '#1A1A1A' : '#333333')
        })),
        ...(demoCircleMembers.length < 4 ? [
          { id: 'demo-3', name: 'Sarah K.', color: '#404040' },
          { id: 'demo-4', name: 'Alex T.', color: '#525252' },
          { id: 'demo-5', name: 'Elena R.', color: '#666666' },
          { id: 'demo-6', name: 'David M.', color: '#787878' },
        ].slice(0, 6 - demoCircleMembers.length) : [])
      ]
    : [
        { id: '1', name: 'Marfel RP (Admin)', color: '#1A1A1A' },
        { id: '2', name: 'Marfel (Member)', color: '#2E2E2E' },
        { id: '3', name: 'Sarah K.', color: '#404040' },
        { id: '4', name: 'Alex T.', color: '#525252' },
        { id: '5', name: 'Elena R.', color: '#666666' },
        { id: '6', name: 'David M.', color: '#787878' }
      ];

  return (
    <div className="min-h-screen bg-[#F4F3EE] font-sans selection:bg-slate-900 selection:text-white flex flex-col w-full relative">
      {/* 1. Navbar (Minimalist - auto-hide on scroll down, visible at top & scroll up) */}
      <div 
        className={`fixed top-0 left-0 w-full z-50 flex justify-center bg-[#F4F3EE]/80 backdrop-blur-md border-b border-[#0c0e0b]/5 transition-transform duration-300 ease-in-out ${
          isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="w-full flex items-center justify-between py-2.5 px-4 md:px-12 max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-7 h-7 transition-transform group-hover:scale-105">
            <img 
              src="https://i.ibb.co.com/20WNbGMp/favicon-192x192.png" 
              alt="Rifelo Logo" 
              className="w-full h-full object-contain"
             referrerPolicy="no-referrer" />
          </div>
          <span className="font-semibold text-base tracking-tight text-[#0c0e0b]">Rifelo</span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-6">
          <Link 
            href="/login" 
            className="text-sm font-medium text-[#0c0e0b]/70 hover:text-[#0c0e0b] transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 bg-[#1A1A1A] text-white rounded-md hover:bg-[#0c0e0b] transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>
      </div>

      {/* 2. Hero Section */}
      <main ref={containerRef} className="relative w-full h-[260vh]">
        <div className="sticky top-0 flex flex-col items-center justify-center overflow-hidden w-full h-[100svh]">
          {/* Subtle background ambient depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square w-full max-w-[600px] bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 relative z-10 w-full flex-1 flex flex-col items-center justify-center">
          
          <div className="relative w-full flex items-center justify-center">
            {/* Center: Text Replaces CTA */}
            <motion.div 
              style={{ opacity: textOpacity, scale: textScale }}
              className="absolute z-50 flex flex-col items-center justify-center text-center w-[90vw] max-w-xl pointer-events-none"
            >
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-2 sm:mb-3 block">
                NFC Dynamic Profile
              </span>
              <h1 className="font-bold tracking-tight text-slate-900 leading-none flex flex-col items-center justify-center w-full mb-4">
                <span className="text-[32px] min-[360px]:text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-1 lg:mb-2 text-center font-bold tracking-tight">Tap Once.</span>
                <span className="text-slate-500 text-[28px] min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-semibold tracking-tight">Share Everything.</span>
              </h1>
              
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed text-sm sm:text-base font-normal">
                Instantly exchange your profile, socials, and contact with any smartphone. No apps required.
              </p>
            </motion.div>

            {/* Devices Container */}
            <div className="flex flex-row items-center justify-center w-full relative h-[350px] sm:h-[450px]">
              {/* Connection Glow */}
              <AnimatePresence>
                {isConnected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square w-full max-w-[192px] bg-black/10 blur-3xl rounded-full pointer-events-none z-0"
                  />
                )}
              </AnimatePresence>

              {/* Left: NFC Bracelet */}
              <motion.div style={{ x: leftX, willChange: 'transform' }} className="flex-1 flex justify-end items-center pointer-events-none relative z-10 w-1/2">
                <motion.div 
                  animate={{ 
                    scale: isConnected ? 0.97 : 1,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ willChange: 'transform' }}
                  className="relative shrink-0 flex items-center justify-center w-[35vw] max-w-[140px] sm:max-w-[180px] lg:max-w-[200px] aspect-[4/5] pointer-events-auto"
                >
                  <Image
                    src="https://i.ibb.co.com/vvsX17bc/wristband.png"
                    alt="Rifelo NFC bracelet"
                    fill
                    sizes="(max-width: 768px) 35vw, 200px"
                    priority
                    className="object-contain"
                    referrerPolicy="no-referrer" />
                </motion.div>
              </motion.div>

              {/* Right: Phone Mockup */}
              <motion.div style={{ x: rightX, willChange: 'transform' }} className="flex-1 flex justify-start items-center pointer-events-none relative z-30 w-1/2">
                <motion.div 
                  animate={{ 
                    scale: isConnected ? 1.02 : 1,
                    rotate: isConnected ? [0, -1, 1, -1, 0] : 0
                  }}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeInOut",
                  }}
                  style={{ willChange: 'transform' }}
                  className="relative shrink-0 flex items-center justify-center w-[45vw] max-w-[170px] sm:max-w-[240px] lg:max-w-[260px] aspect-[1/2] pointer-events-auto"
                >
                  <Image
                    src="https://i.ibb.co.com/JRyHX9JW/phone.png"
                    alt="Rifelo phone demo"
                    fill
                    sizes="(max-width: 768px) 45vw, 260px"
                    priority
                    className="object-contain"
                    referrerPolicy="no-referrer" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="py-4 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-slate-500 hover:text-slate-900 transition-colors text-xs font-semibold tracking-wider uppercase cursor-pointer"
              onClick={() => document.getElementById('circle-demo-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Scroll to explore ↓
            </motion.div>
          </div>
        </div>
      </div>
      </main>

      {/* 2.2 What is Rifelo Section */}
      <section className="pt-12 pb-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 block">
            Unified Identity
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-900">
            One Identity. Everything Connected.
          </h2>
          <p className="text-slate-600 leading-relaxed text-base sm:text-lg font-normal max-w-2xl mx-auto">
            Rifelo brings your contact info, social links, and portfolio into one dynamic profile. Update it anytime, and share it anywhere — instantly.
          </p>
        </motion.div>
      </section>

      {/* 2.5. Circle Demo Section */}
      <section id="circle-demo-section" className="min-h-screen flex flex-col items-center justify-center py-16 md:py-24 px-4 sm:px-6 md:px-12 w-full relative z-10 bg-[#F4F3EE]">

        {/* View Switcher (Segmented Control matching /profile) */}
        <div className="flex justify-center w-full mb-8">
          <div className="relative inline-flex p-1 bg-slate-200/70 border border-slate-300/60 rounded-2xl shadow-xs gap-1">
            <button 
              type="button"
              onClick={() => setCircleView('public')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                circleView === 'public' 
                  ? 'bg-white shadow-sm text-slate-900 border border-slate-200/80' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dynamic Profile</span>
            </button>
            <button 
              type="button"
              onClick={() => setCircleView('member')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-semibold rounded-xl transition-all ${
                circleView === 'member' 
                  ? 'bg-white shadow-sm text-slate-900 border border-slate-200/80' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Circle</span>
            </button>
          </div>
        </div>

        {/* Interactive Mockup + Text Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-6xl">
          {/* Interactive Mockup with 100% Exact Physical Smartphone Chassis from /profile */}
          <div className="relative flex items-center justify-center shrink-0">
            {/* Ambient Neutral Halo behind the smartphone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-black/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Scaled Device Wrapper with exact layout dimensions to fit 100% cleanly on mobile and desktop without clipping */}
            <div id="demo-box" className="w-[270px] sm:w-[312px] h-[567px] sm:h-[654px] relative shrink-0 flex justify-center my-auto scroll-mt-[100px]">
              <div className="w-[416px] h-[872px] origin-top scale-[0.65] sm:scale-[0.75] shrink-0 [transform:translateZ(0)]">
                {/* Physical Smartphone Chassis (Exact 390x844 px screen ratio) */}
                <div className="w-[416px] h-[872px] bg-[#0c0d12] rounded-[3.4rem] p-[13px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] border-[3.5px] border-slate-700/80 flex flex-col relative shrink-0 select-none">
                  
                  {/* Realistic Physical Buttons on Edge */}
                  <div className="absolute -left-[5.5px] top-28 w-[3.5px] h-7 bg-slate-700 rounded-l-sm" />
                  <div className="absolute -left-[5.5px] top-40 w-[3.5px] h-12 bg-slate-700 rounded-l-sm" />
                  <div className="absolute -left-[5.5px] top-56 w-[3.5px] h-12 bg-slate-700 rounded-l-sm" />
                  <div className="absolute -right-[5.5px] top-44 w-[3.5px] h-16 bg-slate-700 rounded-r-sm" />

                  {/* Top Speaker Ear-piece */}
                  <div className="w-16 h-1 bg-slate-800 rounded-full mx-auto mb-1.5 opacity-80" />

                  {/* Phone Screen Viewport (Exact 390px x 844px) */}
                  <div 
                    className="w-[390px] h-[844px] rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-inner [transform:translateZ(0)]"
                    style={{
                      background: circleView === 'public'
                        ? (demoProfile?.customTheme?.colors?.background || 'linear-gradient(135deg, #eef2f6 0%, #f8fafc 50%, #e2e8f0 100%)')
                        : '#0c0e0b'
                    }}
                  >
                    {/* Realistic Native Status Bar */}
                    <div className={`h-10 px-6 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-30 relative ${
                      circleView === 'public' ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span className="tracking-tight font-medium">9:41</span>

                      {/* Status Icons */}
                      <div className="flex items-center gap-1.5 opacity-90 text-[10px]">
                        <div className="flex items-end gap-[1.5px] h-2.5">
                          <div className="w-[2px] h-1 bg-current rounded-2xs" />
                          <div className="w-[2px] h-1.5 bg-current rounded-2xs" />
                          <div className="w-[2px] h-2 bg-current rounded-2xs" />
                          <div className="w-[2px] h-2.5 bg-current rounded-2xs" />
                        </div>
                        <span className="text-[9px] font-bold">5G</span>
                        <div className="w-4 h-2.5 border border-current rounded-xs p-[1px] flex items-center">
                          <div className="w-full h-full bg-current rounded-2xs" />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Browser Address Bar Header (rifelo.id/u/marfel & rifelo.id/c/circle) */}
                    <div className={`w-full px-4 py-2 flex items-center justify-between shrink-0 z-30 border-b backdrop-blur-md transition-colors ${
                      circleView === 'public'
                        ? 'bg-slate-100/90 border-slate-200/80 text-slate-800'
                        : 'bg-[#14151a]/90 border-white/10 text-white'
                    }`}>
                      <div className="w-5 h-5 flex items-center justify-center opacity-40">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <Link
                        href={circleView === 'public' ? '/u/marfel' : '/c/circle'}
                        target="_blank"
                        className={`flex-1 max-w-[270px] mx-2 h-7 px-3 rounded-full flex items-center justify-center gap-1.5 text-[11px] font-medium tracking-tight shadow-2xs group cursor-pointer transition-all ${
                          circleView === 'public'
                            ? 'bg-white border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                            : 'bg-white/10 border border-white/10 text-white/80 hover:text-white hover:bg-white/15'
                        }`}
                      >
                        <Lock className={`w-3 h-3 shrink-0 ${circleView === 'public' ? 'text-slate-700' : 'text-white/80'}`} />
                        <span className="font-mono text-[11.5px] select-none font-semibold">
                          {circleView === 'public' ? 'rifelo.id/u/marfel' : 'rifelo.id/c/circle'}
                        </span>
                      </Link>
                      <div className="w-5 h-5 flex items-center justify-center opacity-40">
                        <RefreshCw className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Viewport Content with AnimatePresence */}
                    <AnimatePresence mode="wait">
                      {circleView === 'public' ? (
                        <motion.div
                          key="public"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex-1 overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain touch-pan-y relative z-10 [transform:translateZ(0)] hide-scrollbar"
                        >
                          <PublicProfileView profile={demoProfile || DEFAULT_MARFEL_PROFILE} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="member"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-full flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col items-center justify-between py-6 px-4 relative z-10 text-white select-none"
                          style={{
                            backgroundImage: `radial-gradient(ellipse at 50% 30%, ${resonanceColor}25 0%, transparent 75%)`
                          }}
                        >
                          {/* Active Resonance Glow effect (Exact 100% from /c/circle lines 475-489) */}
                          <AnimatePresence>
                            {phase === 'merged' && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                              >
                                <div 
                                  className="w-[280px] h-[280px] rounded-full blur-[70px] opacity-25"
                                  style={{ backgroundColor: resonanceColor }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Top Navigation Status & Header (Exact 100% from /c/circle lines 501-523) */}
                          <div className="text-center z-20 mt-2 mb-2 shrink-0">
                            <div className="flex items-center justify-center gap-1.5 mb-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                                {phase === 'accelerating' || phase === 'merged' ? circleMembersList.length : 2} / {circleMembersList.length} Active
                              </span>
                            </div>
                            <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-1">
                              {currentCircleName || 'Untitled'}
                            </h1>
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest transition-colors duration-1000">
                              {phase === 'merged' ? (
                                <span style={{ color: resonanceColor, textShadow: `0 0 10px ${resonanceColor}` }}>
                                  Resonance Active
                                </span>
                              ) : phase === 'accelerating' ? (
                                <span className="text-white">Resonating...</span>
                              ) : "Private Live Space"}
                            </p>
                          </div>

                          {/* Visualization Hub (Exact 100% from /c/circle lines 525-598) */}
                          <div className="relative w-[280px] h-[280px] flex items-center justify-center z-10 shrink-0 my-3">
                            {/* Orbit Track Guideline */}
                            <div className="absolute inset-[15px] rounded-full border border-dashed border-white/10 pointer-events-none" />

                            {/* Orbit Balls Container with rotate: rotation and scale animation */}
                            <motion.div
                              style={{ rotate: rotation }}
                              animate={{ scale: phase === 'merged' ? 1.1 : 1 }}
                              transition={{ scale: { duration: 1.5, ease: "easeInOut" } }}
                              className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
                            >
                              {circleMembersList.map((member, i, arr) => {
                                const angle = (i / arr.length) * Math.PI * 2;
                                
                                // Dynamic radius: spiral in towards the center during accelerating and merged phases
                                const isResonating = phase === 'accelerating' || phase === 'merged';
                                const radius = isResonating ? 0 : 110;
                                
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                const color = member.color || resonanceColor;
                                const isMerged = phase === 'merged';
                                const isActive = (phase === 'accelerating' || phase === 'merged') ? true : (i < 2);

                                return (
                                  <div
                                    key={member.id || i}
                                    className="absolute w-5 h-5 rounded-full shadow-lg group border border-white/20 transition-all pointer-events-auto"
                                    style={{ 
                                      transitionDuration: phase === 'accelerating' ? '3000ms' : '700ms',
                                      transitionTimingFunction: phase === 'accelerating' ? 'cubic-bezier(0.85, 0, 1, 0.2)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                                      backgroundColor: color,
                                      boxShadow: isActive && !isMerged ? `0 0 20px ${color}80` : 'none',
                                      transform: `translate(${x}px, ${y}px) scale(${isActive && !isMerged ? 1.2 : 1})`,
                                      opacity: isMerged ? 0 : (isActive ? 1 : 0.3)
                                    }}
                                  >
                                    {/* Tooltip (Exact from /c/circle lines 563-569) */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                      <span className="text-[10px] font-bold whitespace-nowrap bg-black/90 px-2 py-1 rounded border border-white/10 text-white shadow-xl">
                                        {member.name}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </motion.div>

                            {/* The Giant Merged Circle (Exact 100% from /c/circle lines 574-598) */}
                            <div
                              onClick={handleResonanceDemo}
                              role="button"
                              title="Klik untuk demonstrasi Resonance"
                              className={`absolute w-36 h-36 rounded-full z-40 flex items-center justify-center p-4 text-center transition-all border border-white/10 cursor-pointer ${
                                phase === 'accelerating' || phase === 'merged' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                              }`}
                              style={{
                                transitionDuration: phase === 'accelerating' || phase === 'merged' ? '2000ms' : '700ms',
                                transitionDelay: phase === 'accelerating' ? '1000ms' : '0ms',
                                transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
                                backgroundColor: '#0c0e0b',
                                backgroundImage: `radial-gradient(circle, ${resonanceColor} 0%, transparent 80%)`,
                                boxShadow: `0 0 60px ${resonanceColor}, inset 0 0 20px rgba(255,255,255,0.1)`
                              }}
                            >
                              <div
                                className="absolute inset-0 rounded-full animate-pulse"
                                style={{
                                  boxShadow: `0 0 40px ${resonanceColor}`
                                }}
                              />
                              <div className="font-black text-xs tracking-widest text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-20 text-center flex flex-col items-center justify-center leading-tight">
                                <CircleNameDisplay name={currentCircleName} isVisible={phase === 'accelerating' || phase === 'merged'} />
                              </div>
                            </div>
                          </div>

                          {/* Minimal Member List at Bottom of Viewport (Exact 100% from /c/circle lines 624-656) */}
                          <div className="w-full flex flex-col items-center gap-1.5 mt-2 mb-3 shrink-0 z-20 overflow-y-auto max-h-[140px] hide-scrollbar px-4">
                            <AnimatePresence>
                              {phase !== 'merged' && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.5, ease: "easeInOut" }}
                                  className="w-full flex flex-col items-center gap-2 overflow-hidden"
                                >
                                  {circleMembersList.map((member, i) => {
                                    const isActive = (phase === 'accelerating') ? true : (i < 2);
                                    const color = member.color || resonanceColor;
                                    return (
                                      <div key={member.id || i} className="flex items-center gap-2.5">
                                        <div 
                                          className="w-1.5 h-1.5 rounded-full transition-all duration-500 shrink-0"
                                          style={{ 
                                            backgroundColor: isActive ? color : 'rgba(255,255,255,0.15)',
                                            boxShadow: isActive ? `0 0 8px ${color}` : 'none'
                                          }}
                                        />
                                        <span className={`text-[10px] font-medium tracking-widest uppercase transition-colors duration-500 truncate max-w-[200px] ${isActive ? 'text-white/90' : 'text-white/30'}`}>
                                          {member.name}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Tombol Aktifkan Resonance untuk demonstrasi asli */}
                          <div className="w-full px-5 pt-1 pb-1 flex justify-center shrink-0 z-30">
                            <button
                              type="button"
                              onClick={handleResonanceDemo}
                              disabled={phase === 'accelerating'}
                              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex items-center justify-center active:scale-95 cursor-pointer select-none ${
                                phase === 'merged'
                                  ? 'bg-white text-black hover:bg-slate-200 shadow-sm'
                                  : phase === 'accelerating'
                                  ? 'bg-white/10 text-white/50 border border-white/10 cursor-wait'
                                  : 'bg-white/10 hover:bg-white/15 text-white/90 hover:text-white border border-white/10'
                              }`}
                            >
                              {phase === 'merged' 
                                ? 'Resonance Aktif (Reset)' 
                                : phase === 'accelerating' 
                                ? 'Resonating...' 
                                : 'Aktifkan Resonance'}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom iOS Home Indicator Bar (Exact from /circle lines 1137-1140) */}
                    <div className="h-5 w-full shrink-0 flex items-center justify-center relative z-20 pointer-events-none">
                      <div className={`w-36 h-1 rounded-full ${circleView === 'public' ? 'bg-slate-900/30' : 'bg-white/30'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Text Description Container */}
          <div className="text-center lg:text-left max-w-xl flex flex-col items-center lg:items-start px-4 shrink-0">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700 mb-2 sm:mb-3 block">
              {circleView === 'public' ? 'Instant Access' : 'Shared Frequency'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3 leading-tight flex flex-col items-center lg:items-start">
              <span>
                {circleView === 'public' ? 'Dynamic Profile' : 'Circle Resonance'}
              </span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-8 lg:mb-10 lg:max-w-md font-normal">
              {circleView === 'public' 
                ? 'Your complete dynamic profile in one scan. Share your contact info, social links, and portfolio with anyone, anywhere — no app required.' 
                : 'Resonance happens when your circle comes alive. Bring everyone in, stay active together, and watch the connection build in real time.'}
            </p>

            {/* Feature Highlights to fill empty vertical space on desktop */}
            <div className="flex flex-col gap-6 sm:gap-7 w-full max-w-md mb-10 lg:mb-12">
              {circleView === 'public' ? (
                <>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">No App Required</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">Works instantly with any modern smartphone using NFC technology. Just tap and share.</p>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Real-Time Updates</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">Change your contact info, portfolio, or social links anytime. Your wristband updates instantly.</p>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Direct Inbox</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">Receive messages straight to your profile. Keep your personal contact details private and secure.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Instant Group Sync</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">Connect multiple wristbands simultaneously. Create a unified digital presence for your circle.</p>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Live Activity</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">Watch connections build as members interact. Perfect for community events and networking.</p>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">Real-Time Resonance</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">Experience seamless synchronization across all devices when members interact within the circle.</p>
                  </div>
                </>
              )}
            </div>

            <Link 
              href="/nfcwristband"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full font-medium hover:bg-[#0c0e0b] transition-all shadow-md active:scale-95 text-sm"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
      </section>

      {/* 2.5 Premium Model Carousel */}
      <section className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 overflow-hidden">
        <div className="flex flex-col items-center mb-8 sm:mb-12 md:mb-16 text-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 block">
            Tactile Craftsmanship
          </span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
          >
            Premium by Design.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed font-normal"
          >
            Every detail is designed to provide maximum comfort and a superior look.
          </motion.p>
        </div>

        {/* Desktop View: Grid of Three Cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8 pb-8 items-stretch py-4 max-w-5xl mx-auto w-full">
          {[
            {
              title: "Adjustable & Clean Look",
              badge: "Ergonomic Design",
              desc: "Easily adjustable strap with a hidden locking mechanism, providing a clean silhouette on your wrist.",
              img: "https://i.ibb.co/k2GRG5p7/strap-wristband.png",
            },
            {
              title: "Versatile Style",
              badge: "Timeless Minimalist",
              desc: "A clean, aesthetic, and premium look. Perfectly suited and easily paired with any outfit for any activity.",
              img: "https://i.ibb.co.com/vvsX17bc/wristband.png",
            },
            {
              title: "Smooth & Lightweight",
              badge: "Premium Comfort",
              desc: "Made from premium materials that are incredibly soft and lightweight. Designed for comfortable all-day wear without irritation.",
              img: "https://i.ibb.co/pjs2hJQD/close-up-wristband.png",
            }
          ].map((item, i) => {
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white/60 backdrop-blur-md rounded-3xl p-5 xl:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#0c0e0b]/5 hover:border-[#0c0e0b]/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 flex flex-col items-center group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center"
              >
                <div className="w-full aspect-[1.1/1] relative rounded-2xl overflow-hidden bg-[#F4F3EE]/40 mb-5 flex items-center justify-center border border-black/5 shadow-inner">
                   <Image src={item.img} alt={item.title} fill className={`${item.title === 'Versatile Style' ? 'object-contain p-2 xl:p-3 group-hover:scale-[1.08]' : 'object-cover group-hover:scale-105'} transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`} referrerPolicy="no-referrer" />
                </div>
                <div className="text-left w-full px-3 xl:px-4 pb-1 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-700 mb-2.5 block">{item.badge}</span>
                    <h3 className="text-xl md:text-2xl tracking-tight font-bold text-slate-900 mb-3 leading-tight">{item.title}</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View: Stack Carousel Layout like Paper Sheets */}
        <div className="lg:hidden relative flex flex-col items-center justify-center py-12 md:py-16 min-h-[520px] md:min-h-[600px]">
          <div className="relative w-[85vw] sm:w-[360px] md:w-[420px] h-[380px] md:h-[460px] flex items-center justify-center">
            {[
              {
                title: "Adjustable & Clean Look",
                badge: "Ergonomic Design",
                desc: "Strap yang mudah disesuaikan dengan mekanisme pengunci tersembunyi, memberikan siluet yang bersih di pergelangan tangan Anda.",
                img: "https://i.ibb.co/k2GRG5p7/strap-wristband.png",
              },
              {
                title: "Versatile Style",
                badge: "Timeless Minimalist",
                desc: "Tampilan yang clean, estetis, dan premium. Sangat cocok dan mudah dipadukan dengan berbagai pilihan outfit untuk aktivitas apapun.",
                img: "https://i.ibb.co.com/vvsX17bc/wristband.png",
              },
              {
                title: "Smooth & Lightweight",
                badge: "Premium Comfort",
                desc: "Terbuat dari bahan premium yang sangat lembut dan ringan. Dirancang agar nyaman dipakai sepanjang hari tanpa iritasi.",
                img: "https://i.ibb.co/pjs2hJQD/close-up-wristband.png",
              }
            ].map((item, i) => {
              const diff = (i - activeCarouselSlide + 3) % 3;
              const isFront = diff === 0;
              
              return (
                <PremiumDesignCard
                  key={i}
                  item={item}
                  index={i}
                  activeCarouselSlide={activeCarouselSlide}
                  setActiveCarouselSlide={setActiveCarouselSlide}
                  isFront={isFront}
                  diff={diff}
                />
              );
            })}
          </div>

          {/* Interactive Stack Indicators and Prompts */}
          <div className="mt-14 flex flex-col items-center gap-4">
            <span className="text-xs font-semibold text-[#0c0e0b]/45 tracking-wider uppercase select-none touch-none">
              SWIPE
            </span>
            
            <div className="flex items-center gap-2.5">
              {[0, 1, 2].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCarouselSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${activeCarouselSlide === idx ? 'w-8 bg-[#0c0e0b]' : 'w-2.5 bg-[#0c0e0b]/15 hover:bg-[#0c0e0b]/30'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Demo Section (Timeline Flowcard UI) */}
      <section id="demo-section" className="relative py-24 w-full z-10 bg-[#F9F8F6] overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-gradient-to-b from-white/90 to-transparent blur-3xl pointer-events-none opacity-80"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#F4F3EE] to-transparent blur-3xl pointer-events-none opacity-50"></div>
         <div className="px-4 sm:px-6 md:px-12 max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 block">
              Engineered Simplicity
            </span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
            >
              Just Tap. That’s It.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed font-normal"
            >
              Tap your Rifelo wristband to any modern smartphone. Your dynamic profile appears instantly—no apps to install, no accounts to download.
            </motion.p>
          </div>

          {/* Bento Grid Feature Area */}
          <div className="max-w-5xl mx-auto w-full">
            {/* Mobile: Horizontal scroll/carousel, Desktop: Grid */}
            <div 
              ref={bentoContainerRef}
              onScroll={(e) => {
                const el = e.currentTarget;
                if (el) {
                  const cardWidth = el.offsetWidth * 0.85;
                  if (cardWidth > 0) {
                    const idx = Math.round(el.scrollLeft / cardWidth);
                    setBentoActiveIndex(Math.min(Math.max(idx, 0), 4));
                  }
                }
              }}
              className="flex md:grid md:grid-cols-2 lg:grid-cols-12 gap-5 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              
              {/* Feature 1: NFC Wristband */}
              <div className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto md:col-span-1 lg:col-span-6 bg-white border border-[#0c0e0b]/10 rounded-3xl p-6 lg:p-7 flex flex-col justify-between min-h-[440px] sm:min-h-[460px] md:min-h-[400px] lg:min-h-[440px] relative overflow-hidden snap-center group hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.06)] hover:border-[#0c0e0b]/20 transition-all duration-300">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-black/[0.04] transition-all duration-700 pointer-events-none"></div>
                 
                 <div className="flex justify-center items-start mb-4 md:mb-5 relative z-10 text-center">
                     <div className="w-full h-52 sm:h-56 md:h-48 lg:h-52 rounded-2xl overflow-hidden bg-slate-50 border border-black/5 relative group-hover:shadow-inner transition-all duration-500">
                        <Image 
                           src="https://i.ibb.co/pjs2hJQD/close-up-wristband.png"
                           alt="NFC Wristband"
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-700"
                           referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />
                     </div>
                  </div>
                 <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1.5">NFC Wristband</h3>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                      One tap, instant share. A dynamic profile wearable that replaces paper cards forever—no typing, no apps, zero delay.
                    </p>
                 </div>
              </div>

              {/* Feature 2: Privacy First Control */}
              <div className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto md:col-span-1 lg:col-span-6 bg-white border border-[#0c0e0b]/10 rounded-3xl p-6 lg:p-7 flex flex-col justify-between min-h-[440px] sm:min-h-[460px] md:min-h-[400px] lg:min-h-[440px] relative overflow-hidden snap-center group hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.06)] hover:border-[#0c0e0b]/20 transition-all duration-300">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-black/[0.04] transition-all duration-700 pointer-events-none"></div>
                 
                 <div className="flex justify-center items-start mb-4 md:mb-5">
                   {/* Image Area - Privacy Shield/Toggle */}
                   <div className="relative z-10 w-full h-52 sm:h-56 md:h-48 lg:h-52 rounded-2xl overflow-hidden bg-slate-50 border border-black/5 flex items-center justify-center p-3 text-center group-hover:bg-slate-100/40 transition-colors duration-500">
                     <PrivacyControlMockup />
                   </div>
                 </div>

                 <div className="relative z-10">
                   <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Privacy First Control</h3>
                   <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                     Toggle visibility with a single tap. Instantly hide personal numbers or social links without deleting them—complete control over what you share.
                   </p>
                 </div>
              </div>
              
              {/* Feature 3: Custom Direct */}
              <div className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto md:col-span-1 lg:col-span-6 bg-white border border-[#0c0e0b]/10 rounded-3xl p-6 lg:p-7 flex flex-col justify-between min-h-[440px] sm:min-h-[460px] md:min-h-[400px] lg:min-h-[440px] relative overflow-hidden snap-center group hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.06)] hover:border-[#0c0e0b]/20 transition-all duration-300">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-black/[0.04] transition-all duration-700 pointer-events-none"></div>
                 
                 {/* Visual Mockup - Top aligned with Card 2 and Card 4 */}
                 <div className="flex justify-center items-start mb-4 md:mb-5">
                   <div className="relative z-10 w-full h-52 sm:h-56 md:h-48 lg:h-52 rounded-2xl overflow-hidden bg-slate-50 border border-black/5 flex items-center justify-center p-2.5 sm:p-3">
                      <SpecialCustomDirectMockup />
                   </div>
                 </div>

                 {/* Text Content - Bottom aligned */}
                 <div className="relative z-10">
                   <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Custom Direct</h3>
                   <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                     Skip the profile, go straight to the point. Redirect users directly to any URL—your latest video, campaign, or portfolio.
                   </p>
                 </div>
              </div>

              {/* Feature 4: Direct Inbox */}
              <div className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto md:col-span-1 lg:col-span-6 bg-white border border-[#0c0e0b]/10 rounded-3xl p-6 lg:p-7 flex flex-col justify-between min-h-[440px] sm:min-h-[460px] md:min-h-[400px] lg:min-h-[440px] relative overflow-hidden snap-center group hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.06)] hover:border-[#0c0e0b]/20 transition-all duration-300">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-black/[0.04] transition-all duration-700 pointer-events-none"></div>
                 
                 <div className="flex justify-center items-start mb-4 md:mb-5">
                   {/* Image Area - Inbox Mockup */}
                   <div className="relative z-10 w-full h-52 sm:h-56 md:h-48 lg:h-52 rounded-2xl overflow-hidden bg-slate-50 border border-black/5 flex items-center justify-center p-2.5 sm:p-3">
                     <DirectInboxMockup />
                   </div>
                 </div>

                 <div className="relative z-10">
                   <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Direct Inbox</h3>
                   <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                     Direct access to your inbox. Let contacts send messages, inquiries, and collaboration requests straight from your profile page.
                   </p>
                 </div>
              </div>

              {/* Feature 5: Circle Management */}
              <div className="flex-shrink-0 w-[85vw] sm:w-[320px] md:w-auto md:col-span-2 lg:col-span-12 bg-white border border-[#0c0e0b]/10 rounded-3xl p-6 lg:p-7 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 md:gap-8 relative overflow-hidden snap-center group hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.06)] hover:border-[#0c0e0b]/20 transition-all duration-300">
                 <div className="absolute top-0 right-1/4 w-96 h-96 bg-black/[0.02] rounded-full blur-3xl group-hover:bg-black/[0.04] transition-all duration-700 pointer-events-none"></div>
                 <div className="flex-1 relative z-10 max-w-2xl">
                   <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-1.5">Circle Management</h3>
                   <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
                     Different worlds, one identity. Create circles for work, friends, events—share different versions of you with different people.
                   </p>
                 </div>
                 {/* Image Area - Circle Management Graphic */}
                 <div className="relative z-10 w-full md:w-[340px] h-64 md:h-auto self-stretch rounded-2xl overflow-hidden bg-[#0a0a0a] flex-shrink-0 border border-white/10 flex items-center justify-center p-4 text-center group-hover:border-white/20 transition-colors duration-500">
                    <CircleResonanceMockup />
                 </div>
              </div>

            </div>

            {/* Mobile Carousel Indicator Dots */}
            <div className="flex md:hidden justify-center items-center gap-1.5 mt-2 pt-1">
              {[0, 1, 2, 3, 4].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (bentoContainerRef.current) {
                      const cardWidth = bentoContainerRef.current.offsetWidth * 0.85;
                      bentoContainerRef.current.scrollTo({
                        left: idx * cardWidth,
                        behavior: 'smooth'
                      });
                      setBentoActiveIndex(idx);
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    bentoActiveIndex === idx 
                      ? 'w-6 bg-[#1A1A1A]' 
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 Use Case Section */}
      <section className="py-28 md:py-40 lg:py-52 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[480px] lg:min-h-[560px]">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="text-center flex flex-col items-center justify-center"
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-700 mb-3 block">
            Built For Real-World Connection
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">
            Built for Real-World Interaction.
          </h2>
          <p className="text-slate-600 leading-relaxed text-base sm:text-lg max-w-2xl mx-auto mb-8 font-normal">
            From school and communities to business and networking events, Rifelo helps you share who you are without effort. No more missed connections.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link 
              href="/nfcwristband"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#1A1A1A] text-white rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase hover:bg-[#0c0e0b] transition-all shadow-md active:scale-95 border border-[#1A1A1A]"
            >
              Coming Soon
            </Link>
          </motion.div>
        </motion.div>
      </section>






      {/* 4.9 Sand Transition */}
      <div className="w-full h-32 relative pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* 5. Footer (Graphy Inspired Style) */}
      <footer className="relative pt-24 pb-20 px-4 sm:px-6 md:px-12 mt-auto overflow-hidden">
        {/* Giant Background Text */}
        <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 pointer-events-none select-none">
          <span className="text-[25vw] font-bold text-[#0c0e0b]/[0.02] leading-none tracking-tighter">
            RIFELO
          </span>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-white rounded-3xl sm:rounded-3xl border border-[#0c0e0b]/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-6 sm:p-10 md:p-16">
            <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 mb-16">
              {/* Brand Section */}
              <div className="max-w-xs w-full">
                <Link href="/" className="flex items-center gap-2 mb-6 group">
                  <div className="relative w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105">
                    <Image 
                      src="https://i.ibb.co.com/20WNbGMp/favicon-192x192.png" 
                      alt="Rifelo Logo" 
                      fill
                      sizes="32px"
                      className="object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-bold text-xl sm:text-2xl tracking-tight text-[#0c0e0b]">Rifelo</span>
                </Link>
                <p className="text-sm text-slate-600 leading-relaxed font-normal mb-8">
                  Designing the future of intentional connections. Rifelo is an NFC-powered dynamic profile platform for modern networking.
                </p>
                <div className="flex gap-4 sm:gap-5">
                  {[
                    { icon: Instagram, href: "https://instagram.com/rifelo.id", label: "Instagram" },
                    { icon: AtSign, href: "https://threads.net/@rifelo_id", label: "Threads" },
                    { icon: Music, href: "https://tiktok.com/@rifelo_id", label: "TikTok" }
                  ].map((social, i) => (
                    <Link 
                      key={i} 
                      href={social.href} 
                      target="_blank" 
                      title={social.label}
                      className="p-2.5 rounded-xl bg-[#F4F3EE] text-slate-500 hover:text-white hover:bg-[#1A1A1A] transition-all duration-300"
                    >
                      <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Links & Newsletter Grid */}
              <div className="flex flex-col sm:flex-row gap-12 lg:gap-24">
                {/* Links Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:gap-16">
                  {/* Product */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Product</h4>
                    <ul className="space-y-3 text-sm text-slate-600 font-normal">
                      <li><Link href="/what-is-rifelo" className="hover:text-slate-900 transition-colors">Features</Link></li>
                      <li><Link href="/rifelo-features" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
                      <li><Link href="/join-rifelo" className="hover:text-slate-900 transition-colors">Dynamic Profile</Link></li>
                    </ul>
                  </div>

                  {/* Support & Legal Combined on mobile maybe? No, let's keep it clear */}
                  <div className="space-y-10">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Support</h4>
                      <ul className="space-y-3 text-sm text-slate-600 font-normal">
                        <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Help Center</Link></li>
                        <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Us</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Legal</h4>
                      <ul className="space-y-3 text-sm text-slate-600 font-normal">
                        <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Newsletter Shortcut */}
                <div className="max-w-[280px]">
                   <h4 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider">Stay Connected</h4>
                   <p className="text-xs text-slate-500 mb-4 leading-relaxed font-normal">
                     Get the latest updates on NFC features and networking tips.
                   </p>
                   {subscribeStatus === 'success' ? (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="p-4 rounded-xl bg-[#F4F3EE] border border-black/5 flex flex-col items-center text-center gap-1"
                     >
                       <CheckCircle2 className="w-5 h-5 text-slate-900 mb-1" />
                       <span className="text-xs font-bold text-slate-900">Subscribed!</span>
                       <span className="text-[11px] text-slate-500 font-normal leading-normal">
                         Thank you for subscribing to Rifelo updates.
                       </span>
                     </motion.div>
                   ) : (
                     <form onSubmit={handleSubscribe} className="relative group">
                       <input 
                         type="email" 
                         required
                         value={subscribeEmail}
                         onChange={(e) => setSubscribeEmail(e.target.value)}
                         placeholder="Email address" 
                         className="w-full bg-[#F4F3EE] border-0 rounded-xl py-3 pl-4 pr-10 text-xs font-medium focus:ring-2 focus:ring-[#0c0e0b]/10 transition-all outline-none"
                       />
                       <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#1A1A1A] text-white rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                         <ArrowRight className="w-3.5 h-3.5" />
                       </button>
                     </form>
                   )}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-8 border-t border-[#0c0e0b]/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-xs sm:text-sm text-slate-500 font-normal order-2 sm:order-1">
                © {mounted ? new Date().getFullYear() : '2026'} Rifelo Inc. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold uppercase tracking-wider order-1 sm:order-2">
                <Link href="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy</Link>
                <Link href="/terms" className="text-slate-500 hover:text-slate-900 transition-colors">Terms</Link>
                <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                <button className="text-slate-500 hover:text-slate-900 transition-colors">Cookies</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
