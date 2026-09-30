import React, { useMemo } from 'react';
import { ProfileMode } from '@/lib/types/profile';
import { getThemesByMode, getTheme } from '@/lib/themePresets';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface ThemeSelectorProps {
  currentMode: ProfileMode;
  currentTheme: string;
  onThemeSelect: (theme: string) => void;
  accentColor?: string;
}

const getPreviewColors = (themeId: string, colors: any, accentColor?: string) => {
  switch (themeId) {
    case 'minimal':
      return {
        bg: '#f8fafc',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        text: '#0f172a',
        subtext: '#64748b',
        primary: accentColor || '#0f172a',
        linkBg: '#f8fafc',
        linkBorder: '#e2e8f0',
        badgeBg: accentColor ? `${accentColor}15` : '#f1f5f9',
        badgeBorder: accentColor ? `${accentColor}35` : '#e2e8f0',
        badgeDot: accentColor || '#475569',
        buttonBg: accentColor || '#0f172a',
        buttonText: '#ffffff',
        isDark: false,
        radius: 'rounded-lg',
        linkRadius: 'rounded-md',
      };
    case 'glassmorphism':
      return {
        bg: 'linear-gradient(135deg, #eef2f6 0%, #f8fafc 50%, #e2e8f0 100%)',
        cardBg: 'rgba(255, 255, 255, 0.76)',
        cardBorder: 'rgba(255, 255, 255, 0.95)',
        text: '#090d16',
        subtext: '#475569',
        primary: accentColor || '#2563eb',
        linkBg: 'rgba(255, 255, 255, 0.88)',
        linkBorder: 'rgba(0, 0, 0, 0.08)',
        badgeBg: 'rgba(255, 255, 255, 0.9)',
        badgeBorder: 'rgba(0, 0, 0, 0.1)',
        badgeDot: accentColor || '#2563eb',
        buttonBg: accentColor || '#2563eb',
        buttonText: '#ffffff',
        isDark: false,
        radius: 'rounded-lg',
        linkRadius: 'rounded-md',
      };
    case 'brutalism':
      return {
        bg: '#000000',
        cardBg: 'rgba(255, 255, 255, 0.06)',
        cardBorder: 'rgba(255, 255, 255, 0.22)',
        text: '#ffffff',
        subtext: 'rgba(255, 255, 255, 0.6)',
        primary: '#ffffff',
        linkBg: 'rgba(255, 255, 255, 0.1)',
        linkBorder: 'rgba(255, 255, 255, 0.28)',
        badgeBg: 'rgba(255, 255, 255, 0.12)',
        badgeBorder: 'rgba(255, 255, 255, 0.3)',
        badgeDot: '#ffffff',
        buttonBg: '#ffffff',
        buttonText: '#000000',
        isDark: true,
        radius: 'rounded-none',
        linkRadius: 'rounded-none',
      };
    case 'phantom-deck':
      return {
        bg: 'linear-gradient(to bottom, #0b0807 0%, #150e0b 50%, #080605 100%)',
        cardBg: 'rgba(22, 15, 12, 0.92)',
        cardBorder: 'rgba(212, 175, 55, 0.32)',
        text: '#f7eedb',
        subtext: '#cbbda3',
        primary: '#d4af37',
        linkBg: 'rgba(35, 23, 18, 0.75)',
        linkBorder: 'rgba(212, 175, 55, 0.22)',
        badgeBg: '#271a14',
        badgeBorder: 'rgba(212, 175, 55, 0.4)',
        badgeDot: '#d4af37',
        buttonBg: '#d4af37',
        buttonText: '#120b08',
        isDark: true,
        radius: 'rounded-lg',
        linkRadius: 'rounded-md',
      };
    default:
      return {
        bg: colors?.background || '#f8fafc',
        cardBg: colors?.cardBg || '#ffffff',
        cardBorder: colors?.cardBorder || '#e2e8f0',
        text: colors?.text || '#0f172a',
        subtext: colors?.text || '#64748b',
        primary: colors?.primary || '#0f172a',
        linkBg: colors?.linkBg || '#f8fafc',
        linkBorder: colors?.linkBorder || '#e2e8f0',
        badgeBg: '#f1f5f9',
        badgeBorder: '#e2e8f0',
        badgeDot: colors?.primary || '#475569',
        buttonBg: colors?.primary || '#0f172a',
        buttonText: '#ffffff',
        isDark: false,
        radius: 'rounded-lg',
        linkRadius: 'rounded-md',
      };
  }
};

export function ThemeSelector({
  currentMode,
  currentTheme,
  onThemeSelect,
  accentColor,
}: ThemeSelectorProps) {
  const availableThemes = useMemo(() => getThemesByMode(currentMode), [currentMode]);
  
  const activeThemeConfig = useMemo(() => {
    let theme = getTheme(currentTheme);
    if (!theme && availableThemes.length > 0) {
      theme = availableThemes[0];
    }
    return theme;
  }, [currentTheme, availableThemes]);

  if (!activeThemeConfig) return null;

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto lg:overflow-visible lg:grid lg:grid-cols-4 gap-3 sm:gap-3.5 py-2 snap-x hide-scrollbar -mx-2 px-2 lg:mx-0 lg:px-0">
        {availableThemes.map((theme) => {
          const isSelected = theme.id === currentTheme;
          const preview = getPreviewColors(theme.id, theme.colors, accentColor);
          
          return (
            <button
              type="button"
              key={theme.id}
              onClick={() => onThemeSelect(theme.id)}
              className={cn(
                "snap-center shrink-0 w-[124px] sm:w-[138px] lg:w-full flex flex-col items-center gap-2 group transition-all duration-200",
                isSelected ? "opacity-100" : "opacity-75 hover:opacity-100"
              )}
            >
              {/* Web Profile Preview Card (Aspect 3/4 - Representing u/username Web Layout) */}
              <div 
                className={cn(
                  "w-full aspect-[3/4] rounded-2xl p-2.5 sm:p-3 border-2 transition-all flex flex-col justify-center overflow-hidden relative shadow-2xs select-none",
                  isSelected 
                    ? "border-slate-900 ring-2 ring-slate-900/10 shadow-sm scale-102" 
                    : "border-slate-200 hover:border-slate-300"
                )}
                style={{ background: preview.bg }}
              >
                {/* Theme Ambient FX (Subtle background lighting) */}
                {theme.id === 'glassmorphism' && (
                  <>
                    <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-sky-400/35 blur-md pointer-events-none" />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-indigo-400/30 blur-md pointer-events-none" />
                  </>
                )}
                {theme.id === 'phantom-deck' && (
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-[#d4af37]/15 blur-lg pointer-events-none" />
                )}

                {/* Central Web Profile Container Card */}
                <div 
                  className={cn(
                    "w-full p-2 border flex flex-col gap-1.5 transition-all relative z-10",
                    theme.id === 'brutalism' ? "rounded-none shadow-[2px_2px_0px_rgba(255,255,255,0.15)]" : "rounded-xl",
                    theme.id === 'glassmorphism' && "backdrop-blur-md shadow-xs",
                    theme.id === 'phantom-deck' && "shadow-[0_4px_14px_rgba(0,0,0,0.5)]"
                  )}
                  style={{
                    background: preview.cardBg,
                    borderColor: preview.cardBorder
                  }}
                >
                  {/* 1. Profile Header: Clean Badge Pill Box */}
                  <div className="w-full flex flex-col items-center text-center py-0.5">
                    <div 
                      className={cn(
                        "h-3 w-10 sm:w-12 border shadow-2xs",
                        theme.id === 'brutalism' ? "rounded-none" : "rounded-full"
                      )}
                      style={{
                        background: preview.badgeBg,
                        borderColor: preview.badgeBorder
                      }}
                    />
                  </div>

                  {/* 2. Link Items Stack (Clean Link Boxes) */}
                  <div className="w-full flex flex-col gap-1.5 pt-0.5">
                    {/* Link Box 1 */}
                    <div 
                      className={cn(
                        "w-full h-4 sm:h-4.5 border flex items-center px-1.5 shadow-2xs",
                        theme.id === 'brutalism' ? "rounded-none" : "rounded-lg"
                      )}
                      style={{
                        background: preview.linkBg,
                        borderColor: preview.linkBorder
                      }}
                    >
                      <div 
                        className={cn(
                          "w-2 h-2 shrink-0",
                          theme.id === 'brutalism' ? "rounded-none" : "rounded-xs"
                        )}
                        style={{ background: preview.primary }}
                      />
                    </div>

                    {/* Link Box 2 */}
                    <div 
                      className={cn(
                        "w-full h-4 sm:h-4.5 border flex items-center px-1.5 shadow-2xs",
                        theme.id === 'brutalism' ? "rounded-none" : "rounded-lg"
                      )}
                      style={{
                        background: preview.linkBg,
                        borderColor: preview.linkBorder
                      }}
                    >
                      <div 
                        className={cn(
                          "w-2 h-2 shrink-0",
                          theme.id === 'brutalism' ? "rounded-none" : "rounded-xs"
                        )}
                        style={{ background: preview.primary }}
                      />
                    </div>
                  </div>

                  {/* 3. Message Box Form (Clean Input Box + Clean Action Button Box) */}
                  <div className="w-full pt-1.5 border-t flex flex-col gap-1 mt-0.5" style={{ borderColor: preview.linkBorder }}>
                    {/* Input Field Box */}
                    <div 
                      className={cn(
                        "w-full h-3 sm:h-3.5 border",
                        theme.id === 'brutalism' ? "rounded-none" : "rounded-md"
                      )}
                      style={{
                        background: preview.isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.95)',
                        borderColor: preview.linkBorder
                      }}
                    />

                    {/* Send Button Box in Theme Accent */}
                    <div 
                      className={cn(
                        "w-full h-3 sm:h-3.5 shadow-2xs",
                        theme.id === 'brutalism' ? "rounded-none" : "rounded-md"
                      )}
                      style={{ background: preview.buttonBg }}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Name */}
              <span className={cn(
                "text-xs font-semibold text-center w-full transition-colors truncate px-1",
                isSelected ? "text-slate-900 font-bold" : "text-slate-500"
              )}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
