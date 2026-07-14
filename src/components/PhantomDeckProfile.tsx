'use client';

import { motion } from 'motion/react';
import { Mail, Phone, Globe, Club, Smile, Palette, Briefcase, FileText, Feather, GraduationCap, Building, Link as LinkIcon, MessageCircle } from 'lucide-react';
import MessageForm from '@/app/(public)/u/[username]/MessageForm';
import { getPlatformInfo } from '@/lib/platforms';
import { themePresets } from '@/lib/themePresets';

// Custom SVG silhouettes for card suits
const SpadeSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2C11.5 2 10 5 8 8C6 11 5 12.5 5 14C5 17.5 7.5 20 11 20C11.3 20 11.7 20 12 19.9C12.3 20 12.7 20 13 20C16.5 20 19 17.5 19 14C19 12.5 18 11 16 8C14 5 12.5 2 12 2ZM12 18V22H10C10 22 11 19.5 12 18Z" />
  </svg>
);

const HeartSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const DiamondSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2L2 12l10 10 10-10L12 2z" />
  </svg>
);

const ClubIcon = () => (
  <Club className="w-full h-full" />
);

export default function PhantomDeckProfile({ profile }: { profile: any }) {
  const getLinkRadius = (r: string | undefined): string => {
    if (r === 'sharp') return '0px';
    if (r === 'rounded') return '16px';
    if (r === 'pill') return '9999px';
    return '16px'; // default to rounded-2xl equivalent
  };
  const linkRadius = getLinkRadius(profile.customTheme?.borderRadius as string | undefined);

  // Define the applied colors for Phantom Deck, so we can pass them to MessageForm or use them inline.
  const appliedColors = {
    primary: '#ca8a04', // Warm gold
    secondary: '#2a1711', // Deep blackish brown
    accent: '#991b1b', // Deep crimson
    background: '#110c0a', // Solid base for simplicity in embeds
    text: '#f5ebd5', // Warm parchment text
    cardBg: 'rgba(28, 20, 16, 0.8)', // Acrylic card game table background
    cardBorder: 'rgba(202, 138, 4, 0.25)', // Subtle gold border
    linkBg: 'rgba(42, 23, 17, 0.5)',
    linkBorder: 'rgba(202, 138, 4, 0.15)',
    inputBg: '#110c0a',
    inputBorder: 'rgba(202, 138, 4, 0.3)'
  };

  return (
    <div className="min-h-screen bg-[#0f0a08] bg-radial-gradient from-[#221612] via-[#0f0a08] to-[#050302] font-sans py-12 px-4 flex flex-col items-center relative overflow-hidden">
      
      {/* Dynamic Gold Glitter / Bokeh Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.35, 0.15],
          x: [0, 15, 0],
          y: [0, -15, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] bg-amber-600 rounded-full blur-[130px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.25, 1],
          opacity: [0.1, 0.25, 0.1],
          x: [0, -25, 0],
          y: [0, 25, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-15%] left-[-10%] w-[65vw] h-[65vw] bg-red-950 rounded-full blur-[140px] pointer-events-none" 
      />

      {/* Floating Vintage Playing Card Decors */}
      <motion.div 
        animate={{ 
          y: [-10, 10, -10],
          rotate: [-12, -8, -12],
          x: [-5, 5, -5]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 left-[8%] w-24 h-36 bg-[#f7f3eb] border-2 border-amber-900/30 rounded-lg shadow-2xl shadow-black/80 flex flex-col justify-between p-2 text-red-700 opacity-20 blur-[1px] pointer-events-none select-none hidden md:flex"
      >
        <div className="text-xs font-serif font-bold flex flex-col items-center">
          <span>A</span>
          <span className="w-2.5 h-2.5"><HeartSvg /></span>
        </div>
        <div className="w-8 h-8 self-center text-red-700/80">
          <HeartSvg />
        </div>
        <div className="text-xs font-serif font-bold flex flex-col items-center rotate-180">
          <span>A</span>
          <span className="w-2.5 h-2.5"><HeartSvg /></span>
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [15, -15, 15],
          rotate: [15, 12, 15],
          x: [5, -5, 5]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 right-[6%] w-28 h-40 bg-[#f7f3eb] border-2 border-amber-900/40 rounded-lg shadow-2xl shadow-black/95 flex flex-col justify-between p-2 text-stone-900 opacity-15 blur-[2px] pointer-events-none select-none hidden md:flex"
      >
        <div className="text-sm font-serif font-bold flex flex-col items-center">
          <span>K</span>
          <span className="w-3 h-3"><SpadeSvg /></span>
        </div>
        <div className="w-10 h-10 self-center text-stone-900/80">
          <SpadeSvg />
        </div>
        <div className="text-sm font-serif font-bold flex flex-col items-center rotate-180">
          <span>K</span>
          <span className="w-3 h-3"><SpadeSvg /></span>
        </div>
      </motion.div>

      <motion.div 
        animate={{ 
          y: [-20, 20, -20],
          rotate: [4, -4, 4],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[10%] w-20 h-30 bg-[#fdfaf2] border border-amber-900/20 rounded-md shadow-xl shadow-black/50 flex flex-col justify-between p-1.5 text-red-600 opacity-25 blur-[1.5px] pointer-events-none select-none hidden lg:flex"
      >
        <div className="text-[10px] font-serif font-bold flex flex-col items-center">
          <span>10</span>
          <span className="w-2 h-2"><DiamondSvg /></span>
        </div>
        <div className="w-6 h-6 self-center text-red-600/70">
          <DiamondSvg />
        </div>
        <div className="text-[10px] font-serif font-bold flex flex-col items-center rotate-180">
          <span>10</span>
          <span className="w-2 h-2"><DiamondSvg /></span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, type: 'spring', bounce: 0.25 }}
        className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#1c1310]/95 to-[#130c0a]/95 rounded-[2.25rem] border border-amber-950/60 flex flex-col shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)] mb-8 p-6 sm:p-12 overflow-hidden mx-4 sm:mx-0 backdrop-blur-md"
      >
        {/* Subtle Inner playing-card borders */}
        <div className="absolute inset-4 pointer-events-none border border-amber-900/20 rounded-[1.75rem]" />

        <div className="flex flex-col gap-8 w-full opacity-100 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f5ebd5] font-serif">
              {profile.fullName}
            </h1>
            
            {(profile.jobTitle || profile.company) && (
              <div className="flex flex-row items-center justify-center flex-wrap gap-2 text-amber-500/80 text-sm md:text-base font-semibold uppercase tracking-widest font-mono">
                {profile.jobTitle && <p>{profile.jobTitle}</p>}
                {(profile.jobTitle && profile.company) && <span className="opacity-50 text-[10px] md:text-xs">|</span>}
                {profile.company && <p>{profile.company}</p>}
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="flex flex-col items-center text-center space-y-3">
              {profile.profileMode !== 'casual' && (
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600/70 flex items-center justify-center font-mono">
                  {profile.profileMode === 'professional' && <><FileText className="w-3.5 h-3.5 mr-2" /> Summary</>}
                  {profile.profileMode === 'creative' && <><Feather className="w-3.5 h-3.5 mr-2" /> Vision</>}
                </h2>
              )}
              <p className="leading-relaxed whitespace-pre-wrap text-[#f5ebd5]/90 text-[15px] font-serif max-w-xl mx-auto">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Details based on mode */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">

            {/* Portfolio Link (Creative only) */}
            {profile.profileMode === 'creative' && profile.website && (
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-[#261914] hover:bg-[#33221b] border border-amber-950 rounded-xl text-amber-500 font-mono text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderRadius: linkRadius }}
              >
                <Globe className="w-4 h-4 opacity-75" />
                <span className="truncate">Portfolio</span>
              </a>
            )}

            {/* Email (Pro & Creative) */}
            {(profile.profileMode === 'professional' || profile.profileMode === 'creative') && profile.email && (
              <a 
                href={`mailto:${profile.email}`} 
                className="flex items-center gap-3 p-4 bg-[#261914] hover:bg-[#33221b] border border-amber-950 rounded-xl text-amber-500 font-mono text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderRadius: linkRadius }}
              >
                <Mail className="w-4 h-4 opacity-75" />
                <span className="truncate">{profile.email}</span>
              </a>
            )}

            {/* Phone (Casual & Pro) */}
            {(profile.profileMode === 'casual' || profile.profileMode === 'professional') && profile.phone && (
              <a 
                href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-[#261914] hover:bg-[#33221b] border border-amber-950 rounded-xl text-amber-500 font-mono text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderRadius: linkRadius }}
              >
                {profile.profileMode === 'casual' ? (
                  <MessageCircle className="w-4 h-4 opacity-75" />
                ) : (
                  <Phone className="w-4 h-4 opacity-75" />
                )}
                <span className="truncate">{profile.phone}</span>
              </a>
            )}
          </div>

          {/* Links & Platforms */}
          {profile.links.length > 0 && (
            <div className="space-y-4 pt-2 flex flex-col items-center w-full">
              <div className="space-y-3 w-full">
                {profile.links.map((link: any) => {
                  const platformInfo = getPlatformInfo(link.title, link.url);
                  const isUrl = link.url.startsWith('http://') || link.url.startsWith('https://');
                  
                  // Gen-Z Media Platforms Embed Support
                  let embedDetails: { url: string; height: string; className: string } | null = null;
                  try {
                    const urlObj = new URL(link.url);
                    
                    // 1. Spotify
                    if (urlObj.hostname.includes('spotify.com')) {
                      if (!urlObj.pathname.startsWith('/embed')) {
                        urlObj.pathname = '/embed' + urlObj.pathname;
                      }
                      urlObj.searchParams.set('utm_source', 'generator');
                      let height = "152";
                      if (urlObj.pathname.includes('/playlist/') || urlObj.pathname.includes('/album/') || urlObj.pathname.includes('/artist/') || urlObj.pathname.includes('/show/')) {
                        height = "352";
                      } else if (urlObj.pathname.includes('/track/') || urlObj.pathname.includes('/episode/')) {
                        height = "80"; // Spotify official compact
                      }
                      embedDetails = { url: urlObj.toString(), height, className: "w-full" };
                    }
                    // 2. YouTube & YouTube Shorts
                    else if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                      let videoId = urlObj.searchParams.get('v');
                      if (urlObj.hostname.includes('youtu.be')) {
                        videoId = urlObj.pathname.slice(1);
                      } else if (urlObj.pathname.startsWith('/shorts/')) {
                        videoId = urlObj.pathname.split('/')[2];
                      }
                      if (videoId) {
                        embedDetails = { 
                          url: `https://www.youtube.com/embed/${videoId}`, 
                          height: "250", // Standard mobile-friendly video format
                          className: "w-full aspect-video sm:h-[300px]" 
                        };
                      }
                    }
                    // 3. TikTok
                    else if (urlObj.hostname.includes('tiktok.com')) {
                      const match = urlObj.pathname.match(/\/video\/(\d+)/);
                      if (match && match[1]) {
                        embedDetails = { 
                          url: `https://www.tiktok.com/embed/v2/${match[1]}`, 
                          height: "600", // TikTok native vertical format
                          className: "w-full max-w-[325px] mx-auto bg-black" 
                        };
                      }
                    }
                    // 4. Apple Music
                    else if (urlObj.hostname.includes('music.apple.com')) {
                      const amUrl = link.url.replace('music.apple.com', 'embed.music.apple.com');
                      const height = (urlObj.pathname.includes('/album/') || urlObj.pathname.includes('/playlist/')) && !urlObj.searchParams.has('i') ? "450" : "150";
                      embedDetails = { url: amUrl, height, className: "w-full" };
                    }
                    // 5. SoundCloud
                    else if (urlObj.hostname.includes('soundcloud.com')) {
                      const scUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(link.url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
                      embedDetails = { url: scUrl, height: "166", className: "w-full" };
                    }
                  } catch (e) {
                    // Fallback for invalid URLs handled by standard button
                  }

                  if (embedDetails) {
                    return (
                      <div key={link.id} className="w-full my-4 flex justify-center overflow-hidden">
                        <iframe 
                           style={{ 
                             borderRadius: linkRadius === '0px' ? '0px' : '16px',
                             backgroundColor: 'transparent',
                             maxWidth: '100%',
                             overflow: 'hidden'
                           }}
                           src={embedDetails.url} 
                           width="100%" 
                           height={embedDetails.height}
                           className={`${embedDetails.className} transition-all duration-300 shadow-sm border border-amber-950/40`}
                           frameBorder="0" 
                           scrolling="no"
                           allowFullScreen 
                           allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share" 
                           loading="lazy"
                         />
                      </div>
                    );
                  }
                  
                  if (platformInfo) {
                    const Icon = platformInfo.icon;
                    return (
                      <motion.a
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        key={link.id}
                        href={platformInfo.finalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 px-6 bg-[#261914]/40 hover:bg-[#261914]/80 backdrop-blur-sm border border-amber-950/40 hover:border-amber-600/30 shadow-sm hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
                        style={{ borderRadius: linkRadius }}
                      >
                        <div className="flex items-center text-[#f5ebd5] font-medium tracking-wide">
                          <Icon className="w-5 h-5 mr-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
                          <span className="truncate text-sm sm:text-base font-serif">{link.title}</span>
                        </div>
                        <span className="text-amber-600/80 group-hover:text-amber-500 text-xs font-mono tracking-wider transition-colors hidden sm:block">
                          {platformInfo.username || link.url.replace(/^https?:\/\//, '')}
                        </span>
                      </motion.a>
                    );
                  }

                  if (isUrl) {
                    return (
                      <motion.a
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 px-6 bg-[#261914]/40 hover:bg-[#261914]/80 backdrop-blur-sm border border-amber-950/40 hover:border-amber-600/30 shadow-sm hover:shadow-xl hover:shadow-black/40 transition-all duration-300"
                        style={{ borderRadius: linkRadius }}
                      >
                        <div className="flex items-center text-[#f5ebd5] font-medium tracking-wide">
                          <LinkIcon className="w-5 h-5 mr-4 text-amber-500 group-hover:text-amber-400 transition-colors" />
                          <span className="truncate text-sm sm:text-base font-serif">{link.title}</span>
                        </div>
                        <span className="text-amber-600/80 group-hover:text-amber-500 text-xs font-mono tracking-wider transition-colors hidden sm:block max-w-[150px] truncate">
                          {link.url.replace(/^https?:\/\//, '')}
                        </span>
                      </motion.a>
                    );
                  }

                  return (
                    <div
                      key={link.id}
                      className="group flex items-center justify-between p-4 px-6 bg-[#261914]/40 backdrop-blur-sm border border-amber-950/40 shadow-sm transition-all duration-300"
                      style={{ borderRadius: linkRadius }}
                    >
                      <div className="flex items-center text-[#f5ebd5] font-medium tracking-wide">
                        <div className="w-5 h-5 flex items-center justify-center mr-4 font-bold text-amber-500 font-serif">
                          {link.title ? link.title.charAt(0).toUpperCase() : '#'}
                        </div>
                        <span className="truncate text-sm sm:text-base font-serif">{link.title}</span>
                      </div>
                      <span className="text-amber-600/80 text-xs font-mono tracking-wider truncate max-w-[200px] sm:max-w-[300px]">
                        {link.url}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secret Message Form */}
          {profile.allowMessages && (
            <div className="pt-8 mt-4 border-t border-amber-900/20">
              <MessageForm 
                profileId={profile.id} 
                placeholderName={profile.messagePlaceholderName}
                placeholderContent={profile.messagePlaceholderContent}
                themeColors={{
                  primary: appliedColors.primary,
                  secondary: appliedColors.secondary,
                  accent: '#110c0a', // Use dark color for better contrast on gold button
                  background: appliedColors.background,
                  text: appliedColors.text,
                  inputBg: appliedColors.inputBg,
                  inputBorder: appliedColors.inputBorder
                }}
                themePreset={profile.themePreset}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
