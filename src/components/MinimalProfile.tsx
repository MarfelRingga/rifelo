import React from 'react';
import { Mail, Globe, MessageCircle, Phone, Link as LinkIcon, Palette, Briefcase } from 'lucide-react';
import { getPlatformInfo } from '@/lib/platforms';
import MessageForm from '@/app/(public)/u/[username]/MessageForm';
import { cn } from '@/lib/utils';

function getLinkContrast(bgColor?: string) {
  if (!bgColor || bgColor === '#ffffff' || bgColor === '#f8fafc' || bgColor === 'transparent') {
    return {
      isAccent: false,
      textColor: '#0f172a',
      subtextColor: 'rgba(15, 23, 42, 0.6)',
      iconBg: 'rgba(0, 0, 0, 0.05)',
      iconColor: 'inherit',
    };
  }

  let hex = bgColor.replace('#', '').trim();
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    const isLight = yiq >= 145;

    return {
      isAccent: true,
      textColor: isLight ? '#0a0a0a' : '#ffffff',
      subtextColor: isLight ? 'rgba(10, 10, 10, 0.7)' : 'rgba(255, 255, 255, 0.75)',
      iconBg: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.16)',
      iconColor: isLight ? '#0a0a0a' : '#ffffff',
    };
  }

  return {
    isAccent: false,
    textColor: '#0f172a',
    subtextColor: 'rgba(15, 23, 42, 0.6)',
    iconBg: 'rgba(0, 0, 0, 0.05)',
    iconColor: 'inherit',
  };
}

export default function MinimalProfile({ 
  profile, 
  theme, 
  appliedColors, 
  linkRadius, 
  containerRadius,
  isGlass = false 
}: any) {
  const isGlassTheme = isGlass || profile.themePreset === 'glassmorphism';
  const accentVal = profile.customTheme?.accent?.value;
  const linkBgColor = appliedColors.linkBg || appliedColors.cardBg;
  const linkBorderColor = appliedColors.linkBorder || appliedColors.cardBorder;
  const linkContrast = getLinkContrast(appliedColors.linkBg);

  // Box Glassmorphism calculation:
  // When Glass theme is active, boxes get true frosted glass physics with maximum readability:
  // luminous frosted fill, 1px bright edge reflection, subtle border definition, and high-contrast dark text
  const effectiveLinkBg = isGlassTheme
    ? (accentVal ? `color-mix(in srgb, ${accentVal} 14%, rgba(255, 255, 255, 0.88))` : 'rgba(255, 255, 255, 0.86)')
    : linkBgColor;

  const effectiveLinkBorder = isGlassTheme
    ? (accentVal ? `${accentVal}60` : 'rgba(0, 0, 0, 0.1)')
    : linkBorderColor;

  const effectiveLinkShadow = isGlassTheme
    ? '0 4px 16px -2px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.95), 0 0 0 1px rgba(0, 0, 0, 0.03)'
    : undefined;

  const effectiveIconBg = isGlassTheme
    ? 'rgba(255, 255, 255, 0.96)'
    : linkContrast.iconBg;

  const effectiveIconBorder = isGlassTheme
    ? '1px solid rgba(0, 0, 0, 0.09)'
    : undefined;

  // Crucial contrast fix: In Glass theme, the box surface is always a light translucent frosted surface.
  // Therefore, text MUST always be high-contrast dark (#090d16) and subtitle (#334155),
  // NEVER white (which was happening when linkContrast treated accentVal as a dark solid background).
  const effectiveTextColor = isGlassTheme ? '#090d16' : linkContrast.textColor;
  const effectiveSubtextColor = isGlassTheme ? '#334155' : linkContrast.subtextColor;
  const effectiveIconColor = isGlassTheme 
    ? (accentVal || '#090d16') 
    : linkContrast.iconColor;

  // Consolidate links:
  // We'll combine custom links, website, email, and phone into one unified stack
  return (
    <div 
      className="min-h-screen py-8 sm:py-10 px-4 flex flex-col items-center justify-start transition-colors duration-500 relative"
      style={{
        background: isGlassTheme ? 'transparent' : appliedColors.background,
        color: appliedColors.text,
        fontFamily: theme.fonts.body
      }}
    >
      {/* Fixed Ambient Background & Moving Light Orbs: stationary on scroll to maximize glass refraction */}
      {isGlassTheme && (
        <div 
          className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0" 
          aria-hidden="true"
          style={{
            background: appliedColors.background
          }}
        >
          {/* Orb 1: Soft Sky Blue / Cyan drifting orb */}
          <div 
            className="absolute -top-16 -left-20 w-80 h-80 sm:w-[26rem] sm:h-[26rem] rounded-full blur-3xl opacity-60 animate-glass-orb-1"
            style={{
              background: accentVal 
                ? `radial-gradient(circle, ${accentVal}45 0%, ${accentVal}00 70%)` 
                : 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(56, 189, 248, 0) 70%)'
            }}
          />
          {/* Orb 2: Elegant Soft Indigo / Violet drifting orb */}
          <div 
            className="absolute top-1/4 -right-16 w-88 h-88 sm:w-[30rem] sm:h-[30rem] rounded-full blur-3xl opacity-50 animate-glass-orb-2"
            style={{
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(99, 102, 241, 0) 70%)'
            }}
          />
          {/* Orb 3: Gentle Warm Rose / Accent drifting orb */}
          <div 
            className="absolute top-2/3 -left-12 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-45 animate-glass-orb-3"
            style={{
              background: accentVal
                ? `radial-gradient(circle, ${accentVal}35 0%, ${accentVal}00 70%)`
                : 'radial-gradient(circle, rgba(244, 114, 182, 0.35) 0%, rgba(244, 114, 182, 0) 70%)'
            }}
          />
          {/* Orb 4: Subtle Mint / Teal drifting orb */}
          <div 
            className="absolute -bottom-16 right-4 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-40 animate-glass-orb-4"
            style={{
              background: 'radial-gradient(circle, rgba(45, 212, 191, 0.3) 0%, rgba(45, 212, 191, 0) 70%)'
            }}
          />
        </div>
      )}

      <div 
        className={cn(
          "relative z-10 w-full max-w-2xl mx-auto p-6 sm:p-8 space-y-6 sm:space-y-8 transition-all duration-500",
          isGlassTheme 
            ? "backdrop-blur-xl" 
            : "backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        )}
        style={{
          background: isGlassTheme ? 'rgba(255, 255, 255, 0.72)' : appliedColors.cardBg,
          borderRadius: containerRadius || '24px',
          border: isGlassTheme ? '1px solid rgba(255, 255, 255, 0.9)' : `1px solid ${appliedColors.cardBorder}`,
          boxShadow: isGlassTheme 
            ? '0 20px 50px -10px rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.95)' 
            : undefined
        }}
      >
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="space-y-1">
            <h1 
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ 
                fontFamily: theme.fonts.heading,
                color: isGlassTheme ? '#090d16' : appliedColors.text
              }}
            >
              {profile.fullName}
            </h1>
            
            {/* School / Company extracted as subtle subtitle */}
            {profile.company && (
              <p 
                className="text-sm font-semibold"
                style={{ color: isGlassTheme ? '#334155' : 'inherit', opacity: isGlassTheme ? 1 : 0.6 }}
              >
                {profile.company}
              </p>
            )}
          </div>

          {(profile.jobTitle || profile.bio) && (
            <div className="max-w-xl mx-auto space-y-4 pt-2">
              {profile.jobTitle && (
                <div 
                  className={cn(
                    "inline-flex items-center justify-center px-4 py-2 font-bold shadow-xs transition-all",
                    isGlassTheme && "backdrop-blur-md"
                  )}
                  style={{
                    background: isGlassTheme
                      ? (accentVal ? `color-mix(in srgb, ${accentVal} 14%, rgba(255, 255, 255, 0.92))` : 'rgba(255, 255, 255, 0.92)')
                      : (accentVal ? `${accentVal}15` : 'rgba(0,0,0,0.03)'),
                    border: isGlassTheme
                      ? `1px solid ${accentVal ? `${accentVal}50` : 'rgba(0, 0, 0, 0.1)'}`
                      : `1px solid ${accentVal ? `${accentVal}35` : appliedColors.cardBorder}`,
                    borderRadius: '14px',
                    color: '#090d16',
                    boxShadow: isGlassTheme ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.95), 0 2px 8px rgba(0,0,0,0.04)' : undefined
                  }}
                >
                  {profile.profileMode === 'creative' && <Palette className="w-4 h-4 mr-2" style={{ color: accentVal || '#090d16' }} />}
                  {profile.profileMode === 'professional' && <Briefcase className="w-4 h-4 mr-2" style={{ color: accentVal || '#090d16' }} />}
                  <p className="text-sm font-bold text-[#090d16]">{profile.jobTitle}</p>
                </div>
              )}
              
              {profile.bio && (
                <p 
                  className="leading-relaxed whitespace-pre-wrap text-[15px] font-medium"
                  style={{ color: isGlassTheme ? '#1e293b' : 'inherit', opacity: isGlassTheme ? 1 : 0.9 }}
                >
                  {profile.bio}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Links & Action Section */}
        <div className="space-y-4 w-full">
          {/* We'll render website, email, phone, and standard links uniformly */}
          
          {/* Website / Portfolio */}
          {profile.profileMode === 'creative' && profile.website && (
            <a 
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex items-center justify-between p-4 transition-all hover:scale-[1.01]",
                isGlassTheme ? "backdrop-blur-md hover:bg-white/95" : "shadow-xs"
              )}
              style={{ 
                background: effectiveLinkBg,
                border: `1px solid ${effectiveLinkBorder}`,
                borderRadius: linkRadius,
                color: effectiveTextColor,
                boxShadow: effectiveLinkShadow
              }}
            >
              <div className="flex items-center w-full">
                <div 
                  className="w-10 h-10 flex items-center justify-center mr-4 rounded-xl shrink-0 transition-transform group-hover:scale-110 shadow-2xs"
                  style={{ 
                    background: effectiveIconBg, 
                    color: effectiveIconColor,
                    border: effectiveIconBorder 
                  }}
                >
                  <Globe className="w-5 h-5" style={{ color: effectiveIconColor }} />
                </div>
                <span className="truncate font-extrabold flex-1 text-left text-[15px]" style={{ color: effectiveTextColor }}>Portfolio</span>
              </div>
            </a>
          )}

          {/* Email */}
          {(profile.profileMode === 'professional' || profile.profileMode === 'creative') && profile.email && (
            <a 
              href={`mailto:${profile.email}`} 
              className={cn(
                "group flex items-center justify-between p-4 transition-all hover:scale-[1.01]",
                isGlassTheme ? "backdrop-blur-md hover:bg-white/95" : "shadow-xs"
              )}
              style={{ 
                background: effectiveLinkBg,
                border: `1px solid ${effectiveLinkBorder}`,
                borderRadius: linkRadius,
                color: effectiveTextColor,
                boxShadow: effectiveLinkShadow
              }}
            >
              <div className="flex items-center w-full">
                <div 
                  className="w-10 h-10 flex items-center justify-center mr-4 rounded-xl shrink-0 transition-transform group-hover:scale-110 shadow-2xs"
                  style={{ 
                    background: effectiveIconBg, 
                    color: effectiveIconColor,
                    border: effectiveIconBorder 
                  }}
                >
                  <Mail className="w-5 h-5" style={{ color: effectiveIconColor }} />
                </div>
                <span className="truncate font-extrabold flex-1 text-left text-[15px]" style={{ color: effectiveTextColor }}>Email Me</span>
              </div>
            </a>
          )}

          {/* WhatsApp / Phone */}
          {(profile.profileMode === 'casual' || profile.profileMode === 'professional') && profile.phone && (
            <a 
              href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} 
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex items-center justify-between p-4 transition-all hover:scale-[1.01]",
                isGlassTheme ? "backdrop-blur-md hover:bg-white/95" : "shadow-xs"
              )}
              style={{ 
                background: effectiveLinkBg,
                border: `1px solid ${effectiveLinkBorder}`,
                borderRadius: linkRadius,
                color: effectiveTextColor,
                boxShadow: effectiveLinkShadow
              }}
            >
              <div className="flex items-center w-full">
                <div 
                  className="w-10 h-10 flex items-center justify-center mr-4 rounded-xl shrink-0 transition-transform group-hover:scale-110 shadow-2xs"
                  style={{ 
                    background: isGlassTheme 
                      ? 'rgba(37, 211, 102, 0.15)' 
                      : (linkContrast.isAccent ? effectiveIconBg : 'rgba(37, 211, 102, 0.1)'), 
                    color: '#16a34a',
                    border: isGlassTheme ? '1px solid rgba(37, 211, 102, 0.3)' : effectiveIconBorder
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="truncate font-extrabold flex-1 text-left text-[15px]" style={{ color: effectiveTextColor }}>WhatsApp</span>
              </div>
            </a>
          )}

          {/* Standard Links */}
          {profile.links?.map((link: any) => {
            const platformInfo = getPlatformInfo(link.title, link.url);
            const isUrl = link.url.startsWith('http://') || link.url.startsWith('https://');
            
            // Gen-Z Media Platforms Embed Support
            let embedDetails: { url: string; height: string; className: string } | null = null;
            try {
              const urlObj = new URL(link.url);
              if (urlObj.hostname.includes('spotify.com')) {
                if (!urlObj.pathname.startsWith('/embed')) urlObj.pathname = '/embed' + urlObj.pathname;
                urlObj.searchParams.set('utm_source', 'generator');
                let height = "152";
                if (urlObj.pathname.includes('/playlist/') || urlObj.pathname.includes('/album/') || urlObj.pathname.includes('/artist/') || urlObj.pathname.includes('/show/')) {
                  height = "352";
                } else if (urlObj.pathname.includes('/track/') || urlObj.pathname.includes('/episode/')) {
                  height = "80"; 
                }
                embedDetails = { url: urlObj.toString(), height, className: "w-full" };
              }
              else if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                let videoId = urlObj.searchParams.get('v');
                if (urlObj.hostname.includes('youtu.be')) videoId = urlObj.pathname.slice(1);
                else if (urlObj.pathname.startsWith('/shorts/')) videoId = urlObj.pathname.split('/')[2];
                if (videoId) {
                  embedDetails = { 
                    url: `https://www.youtube.com/embed/${videoId}`, 
                    height: "250", 
                    className: "w-full aspect-video sm:h-[300px]" 
                  };
                }
              }
              else if (urlObj.hostname.includes('tiktok.com')) {
                const match = urlObj.pathname.match(/\/video\/(\d+)/);
                if (match && match[1]) {
                  embedDetails = { 
                    url: `https://www.tiktok.com/embed/v2/${match[1]}`, 
                    height: "600", 
                    className: "w-full max-w-[325px] mx-auto bg-black" 
                  };
                }
              }
              else if (urlObj.hostname.includes('music.apple.com')) {
                const amUrl = link.url.replace('music.apple.com', 'embed.music.apple.com');
                const height = (urlObj.pathname.includes('/album/') || urlObj.pathname.includes('/playlist/')) && !urlObj.searchParams.has('i') ? "450" : "150";
                embedDetails = { url: amUrl, height, className: "w-full" };
              }
              else if (urlObj.hostname.includes('soundcloud.com')) {
                const scUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(link.url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
                embedDetails = { url: scUrl, height: "166", className: "w-full" };
              }
            } catch (e) {}

            if (embedDetails) {
              return (
                <div key={link.id} className="w-full my-6 flex justify-center overflow-hidden">
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
                      className={`${embedDetails.className} transition-all duration-300 shadow-sm`}
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
                <a
                  key={link.id}
                  href={platformInfo.finalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group flex items-center justify-between p-4 transition-all hover:scale-[1.01]",
                    isGlassTheme ? "backdrop-blur-md hover:bg-white/95" : "shadow-xs"
                  )}
                  style={{ 
                    background: effectiveLinkBg,
                    border: `1px solid ${effectiveLinkBorder}`,
                    borderRadius: linkRadius,
                    color: effectiveTextColor,
                    boxShadow: effectiveLinkShadow
                  }}
                >
                  <div className="flex items-center w-full">
                    <div 
                      className="w-10 h-10 flex items-center justify-center mr-4 rounded-xl shrink-0 transition-transform group-hover:scale-110 shadow-2xs"
                      style={{ 
                        background: effectiveIconBg, 
                        color: effectiveIconColor,
                        border: effectiveIconBorder 
                      }}
                    >
                      <Icon className={`w-5 h-5 ${isGlassTheme ? '' : (linkContrast.isAccent ? '' : platformInfo.color.replace('text-', ''))}`} style={{ color: isGlassTheme ? (accentVal || '#090d16') : undefined }} />
                    </div>
                    <div className="flex flex-col flex-1 text-left">
                      <span className="font-extrabold text-[15px]" style={{ color: effectiveTextColor }}>{link.title}</span>
                      <span className="text-xs truncate max-w-[200px] sm:max-w-[300px] font-semibold" style={{ color: effectiveSubtextColor }}>
                        {platformInfo.username || link.url}
                      </span>
                    </div>
                  </div>
                </a>
              );
            }

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex items-center justify-between p-4 transition-all hover:scale-[1.01]",
                  isGlassTheme ? "backdrop-blur-md hover:bg-white/95" : "shadow-xs"
                )}
                style={{ 
                  background: effectiveLinkBg,
                  border: `1px solid ${effectiveLinkBorder}`,
                  borderRadius: linkRadius,
                  color: effectiveTextColor,
                  boxShadow: effectiveLinkShadow
                }}
              >
                <div className="flex items-center w-full">
                  <div 
                    className="w-10 h-10 flex items-center justify-center mr-4 rounded-xl shrink-0 transition-transform group-hover:scale-110 shadow-2xs"
                    style={{ 
                      background: effectiveIconBg, 
                      color: effectiveIconColor,
                      border: effectiveIconBorder 
                    }}
                  >
                    <LinkIcon className="w-5 h-5" style={{ color: effectiveIconColor }} />
                  </div>
                  <div className="flex flex-col flex-1 text-left">
                    <span className="font-extrabold text-[15px]" style={{ color: effectiveTextColor }}>{link.title}</span>
                    {isUrl && (
                      <span className="text-xs truncate max-w-[200px] sm:max-w-[300px] font-semibold" style={{ color: effectiveSubtextColor }}>
                        {link.url.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Message Box */}
        {profile.allowMessages && (
          <div className={cn(
            "w-full pt-8 mt-8 border-t",
            isGlassTheme ? "border-slate-200/80" : "border-black/5 dark:border-white/5"
          )}>
            <MessageForm 
              profileId={profile.id} 
              placeholderName={profile.messagePlaceholderName}
              placeholderContent={profile.messagePlaceholderContent}
              themePreset={profile.themePreset}
              themeColors={{
                primary: appliedColors.primary,
                secondary: appliedColors.secondary,
                accent: appliedColors.accent,
                background: appliedColors.background,
                text: isGlassTheme ? '#090d16' : appliedColors.text,
                inputBg: isGlassTheme ? 'rgba(255, 255, 255, 0.9)' : appliedColors.cardBg,
                inputBorder: isGlassTheme ? 'rgba(0, 0, 0, 0.12)' : appliedColors.cardBorder
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
