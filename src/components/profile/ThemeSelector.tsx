import React, { useMemo } from 'react';
import { ProfileMode } from '@/lib/types/profile';
import { getThemesByMode, getTheme } from '@/lib/themePresets';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface ThemeSelectorProps {
  currentMode: ProfileMode;
  currentTheme: string;
  onThemeSelect: (theme: string) => void;
}

const getPreviewColors = (themeId: string, colors: any) => {
  switch (themeId) {
    case 'vibrant':
      return {
        c1: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)', // real pastel card gradient
        c2: '#7c3aed', // vibrant Purple accent
        bg: '#ffffff'
      };
    case 'playful':
      return {
        c1: '#fffbeb', // cream background
        c2: '#f59e0b', // playful Amber
        bg: '#ffffff'
      };
    case 'minimal':
      return {
        c1: '#f8fafc', // minimal slate theme background
        c2: '#0f172a', // minimal deep slate/black focus
        bg: '#ffffff'
      };
    case 'brutalism':
      return {
        c1: '#e5e7eb', // brutalism gray background
        c2: '#000000', // stark black
        bg: '#000000'
      };
    case 'glassmorphism':
      return {
        c1: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.4))',
        c2: '#090d16',
        bg: 'linear-gradient(135deg, #eef2f6 0%, #dce4ee 100%)'
      };
    case 'phantom-deck':
      return {
        c1: '#1c130f',
        c2: '#d4af37',
        bg: '#050505'
      };
    default:
      return {
        c1: colors.background || '#ffffff',
        c2: colors.primary || '#000000',
        bg: '#f8fafc'
      };
  }
};

export function ThemeSelector({
  currentMode,
  currentTheme,
  onThemeSelect,
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
      <div className="flex overflow-x-auto gap-4 py-4 snap-x hide-scrollbar -mx-4 px-4">
        {availableThemes.map((theme) => {
          const isSelected = theme.id === currentTheme;
          const preview = getPreviewColors(theme.id, theme.colors);
          
          return (
            <button
              type="button"
              key={theme.id}
              onClick={() => onThemeSelect(theme.id)}
              className={cn(
                "snap-center shrink-0 w-[100px] flex flex-col items-center gap-3 group transition-all duration-300",
                isSelected ? "opacity-100" : "opacity-60 hover:opacity-100"
              )}
            >
              <div 
                className={cn(
                  "w-full aspect-[2/3] rounded-2xl shadow-sm flex flex-col items-center p-3 gap-2 border-[2.5px] transition-all overflow-hidden relative",
                  isSelected ? "border-slate-900 scale-105 shadow-md" : "border-slate-200 scale-100 hover:border-slate-300"
                )}
                style={{ background: preview.bg }}
              >
                {/* Simulated Background Layer (for Glass/Gradient) */}
                <div className="absolute inset-0 z-0" style={{ background: preview.c1, opacity: (theme.id as string) === 'glassmorphism' ? 1 : 0.2 }} />
                {(theme.id as string) === 'glassmorphism' && (
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-sky-400/40 blur-md animate-glass-orb-1 pointer-events-none" />
                )}
                
                {/* Simulated Content: Realistic text-first profile (No avatar circle) */}
                <div className="relative z-10 w-full flex flex-col items-center gap-1.5 mt-1">
                  {/* Full Name Title */}
                  <div 
                    className="w-4/5 h-2.5 rounded-full"
                    style={{ background: preview.c2 }}
                  />
                  {/* Job Title / Subtitle Badge */}
                  <div 
                    className="w-1/2 h-1.5 rounded-full opacity-50 mb-1"
                    style={{ background: preview.c2 }}
                  />
                  
                  {/* Link Cards Stack */}
                  <div className="w-full flex flex-col gap-1.5 mt-auto pt-1">
                    <div 
                      className={cn(
                        "w-full h-4 rounded-md border flex items-center px-1.5",
                        (theme.id as string) === 'glassmorphism' ? "border-black/10 shadow-xs" : "border-black/5"
                      )}
                      style={{ 
                        background: ((theme.id as string) === 'brutalism' || (theme.id as string) === 'phantom-deck') 
                          ? preview.c2 
                          : (theme.id as string) === 'glassmorphism' 
                          ? 'rgba(255,255,255,0.85)' 
                          : 'rgba(255,255,255,0.7)' 
                      }}
                    >
                      {(theme.id as string) === 'glassmorphism' && (
                        <div className="w-8 h-1 rounded-full bg-slate-900/80" />
                      )}
                    </div>
                    <div 
                      className={cn(
                        "w-full h-4 rounded-md border flex items-center px-1.5",
                        (theme.id as string) === 'glassmorphism' ? "border-black/10 shadow-xs" : "border-black/5"
                      )}
                      style={{ 
                        background: ((theme.id as string) === 'brutalism' || (theme.id as string) === 'phantom-deck') 
                          ? preview.c2 
                          : (theme.id as string) === 'glassmorphism' 
                          ? 'rgba(255,255,255,0.85)' 
                          : 'rgba(255,255,255,0.7)' 
                      }}
                    >
                      {(theme.id as string) === 'glassmorphism' && (
                        <div className="w-6 h-1 rounded-full bg-slate-900/80" />
                      )}
                    </div>
                    <div 
                      className={cn(
                        "w-full h-4 rounded-md border flex items-center px-1.5",
                        (theme.id as string) === 'glassmorphism' ? "border-black/10 shadow-xs" : "border-black/5"
                      )}
                      style={{ 
                        background: ((theme.id as string) === 'brutalism' || (theme.id as string) === 'phantom-deck') 
                          ? preview.c2 
                          : (theme.id as string) === 'glassmorphism' 
                          ? 'rgba(255,255,255,0.85)' 
                          : 'rgba(255,255,255,0.7)' 
                      }}
                    >
                      {(theme.id as string) === 'glassmorphism' && (
                        <div className="w-7 h-1 rounded-full bg-slate-900/80" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <span className={cn(
                "text-xs font-semibold text-center w-full transition-colors",
                isSelected ? "text-slate-900" : "text-slate-500"
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
