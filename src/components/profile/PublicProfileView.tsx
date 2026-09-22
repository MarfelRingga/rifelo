import React from 'react';
import { 
  Briefcase, 
  Mail, 
  Link as LinkIcon, 
  Globe,
  Palette,
  Phone,
  FileText,
  Feather,
  MessageCircle
} from 'lucide-react';
import { getPlatformInfo } from '@/lib/platforms';
import { themePresets, getTheme } from '@/lib/themePresets';
import HeroBrutalism from '@/components/HeroBrutalism';
import PhantomDeckProfile from '@/components/PhantomDeckProfile';
import MinimalProfile from '@/components/MinimalProfile';
import MessageForm from '@/app/(public)/u/[username]/MessageForm';

export default function PublicProfileView({ profile }: { profile: any }) {
  // Apply Theme
  const theme = getTheme(profile.themePreset) || themePresets.minimal;
  
  // Custom theme overrides: Accent applies to "minimal" and "glassmorphism" themes
  const isMinimal = profile.themePreset === 'minimal';
  const isGlass = profile.themePreset === 'glassmorphism';
  const accentVal = profile.customTheme?.accent?.value;
  const appliedColors = (isMinimal || isGlass)
    ? {
        ...theme.colors,
        ...(profile.customTheme?.colors || {}),
        ...(accentVal ? {
          primary: accentVal,
          accent: accentVal,
          linkBg: accentVal,
          linkBorder: accentVal,
        } : {})
      }
    : {
        ...theme.colors,
        ...(profile.themePreset !== 'brutalism' ? (profile.customTheme?.colors || {}) : {})
      };

  const appliedFont = profile.customTheme?.fontFamily || theme.fonts.body;
  const appliedHeadingFont = profile.customTheme?.fontFamily === 'var(--font-heading), system-ui, serif' ? 'var(--font-heading), system-ui, serif' : theme.fonts.heading;
  
  const appliedTheme = {
    ...theme,
    fonts: {
      ...theme.fonts,
      body: appliedFont,
      heading: appliedHeadingFont,
    }
  };

  const isGradientBg = appliedColors.background.includes('gradient');
  const isGradientCardBg = appliedColors.cardBg.includes('gradient');

  const getRadiusSystem = (r: string | undefined): { link: string, container: string } => {
    if (r === 'sharp') return { link: '0px', container: '0px' };
    if (r === 'pill') return { link: '9999px', container: '32px' };
    return { link: '12px', container: '24px' }; // Default to Rifelo Standard
  };
  const { link: linkRadius, container: containerRadius } = getRadiusSystem(profile.customTheme?.borderRadius as string | undefined);

  if (profile.themePreset === 'phantom-deck') {
    return <PhantomDeckProfile profile={profile} containerRadius={containerRadius} />; // PhantomDeck handles its own theme styling with consistent containerRadius
  }

  if (profile.themePreset === 'minimal' || profile.themePreset === 'glassmorphism') {
    return (
      <MinimalProfile 
        profile={profile} 
        theme={appliedTheme} 
        appliedColors={appliedColors} 
        linkRadius={linkRadius} 
        containerRadius={containerRadius} 
        isGlass={isGlass}
      />
    );
  }

  // Normal Profile View
  return (
    <div 
      className={`min-h-screen py-8 sm:py-10 px-4 flex flex-col items-center justify-start transition-colors duration-500 relative`}
      style={{
        background: appliedColors.background,
        color: profile.themePreset === 'brutalism' ? '#ffffff' : appliedColors.text,
        fontFamily: appliedFont
      }}
    >
      {profile.themePreset === 'brutalism' && (
        <HeroBrutalism mainText="" />
      )}
      
      <div 
        className={`relative z-10 w-full max-w-2xl p-6 sm:p-8 space-y-6 sm:space-y-8 transition-all duration-500 mx-auto ${profile.themePreset === 'brutalism' ? 'backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : 'shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm'}`}
        style={{
          background: appliedColors.cardBg,
          borderRadius: containerRadius,
          border: `1px solid ${appliedColors.cardBorder}`
        }}
      >
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 pt-2">
          <div className="space-y-1 flex flex-col items-center">
            <h1 
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${profile.themePreset === 'gradient' ? 'px-4 py-1.5 rounded-xl backdrop-blur-md shadow-sm' : ''} ${profile.themePreset === 'brutalism' ? 'text-white' : ''}`}
              style={{ 
                fontFamily: appliedHeadingFont,
                ...(profile.themePreset === 'gradient'
                  ? {
                      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderLeft: '4px solid #818cf8',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }
                  : {})
              }}
            >
              {profile.fullName || 'Your Name'}
            </h1>
            
            {/* School / Company extracted as subtle subtitle */}
            {profile.company && (
              <p className={`text-sm font-medium opacity-60 ${profile.themePreset === 'brutalism' ? 'text-white' : ''}`} style={profile.themePreset === 'brutalism' ? {} : { color: appliedColors.text }}>
                {profile.company}
              </p>
            )}
          </div>

          {(profile.jobTitle || profile.bio) && (
            <div className="max-w-xl mx-auto space-y-4 pt-2">
              {profile.jobTitle && (
                <div 
                  className={`inline-flex items-center justify-center px-4 py-2 font-medium shadow-sm transition-all ${
                    profile.themePreset === 'brutalism' 
                      ? 'bg-black/40 border border-white/20 text-white rounded-none shadow-[4px_4px_0px_rgba(255,255,255,0.2)]' 
                      : profile.themePreset === 'gradient'
                      ? 'bg-white/10 border border-white/20 text-white rounded-2xl backdrop-blur-md shadow-lg'
                      : profile.themePreset === 'glassmorphism'
                      ? 'bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl text-white'
                      : 'bg-black/5 dark:bg-white/10 rounded-xl border border-black/5 dark:border-white/5'
                  }`}
                  style={profile.themePreset !== 'brutalism' && profile.themePreset !== 'gradient' && profile.themePreset !== 'glassmorphism' ? {
                    color: appliedColors.text,
                    borderColor: appliedColors.cardBorder
                  } : {}}
                >
                  {profile.profileMode === 'creative' && <Palette className="w-4 h-4 mr-2 opacity-70 shrink-0" />}
                  {profile.profileMode === 'professional' && <Briefcase className="w-4 h-4 mr-2 opacity-70 shrink-0" />}
                  <p className="text-sm">{profile.jobTitle}</p>
                </div>
              )}
              
              {profile.bio && (
                <div className="space-y-2">
                  {profile.profileMode !== 'casual' && (
                    <h2 
                      className={`text-sm font-bold uppercase tracking-widest opacity-60 flex items-center justify-center ${profile.themePreset === 'brutalism' ? 'text-white' : ''}`}
                      style={profile.themePreset === 'brutalism' ? {} : { color: appliedColors.text }}
                    >
                      {profile.profileMode === 'professional' && <><FileText className="w-4 h-4 mr-2" /> Summary</>}
                      {profile.profileMode === 'creative' && <><Feather className="w-4 h-4 mr-2" /> Vision</>}
                    </h2>
                  )}
                  <p className={`leading-relaxed whitespace-pre-wrap opacity-90 text-[15px] ${profile.themePreset === 'brutalism' ? 'text-white' : ''}`} style={profile.themePreset === 'brutalism' ? {} : { color: appliedColors.text }}>
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Links & Action Section */}
        <div className="space-y-4 w-full pt-4">
          
          {/* Portfolio Link */}
          {profile.profileMode === 'creative' && profile.website && (
            <a 
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 transition-all group hover:scale-[1.01]"
              style={{ 
                background: appliedColors.linkBg || appliedColors.secondary,
                borderColor: appliedColors.linkBorder || 'transparent',
                borderWidth: '1px',
                borderRadius: linkRadius
              }}
            >
              <div className="flex items-center w-full">
                <div 
                  className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl shrink-0"
                  style={{ background: appliedColors.background }}
                >
                  <Globe className="w-5 h-5 opacity-70" style={{ color: appliedColors.primary }} />
                </div>
                <span className={`truncate font-bold flex-1 text-left ${profile.themePreset === 'brutalism' ? 'text-white' : ''}`} style={profile.themePreset === 'brutalism' ? {} : { color: appliedColors.text }}>Portfolio</span>
              </div>
            </a>
          )}

          {/* Email */}
          {(profile.profileMode === 'professional' || profile.profileMode === 'creative') && profile.email && (
            <a 
              href={`mailto:${profile.email}`} 
              className="flex items-center p-4 transition-all group hover:scale-[1.01]"
              style={{ 
                background: appliedColors.linkBg || appliedColors.secondary,
                borderColor: appliedColors.linkBorder || 'transparent',
                borderWidth: '1px',
                borderRadius: linkRadius
              }}
            >
              <div className="flex items-center w-full">
                <div 
                  className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl shrink-0"
                  style={{ background: appliedColors.background }}
                >
                  <Mail className="w-5 h-5 opacity-70" style={{ color: appliedColors.primary }} />
                </div>
                <span className={`truncate font-bold flex-1 text-left ${profile.themePreset === 'brutalism' ? 'text-white' : ''}`} style={profile.themePreset === 'brutalism' ? {} : { color: appliedColors.text }}>Email Me</span>
              </div>
            </a>
          )}

          {/* WhatsApp / Phone */}
          {(profile.profileMode === 'casual' || profile.profileMode === 'professional') && profile.phone && (
            <a 
              href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 transition-all group hover:scale-[1.01]"
              style={{ 
                background: appliedColors.linkBg || appliedColors.secondary,
                borderColor: appliedColors.linkBorder || 'transparent',
                borderWidth: '1px',
                borderRadius: linkRadius
              }}
            >
              <div className="flex items-center w-full">
                <div 
                  className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl shrink-0"
                  style={{ background: appliedColors.background }}
                >
                  {profile.profileMode === 'casual' ? (
                    <MessageCircle className="w-5 h-5 opacity-70" style={{ color: appliedColors.primary }} />
                  ) : (
                    <Phone className="w-5 h-5 opacity-70" style={{ color: appliedColors.primary }} />
                  )}
                </div>
                <span className={`truncate font-bold flex-1 text-left ${profile.themePreset === 'brutalism' ? 'text-white' : ''}`} style={profile.themePreset === 'brutalism' ? {} : { color: appliedColors.text }}>WhatsApp</span>
              </div>
            </a>
          )}

          {/* Standard Links */}
          {profile.links && profile.links.length > 0 && (
            <>
              {profile.links.map((link: any) => {
                const platformInfo = getPlatformInfo(link.title, link.url);
                const isUrl = link.url.startsWith('http://') || link.url.startsWith('https://');
                
                const linkStyle = {
                  background: appliedColors.linkBg || appliedColors.secondary,
                  borderColor: appliedColors.linkBorder || 'transparent',
                  borderWidth: '1px',
                  borderRadius: linkRadius
                };

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
                      className="flex items-center justify-between p-4 transition-all group hover:scale-[1.01]"
                      style={{ ...linkStyle, color: appliedColors.text }}
                    >
                      <div className="flex items-center w-full">
                        <div 
                          className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl"
                          style={{ 
                            background: appliedColors.background
                          }}
                        >
                          <Icon className={`w-5 h-5 ${profile.themePreset === 'gradient' ? 'text-white' : platformInfo.color.replace('text-', '')}`} 
                            style={profile.themePreset !== 'gradient' ? {} : undefined} />
                        </div>
                        <div className="flex flex-col flex-1 text-left">
                          <span className="font-bold">{link.title}</span>
                          <span className="text-xs opacity-60">{platformInfo.username || link.url}</span>
                        </div>
                      </div>
                    </a>
                  );
                }

                if (isUrl) {
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 transition-all group hover:scale-[1.01]"
                      style={{ ...linkStyle, color: appliedColors.text }}
                    >
                      <div className="flex items-center w-full">
                        <div 
                          className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform rounded-xl"
                          style={{ 
                            background: appliedColors.background 
                          }}
                        >
                          <LinkIcon className="w-5 h-5 opacity-60 group-hover:opacity-100" style={{ color: appliedColors.primary }} />
                        </div>
                        <div className="flex flex-col flex-1 text-left">
                          <span className="font-bold">{link.title}</span>
                          <span className="text-xs opacity-50 truncate max-w-[150px] sm:max-w-[200px]">{link.url.replace(/^https?:\/\//, '')}</span>
                        </div>
                      </div>
                    </a>
                  );
                }

                return (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 transition-all"
                    style={{ ...linkStyle, color: appliedColors.text }}
                  >
                    <div className="flex items-center w-full">
                      <div 
                        className="w-10 h-10 flex items-center justify-center mr-4 shadow-sm font-bold opacity-80 rounded-xl"
                        style={{ 
                          background: appliedColors.background, 
                          color: appliedColors.primary
                        }}
                      >
                        {link.title ? link.title.charAt(0).toUpperCase() : '#'}
                      </div>
                      <div className="flex flex-col flex-1 text-left">
                        <span className="font-bold">{link.title}</span>
                        <span className="text-xs opacity-60 truncate max-w-[200px] sm:max-w-[300px]">{link.url}</span>
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
          <div className="pt-4 mt-8 border-t border-black/5" style={{ borderColor: `${appliedColors.text}15` }}>
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
    </div>
  );
}
