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
      accent: '#ffffff',
      background: '#f8fafc',
      text: '#0f172a',
      cardBg: '#ffffff',
      cardBorder: '#e2e8f0',
      linkBg: '#f8fafc',
      linkBorder: '#e2e8f0',
      inputBg: '#ffffff',
      inputBorder: '#e2e8f0'
    },
    fonts: {
      heading: 'var(--font-heading), system-ui, sans-serif',
      body: 'var(--font-body), system-ui, sans-serif'
    },
    borderRadius: '1.25rem' // clean modern rounded corners matching the high-quality layout
  },
  glassmorphism: {
    name: 'Glass',
    description: 'Frosted glass panels, translucent layers, and smooth floating refraction.',
    mode: ['professional', 'creative', 'casual'],
    colors: {
      primary: '#090d16',
      secondary: 'rgba(255, 255, 255, 0.85)',
      accent: '#2563eb',
      background: 'linear-gradient(135deg, #eef2f6 0%, #f8fafc 50%, #e2e8f0 100%)',
      text: '#090d16',
      cardBg: 'rgba(255, 255, 255, 0.75)',
      cardBorder: 'rgba(255, 255, 255, 0.9)',
      linkBg: 'rgba(255, 255, 255, 0.82)',
      linkBorder: 'rgba(0, 0, 0, 0.08)',
      inputBg: 'rgba(255, 255, 255, 0.85)',
      inputBorder: 'rgba(0, 0, 0, 0.12)'
    },
    fonts: {
      heading: 'var(--font-heading), system-ui, sans-serif',
      body: 'var(--font-body), system-ui, sans-serif'
    },
    borderRadius: '1.25rem'
  },
  brutalism: {
    name: 'Brutalism',
    description: 'Acid graphic dark brutalism theme. Raw, striking interface with noise texture.',
    mode: ['creative', 'casual'],
    colors: {
      primary: '#ffffff',
      secondary: '#1a1a1a',
      accent: '#000000', // Crisp stark black on white primary button
      background: '#000000',
      text: '#ffffff',
      cardBg: 'rgba(255, 255, 255, 0.05)',
      cardBorder: 'rgba(255, 255, 255, 0.15)',
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
    description: 'A luxurious theme inspired by arcane playing cards, intricate gilded borders, and deep obsidian hues.',
    mode: ['creative', 'casual'],
    colors: {
      primary: '#d4af37', // Refined Antique Gold
      secondary: '#1c1310', // Deep obsidian wood
      accent: '#120b08', // Contrast dark obsidian on gold
      background: 'linear-gradient(to bottom, #0b0807 0%, #150e0b 50%, #080605 100%)',
      text: '#f7eedb', // Warm parchment text
      cardBg: 'rgba(22, 15, 12, 0.9)', // Smoked glass obsidian card
      cardBorder: 'rgba(212, 175, 55, 0.28)', // Antique gold hairline border
      linkBg: 'rgba(35, 23, 18, 0.65)',
      linkBorder: 'rgba(212, 175, 55, 0.2)',
      inputBg: '#130c09',
      inputBorder: 'rgba(212, 175, 55, 0.3)'
    },
    fonts: {
      heading: 'var(--font-heading), system-ui, serif',
      body: 'var(--font-body), system-ui, sans-serif'
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
  if (preset === 'corporate') {
    return themePresets.glassmorphism;
  }
  if (preset in themePresets) {
    return themePresets[preset as keyof typeof themePresets];
  }
  return null;
}
