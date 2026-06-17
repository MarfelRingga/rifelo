'use client';

import { Mail, Phone, Globe, Ticket } from 'lucide-react';
import MessageForm from '@/app/(public)/u/[username]/MessageForm';
import { getPlatformInfo } from '@/lib/platforms';

export default function Y2KTicketProfile({ profile }: { profile: any }) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-400 via-zinc-600 to-zinc-900 font-sans py-12 px-2 md:px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* CSS-based spring entry animation config - renders instantly without waiting for ReactJS hydration */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes y2kCardEntrance {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
          }
          60% {
            transform: translateY(-8px) scale(1.005);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .y2k-ticket-animate {
          animation: y2kCardEntrance 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
        }
      `}} />

      {/* Background Overlay Pattern */}
      <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#18181b_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none mix-blend-overlay"></div>

      {/* Industrial Noise Texture */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none mix-blend-color-burn" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />

      <div 
        className="y2k-ticket-animate relative z-10 w-full max-w-xl bg-orange-500 border-4 md:border-8 border-blue-950 flex flex-col shadow-[8px_8px_0_0_rgba(23,37,84,1)] md:shadow-[24px_24px_0_0_rgba(23,37,84,1)] mb-8"
      >
        {/* Ticket Header Decor */}
        <div className="flex justify-between items-center px-2 py-2 md:px-4 bg-blue-950 text-white font-mono text-[10px] md:text-xs uppercase tracking-widest">
          <span>SEC: VIP</span>
          <span className="flex items-center gap-1 md:gap-2"><Ticket className="w-3 h-3 md:w-4 md:h-4"/> ADMIT ONE</span>
          <span>ROW: Y2K</span>
        </div>

        <div className="p-4 md:p-8 flex flex-col gap-6 w-full overflow-hidden">
          
          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase break-words" style={{ textShadow: '4px 4px 0px #172554' }}>
              {profile.fullName}
            </h1>
            
            {(profile.jobTitle || profile.company || profile.username) && (
              <div className="font-mono text-blue-950 text-sm md:text-base font-bold bg-white/20 inline-block px-3 py-1 uppercase mt-2">
                [ POS: {profile.jobTitle || 'USER'} | LOC: {profile.company || profile.username} ]
              </div>
            )}
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <>
              <div className="border-t-4 border-dashed border-blue-950/50 w-full my-2" />
              <div className="text-center">
                <p className="font-bold text-blue-950 text-lg uppercase leading-tight font-sans">
                  {profile.bio}
                </p>
              </div>
            </>
          )}

          <div className="border-t-4 border-dashed border-blue-950/50 w-full my-2" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { icon: Globe, label: 'WEB', value: 'PORTFOLIO', url: profile.website, show: profile.website && profile.profileMode === 'creative' },
              { icon: Mail, label: 'MAIL', value: 'CONTACT', url: `mailto:${profile.email}`, show: profile.email },
              { icon: Phone, label: 'TEL', value: 'CALL', url: `https://wa.me/${profile.phone?.replace(/\D/g, '')}`, show: profile.phone }
            ].map((item, i) => item.show ? (
              <a 
                key={i}
                href={item.url || '#'}
                target={item.url ? '_blank' : undefined}
                className="flex flex-col items-center justify-center border-2 border-blue-950 p-3 bg-transparent text-blue-950 font-mono text-xs uppercase cursor-pointer hover:scale-95 hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out"
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="font-bold">{item.label}</span>
                <span className="truncate w-full text-center opacity-80">{item.value}</span>
              </a>
            ) : null)}
          </div>

          {/* Social Links */}
          {profile.links && profile.links.length > 0 && (
            <div className="flex flex-col gap-3 mt-4">
              <div className="grid grid-cols-1 gap-2">
                {profile.links.map((link: any, i: number) => {
                  const platformInfo = getPlatformInfo(link.title, link.url);
                  const Icon = platformInfo?.icon || Globe;
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
                             borderRadius: '16px',
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

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      className="group flex items-center justify-between bg-blue-950 p-4 border-2 border-blue-950 hover:bg-orange-500 transition-colors duration-100 hover:scale-[0.98] active:scale-[0.96] transition-all ease-out"
                    >
                      <div className="flex items-center text-orange-400 group-hover:text-blue-950 font-mono uppercase font-bold tracking-widest truncate">
                        <Icon className="w-5 h-5 mr-3" />
                        <span className="truncate">{link.title}</span>
                      </div>
                      <span className="text-orange-400 group-hover:text-blue-950 font-mono text-xs opacity-70">
                        {platformInfo?.username || 'GOTO >'}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secret Message Form */}
          {profile.allowMessages && (
            <div 
               className="mt-6 border-t-4 border-dashed border-blue-950/50 pt-6"
            >
              <div className="bg-white border-2 border-blue-950 p-4">
                <MessageForm 
                  profileId={profile.id} 
                  placeholderName={profile.messagePlaceholderName}
                  placeholderContent={profile.messagePlaceholderContent}
                  themeColors={{
                    primary: '#172554', // blue-950
                    secondary: '#ffffff',
                    accent: '#ea580c', // orange-600
                    background: '#ffffff',
                    text: '#172554',
                    inputBg: '#f8fafc',
                    inputBorder: '#172554'
                  }}
                  themePreset="y2k-ticket"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
