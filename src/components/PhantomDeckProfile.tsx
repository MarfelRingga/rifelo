'use client';

import { motion } from 'motion/react';
import { 
  Mail, 
  Phone, 
  Globe, 
  Club, 
  FileText, 
  Feather, 
  Link as LinkIcon, 
  MessageCircle,
  Sparkles,
  ExternalLink,
  Palette,
  Briefcase
} from 'lucide-react';
import { Cinzel } from 'next/font/google';
import MessageForm from '@/app/(public)/u/[username]/MessageForm';
import { getPlatformInfo } from '@/lib/platforms';

const cinzel = Cinzel({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
});

// Custom SVGs for authentic playing card suits
const SpadeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C11.3 2 9.8 4.8 7.8 7.8C5.8 10.8 5 12.4 5 14C5 17.3 7.7 20 11 20C11.3 20 11.7 19.9 12 19.9C12.3 19.9 12.7 20 13 20C16.3 20 19 17.3 19 14C19 12.4 18.2 10.8 16.2 7.8C14.2 4.8 12.7 2 12 2ZM12 18V22H10C10 22 11 19.5 12 18Z" />
  </svg>
);

const HeartIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const DiamondIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2L3 12l9 10 9-10L12 2z" />
  </svg>
);

const ClubSvgIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <Club className={className} />
);

export default function PhantomDeckProfile({ profile, containerRadius }: { profile: any, containerRadius?: string }) {
  const getLinkRadius = (r: string | undefined): string => {
    if (r === 'sharp') return '0px';
    if (r === 'rounded') return '14px';
    if (r === 'pill') return '9999px';
    return '14px';
  };
  const linkRadius = getLinkRadius(profile.customTheme?.borderRadius as string | undefined);
  const deckContainerRadius = containerRadius || '24px';

  // Harmonized luxury color palette
  const appliedColors = {
    primary: '#d4af37', // Refined Antique Gold
    secondary: '#1c1310', // Deep obsidian wood
    accent: '#0d0806', // Contrast dark text on gold button
    background: '#0d0907', 
    text: '#f7eedb', // Warm parchment text
    cardBg: 'rgba(22, 15, 12, 0.88)', 
    cardBorder: 'rgba(212, 175, 55, 0.28)', 
    linkBg: 'rgba(32, 22, 17, 0.65)',
    linkBorder: 'rgba(212, 175, 55, 0.2)',
    inputBg: '#130c09',
    inputBorder: 'rgba(212, 175, 55, 0.3)'
  };

  return (
    <div className={`min-h-screen bg-[#0b0807] text-[#f7eedb] py-8 sm:py-10 px-4 flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#fdf8ee]`}>
      
      {/* 1. Deep Atmospheric Vignette & Candlelight Glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, rgba(68, 42, 28, 0.35) 0%, rgba(18, 12, 10, 0.8) 55%, #080605 100%)'
        }}
      />

      {/* 2. Delicate Floating Golden Embers & Arcane Watermarks */}
      <motion.div 
        animate={{ 
          opacity: [0.12, 0.24, 0.12],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-[#d4af37]/10 blur-[120px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ 
          opacity: [0.08, 0.18, 0.08],
          scale: [1, 1.12, 1]
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#8c1d1d]/10 blur-[130px] pointer-events-none z-0" 
      />

      {/* Floating Subtle Suit Watermarks */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <motion.div 
          animate={{ y: [-12, 12, -12], rotate: [-8, -4, -8] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-[6%] text-[#d4af37]/[0.04] hidden md:block"
        >
          <SpadeIcon className="w-36 h-36" />
        </motion.div>

        <motion.div 
          animate={{ y: [14, -14, 14], rotate: [6, 10, 6] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 right-[7%] text-[#d4af37]/[0.04] hidden md:block"
        >
          <HeartIcon className="w-40 h-40" />
        </motion.div>

        <motion.div 
          animate={{ y: [-8, 8, -8], rotate: [12, 8, 12] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[45%] right-[4%] text-[#d4af37]/[0.03] hidden lg:block"
        >
          <DiamondIcon className="w-28 h-28" />
        </motion.div>

        <motion.div 
          animate={{ y: [10, -10, 10], rotate: [-10, -6, -10] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[35%] left-[5%] text-[#d4af37]/[0.03] hidden lg:block"
        >
          <ClubSvgIcon className="w-32 h-32" />
        </motion.div>
      </div>

      {/* 3. Main Deck Container (The Master Playing Card) */}
      <motion.div 
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#1c130f]/95 via-[#160f0c]/95 to-[#110b09]/95 border border-[#d4af37]/30 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] backdrop-blur-xl p-6 sm:p-8 space-y-6 sm:space-y-8 mx-auto"
        style={{ borderRadius: deckContainerRadius }}
      >
        {/* Corner Card Indexes (Without Inner Border) */}
        <div 
          className="absolute inset-2.5 sm:inset-3 pointer-events-none"
          style={{ borderRadius: deckContainerRadius === '0px' ? '0px' : 'calc(24px - 10px)' }}
        >
          {/* Top-Left Playing Card Index */}
          <div className="absolute top-2.5 left-2.5 flex flex-col items-center leading-none text-[#d4af37]/40">
            <span className={`${cinzel.className} text-[11px] font-bold`}>A</span>
            <SpadeIcon className="w-2.5 h-2.5 mt-0.5" />
          </div>

          {/* Top-Right Pip */}
          <div className="absolute top-2.5 right-2.5 text-[#d4af37]/30">
            <DiamondIcon className="w-2.5 h-2.5" />
          </div>

          {/* Bottom-Left Pip */}
          <div className="absolute bottom-2.5 left-2.5 text-[#d4af37]/30">
            <ClubSvgIcon className="w-2.5 h-2.5" />
          </div>

          {/* Bottom-Right Playing Card Index (Inverted) */}
          <div className="absolute bottom-2.5 right-2.5 flex flex-col items-center leading-none text-[#d4af37]/40 rotate-180">
            <span className={`${cinzel.className} text-[11px] font-bold`}>A</span>
            <SpadeIcon className="w-2.5 h-2.5 mt-0.5" />
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col gap-6 w-full pt-2 sm:pt-3">
          
          {/* Header & Identity */}
          <div className="flex flex-col items-center text-center space-y-3">
            
            {/* Name */}
            <h1 className={`${cinzel.className} text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[#fdf8ee] text-balance`}>
              {profile.fullName}
            </h1>
            
            {/* School / Company */}
            {profile.company && (
              <p className="text-sm font-medium text-[#e2c77d]/80 tracking-wide mt-1">
                {profile.company}
              </p>
            )}
          </div>

          {/* Bio Section */}
          {(profile.jobTitle || profile.bio) && (
            <div className="flex flex-col items-center text-center space-y-4 pt-1">
              
              {/* Job Title Box */}
              {profile.jobTitle && (
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#271a14]/80 border border-[#d4af37]/30 text-[#d4af37] text-sm font-medium tracking-wide shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                  {profile.profileMode === 'creative' && <Palette className="w-4 h-4 opacity-80" />}
                  {profile.profileMode === 'professional' && <Briefcase className="w-4 h-4 opacity-80" />}
                  <span>{profile.jobTitle}</span>
                </div>
              )}
              
              {profile.bio && (
                <div className="space-y-2">
                  {profile.profileMode !== 'casual' && (
                    <div className={`${cinzel.className} text-[11px] font-semibold tracking-widest text-[#d4af37]/80 uppercase flex items-center justify-center gap-1.5`}>
                      {profile.profileMode === 'professional' && (
                        <>
                          <FileText className="w-3 h-3 text-[#d4af37]" />
                          <span>Professional Summary</span>
                        </>
                      )}
                      {profile.profileMode === 'creative' && (
                        <>
                          <Feather className="w-3 h-3 text-[#d4af37]" />
                          <span>Creative Statement</span>
                        </>
                      )}
                    </div>
                  )}
                  <p className="leading-relaxed text-[#ede0cb]/90 text-sm sm:text-base font-normal max-w-lg mx-auto whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Links & Platforms Section */}
          <div className="space-y-3 pt-4 w-full">
            {/* Portfolio Link (Creative only) */}
            {profile.profileMode === 'creative' && profile.website && (
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 bg-[#231712]/60 hover:bg-[#2d1e18]/90 border border-[#d4af37]/20 hover:border-[#d4af37]/50 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-200"
                style={{ borderRadius: linkRadius }}
              >
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl shrink-0" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                    <Globe className="w-5 h-5 text-[#d4af37] group-hover:text-[#f3d98b] transition-colors" />
                  </div>
                  <span className="truncate text-base font-bold text-[#f7eedb] group-hover:text-white transition-colors flex-1 text-left">Portfolio</span>
                </div>
              </a>
            )}

            {/* Email (Pro & Creative) */}
            {(profile.profileMode === 'professional' || profile.profileMode === 'creative') && profile.email && (
              <a 
                href={`mailto:${profile.email}`} 
                className="group flex items-center justify-between p-4 bg-[#231712]/60 hover:bg-[#2d1e18]/90 border border-[#d4af37]/20 hover:border-[#d4af37]/50 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-200"
                style={{ borderRadius: linkRadius }}
              >
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl shrink-0" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                    <Mail className="w-5 h-5 text-[#d4af37] group-hover:text-[#f3d98b] transition-colors" />
                  </div>
                  <span className="truncate text-base font-bold text-[#f7eedb] group-hover:text-white transition-colors flex-1 text-left">Email Me</span>
                </div>
              </a>
            )}

            {/* Phone (Casual & Pro) */}
            {(profile.profileMode === 'casual' || profile.profileMode === 'professional') && profile.phone && (
              <a 
                href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 bg-[#231712]/60 hover:bg-[#2d1e18]/90 border border-[#d4af37]/20 hover:border-[#d4af37]/50 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-200"
                style={{ borderRadius: linkRadius }}
              >
                <div className="flex items-center w-full">
                  <div className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl shrink-0" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                    {profile.profileMode === 'casual' ? (
                      <MessageCircle className="w-5 h-5 text-[#d4af37] group-hover:text-[#f3d98b] transition-colors" />
                    ) : (
                      <Phone className="w-5 h-5 text-[#d4af37] group-hover:text-[#f3d98b] transition-colors" />
                    )}
                  </div>
                  <span className="truncate text-base font-bold text-[#f7eedb] group-hover:text-white transition-colors flex-1 text-left">WhatsApp</span>
                </div>
              </a>
            )}

            {profile.links.length > 0 && (
              <>
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
                      height = "80";
                    }
                    embedDetails = { url: urlObj.toString(), height, className: "w-full" };
                  }
                  // 2. YouTube & Shorts
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
                        height: "240", 
                        className: "w-full aspect-video sm:h-[280px]" 
                      };
                    }
                  }
                  // 3. TikTok
                  else if (urlObj.hostname.includes('tiktok.com')) {
                    const match = urlObj.pathname.match(/\/video\/(\d+)/);
                    if (match && match[1]) {
                      embedDetails = { 
                        url: `https://www.tiktok.com/embed/v2/${match[1]}`, 
                        height: "580", 
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
                    const scUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(link.url)}&color=%23d4af37&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
                    embedDetails = { url: scUrl, height: "166", className: "w-full" };
                  }
                } catch (e) {
                  // Fallback for invalid URLs handled by standard button
                }

                if (embedDetails) {
                  return (
                    <div key={link.id} className="w-full my-3 flex justify-center overflow-hidden">
                      <iframe 
                        style={{ 
                          borderRadius: linkRadius === '0px' ? '0px' : '14px',
                          backgroundColor: 'transparent',
                          maxWidth: '100%',
                          overflow: 'hidden'
                        }}
                        src={embedDetails.url} 
                        width="100%" 
                        height={embedDetails.height}
                        className={`${embedDetails.className} transition-all duration-300 shadow-lg border border-[#d4af37]/25`}
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
                      className="group flex items-center justify-between p-4 bg-[#231712]/60 hover:bg-[#2d1e18]/90 border border-[#d4af37]/20 hover:border-[#d4af37]/50 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-200"
                      style={{ borderRadius: linkRadius }}
                    >
                      <div className="flex items-center w-full">
                        <div className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl shrink-0" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                          <Icon className="w-5 h-5 text-[#d4af37] group-hover:text-[#f3d98b] transition-colors" />
                        </div>
                        <div className="flex flex-col flex-1 text-left">
                          <span className="font-bold text-[#f7eedb] group-hover:text-white transition-colors">{link.title}</span>
                          <span className="text-xs opacity-60 text-[#d4af37]/70 group-hover:text-[#d4af37] transition-colors truncate max-w-[200px] sm:max-w-[300px]">{platformInfo.username || link.url}</span>
                        </div>
                      </div>
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
                      className="group flex items-center justify-between p-4 bg-[#231712]/60 hover:bg-[#2d1e18]/90 border border-[#d4af37]/20 hover:border-[#d4af37]/50 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-200"
                      style={{ borderRadius: linkRadius }}
                    >
                      <div className="flex items-center w-full">
                        <div className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl shrink-0" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                          <LinkIcon className="w-5 h-5 text-[#d4af37] group-hover:text-[#f3d98b] transition-colors" />
                        </div>
                        <div className="flex flex-col flex-1 text-left">
                          <span className="font-bold text-[#f7eedb] group-hover:text-white transition-colors">{link.title}</span>
                          <span className="text-xs opacity-60 text-[#d4af37]/70 group-hover:text-[#d4af37] transition-colors truncate max-w-[200px] sm:max-w-[300px]">{link.url.replace(/^https?:\/\//, '')}</span>
                        </div>
                      </div>
                    </motion.a>
                  );
                }

                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 bg-[#231712]/60 border border-[#d4af37]/20 shadow-sm transition-all"
                    style={{ borderRadius: linkRadius }}
                  >
                    <div className="flex items-center w-full">
                      <div className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm font-bold opacity-80 rounded-xl shrink-0" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                        <span className={`${cinzel.className} text-base text-[#d4af37]`}>
                          {link.title ? link.title.charAt(0).toUpperCase() : '#'}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 text-left">
                        <span className="font-bold text-[#f7eedb]">{link.title}</span>
                        <span className="text-xs text-[#d4af37]/60 truncate max-w-[200px] sm:max-w-[300px]">{link.url}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              </>
            )}
          </div>

          {/* Secret Message Form */}
          {profile.allowMessages && (
            <div className="pt-6 mt-2 border-t border-[#d4af37]/20">
              <MessageForm 
                profileId={profile.id} 
                placeholderName={profile.messagePlaceholderName}
                placeholderContent={profile.messagePlaceholderContent}
                themeColors={{
                  primary: appliedColors.primary,
                  secondary: appliedColors.secondary,
                  accent: appliedColors.accent,
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
