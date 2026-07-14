import { ProfileMode, ThemePreset } from './types/profile';

/**
 * Interface defining the complete structure of a theme preset.
 */
export interface ThemeConfig {
  /** Display name of the theme */
  name: string;
  /** Description for theme preview/selection */
  description: string;
  /** Applicable profile modes for this theme */
  mode: ProfileMode[];
  /** Color palette */
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    cardBg: string;
    cardBorder: string;
    linkBg: string;
    linkBorder: string;
    inputBg?: string; // used in MessageForm
    inputBorder?: string; // used in MessageForm
  };
  /** Typography configuration */
  fonts: {
    heading: string;
    body: string;
  };
  /** Global border radius style */
  borderRadius: string;
}

/**
 * Central configuration for all profile theme presets.
 * 
 * Tailwind Config Reference:
 * In a standard Tailwind Setup, you map these to CSS variables in your global styles, e.g.:
 * :root {
 *   --theme-primary: <value>;
 * }
 * Then extend your tailwind.config or app layer to use var(--theme-primary).
 * Alternatively, apply them directly via inline styles where dynamic:
 * style={{ backgroundColor: theme.colors.background }}
 */
export const themePresets: Record<ThemePreset, ThemeConfig> = {
  minimal: {
    name: 'Minimal',
    description: 'Stark, highly legible, monochromatic focus.',
    mode: ['professional', 'creative', 'casual'],
    colors: {
      primary: '#0f172a',
      secondary: '#f8fafc',
      accent: '#64748b',
      background: '#f8fafc',
      text: '#0f172a',
      cardBg: '#ffffff',
      cardBorder: '#f1f5f9',
      linkBg: '#f8fafc',
      linkBorder: '#f1f5f9',
      inputBg: '#ffffff',
      inputBorder: '#e2e8f0'
    },
    fonts: {
      heading: 'var(--font-heading), system-ui, sans-serif',
      body: 'var(--font-body), system-ui, sans-serif'
    },
    borderRadius: '1.25rem' // clean modern rounded corners matching the high-quality layout
  },
  corporate: {
    name: 'Corporate',
    description: 'Clean, professional, and trustworthy blue tones.',
    mode: ['professional'],
    colors: {
      primary: '#1d4ed8', // Blue 700
      secondary: '#e0e7ff', // Indigo 100
      accent: '#2563eb', // Blue 600
      background: '#f8fafc', // Slate 50
      text: '#0f172a', // Slate 900
      cardBg: '#ffffff',
      cardBorder: '#1d4ed820',
      linkBg: '#e0e7ff',
      linkBorder: 'transparent',
      inputBg: '#ffffff',
      inputBorder: '#0f172a20'
    },
    fonts: {
      heading: 'var(--font-heading), system-ui, sans-serif', // Inter or standard sans
      body: 'var(--font-body), system-ui, sans-serif'
    },
    borderRadius: '0.375rem' // Standard rounded-md
  },
  brutalism: {
    name: 'Brutalism',
    description: 'Acid graphic dark brutalism theme. Raw, striking interface with noise texture.',
    mode: ['creative', 'casual'],
    colors: {
      primary: '#ffffff',
      secondary: '#1a1a1a',
      accent: '#d1d5db',
      background: '#000000',
      text: '#ffffff',
      cardBg: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      linkBg: 'rgba(255, 255, 255, 0.08)',
      linkBorder: '#444444',
      inputBg: '#0f0f0f',
      inputBorder: '#333333'
    },
    fonts: {
      heading: 'var(--font-anton), var(--font-heading), system-ui, sans-serif',
      body: 'var(--font-body), system-ui, sans-serif'
    },
    borderRadius: '0px'
  },
  'phantom-deck': {
    name: 'Phantom Deck',
    description: 'A mysterious theme inspired by vintage playing cards, floating particles, and deep gold details.',
    mode: ['creative', 'casual'],
    colors: {
      primary: '#ca8a04', // Warm gold
      secondary: '#2a1711', // Deep blackish brown
      accent: '#991b1b', // Deep crimson
      background: 'linear-gradient(to bottom, #110c0a 0%, #1c1410 50%, #0d0806 100%)',
      text: '#f5ebd5', // Warm parchment text
      cardBg: 'rgba(28, 20, 16, 0.8)', // Acrylic card game table background
      cardBorder: 'rgba(202, 138, 4, 0.25)', // Subtle gold border
      linkBg: 'rgba(42, 23, 17, 0.5)',
      linkBorder: 'rgba(202, 138, 4, 0.15)',
      inputBg: '#110c0a',
      inputBorder: 'rgba(202, 138, 4, 0.3)'
    },
    fonts: {
      heading: 'var(--font-heading), system-ui, serif',
      body: 'var(--font-sans), system-ui, sans-serif'
    },
    borderRadius: '1.25rem'
  }
} as const;

/**
 * Retrieves all themes that support the specified profile mode.
 * 
 * @param mode - The current profile mode (casual, professional, creative)
 * @returns Array of theme configurations applicable to the mode
 */
export function getThemesByMode(mode: ProfileMode): (ThemeConfig & { id: ThemePreset })[] {
  return (Object.entries(themePresets) as [ThemePreset, ThemeConfig][])
    .map(([id, config]) => ({ id, ...config }));
}

/**
 * Retrieves a specific theme configuration by its preset ID.
 * 
 * @param preset - The identifier of the theme preset
 * @returns The theme configuration or a fallback (minimal) if not found
 */
export function getTheme(preset: string): ThemeConfig | null {
  if (preset in themePresets) {
    return themePresets[preset as ThemePreset];
  }
  return null;
}
