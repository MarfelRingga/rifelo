# Rifelo Design System & Anti-Slop Guidelines

This document serves as the absolute source of truth for UI/UX design, styling, and copywriting across the Rifelo web application, with a specific focus on the `/nfcwristband` product launch pages. It ensures consistency with the main Home page and strictly prohibits generic "AI Slop" patterns.

## 1. Core Design Philosophy
- **Physical meets Digital:** Rifelo is a bridge between physical hardware (NFC) and digital identity. The design must feel grounded, tactile, premium, and deliberate. 
- **Premium Elegance:** Think fashion, high-end tech (Apple, Teenage Engineering), or luxury automotive. Less noise, more intent.
- **Anti-Slop Mandate:** Absolutely NO arbitrary glowing drop-shadows, NO purple-to-blue neon gradients, NO "glassmorphism" overload, and NO generic SaaS copywriting (e.g., "Supercharge your workflow", "Empower your network").

## 2. Color Palette & Theming
- **Primary Backgrounds:** 
  - Dark Mode: Deep Black (`#050505` or `#0a0a0a`), Dark Espresso (`#1A1A1A` or `#231712`).
  - Light Mode: Warm Off-White (`#F9F8F6`), Pure White (`#FFFFFF`).
- **Accents:** 
  - Rifelo Gold: `#d4af37` (Primary), `#f3d98b` (Hover/Highlight), `#e2c77d` (Muted).
- **Rules:**
  - Never mix warm and cool grays. Stick strictly to warm-tinted darks (like `#050505` or `#231712`).
  - Never put gray text on colored backgrounds. Use opacity scales of the base text color (e.g., `text-white/60`, `text-black/50`).
  - Brightness contrast between nested elements must be minimal (e.g., `#050505` background with `#0a0a0a` cards).

## 3. Typography
- **Font Pairings:** Use structural Sans-Serif (system fonts or Inter) paired with elegant Serif (Cinzel) for specific premium accents.
- **Headings (H1/H2 - Landing & Hero):** Massive, confident, tight tracking (`tracking-tight`), tight leading (`leading-tight` or `leading-none`). E.g., `text-5xl sm:text-7xl font-bold tracking-tight`.
- **Eyebrows / Labels (Hero & Accents):** Tiny, uppercase, extra-wide tracking, bold. E.g., `text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#d4af37]`.
- **Body Text:** Minimum `16px` (text-base) to `18px` (text-lg), `leading-relaxed`. Max width of `65-75ch` (`max-w-2xl`) for readability.

### 3.1 Dashboard Typography Scale & Guide (Reference: `/profile`)
Across all dashboard views (Profile, Inbox, NFC Tags, Settings), typography must adhere to the standardized font hierarchy:
- **Page Title (H1):** `text-2xl font-bold tracking-tight text-slate-900`
  - Purpose: Unified main view title across all dashboard tabs.
- **Page Subtitle / Tagline:** `text-sm text-slate-500 mt-1`
  - Purpose: Concise view purpose summary directly beneath the title.
- **Card / Section Header Title (H2 / H3):** `text-lg font-bold text-slate-900`
  - Compact Card Header alternative: `text-base font-bold text-slate-900`
- **Card Subtitle / Description:** `text-sm text-slate-500 mt-1` (or `text-xs text-slate-500 mt-0.5`)
- **Form Field Labels:**
  - Standard descriptive label: `text-sm font-medium text-slate-700 mb-1.5`
  - Eyebrow / Categorical uppercase label: `text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5`
  - Inline row / toggle label: `text-sm font-medium text-slate-900` or `text-xs font-semibold text-slate-900`
- **Inputs & Dropdown Text:**
  - Input text: `text-sm font-medium text-slate-900 placeholder:text-slate-400`
  - Input prefixes / badges: `text-sm font-medium text-slate-500`
  - Dropdown primary label: `text-sm font-semibold text-slate-900`
  - Dropdown helper description: `text-[11px] text-slate-400`
- **Buttons & Action Controls:**
  - Primary Action Button: `text-sm font-semibold`
  - Secondary / Ghost / Header Action Button: `text-sm font-medium text-slate-700`
  - Small Controls / Filter Pills / Tag Tabs: `text-xs font-semibold`
  - Dangerous / Destructive Action Button: `text-xs font-semibold` or `text-sm font-semibold`
- **Badges, Counter Pills & Meta:**
  - Header Counter / Status Badge: `text-xs font-semibold`
  - Notification / New Pill: `text-[10px] font-bold uppercase tracking-wider`
  - Hardware Code / Token: `font-mono text-xs text-slate-500`
  - Timestamps & Meta: `text-[11px] font-medium text-slate-400 tabular-nums`
- **Microcopy & Helper Notes:**
  - Guidance & hints: `text-xs text-slate-500 leading-relaxed`
  - Error message: `text-xs text-red-600 font-medium` or `text-sm text-red-600 font-medium`
  - Empty state headline: `text-lg font-bold text-slate-900 mb-1.5`
  - Empty state description: `text-sm text-slate-500 leading-relaxed`

## 4. Layout, Spacing & Hierarchy
- **Generous Whitespace:** Sections must have massive breathing room. Use `py-24 sm:py-32`. Do not cram content.
- **Flatten Depth:** DO NOT use nested cards (cards inside cards). Use subtle dividers (`border-white/5` or `border-black/5`) or negative space to separate sections.
- **Border Radius Math (Rifelo Radius System):** 
  - **Outer Containers & Bento Cards:** `rounded-3xl` (24px). Use for massive wrappers, modal bases, and grid containers.
  - **Sub-Containers & Feature Cards:** `rounded-2xl` (16px). Use for inner blocks inside a 3xl container.
  - **Interactive Elements (Inputs, Dropdowns, Secondary Buttons):** `rounded-xl` (12px). Mathematically fits inside a 24px container with 12px padding.
  - **Micro UI:** `rounded-md` (6px) or `rounded` (4px). Checkboxes, tiny tags.
  - **Call To Action & Avatars:** `rounded-full` (Pill/Circle). Primary buttons, profile pictures, indicator dots.
  - **Exception:** Brutalism themes or specific product edges may use absolute `rounded-none`.

## 5. Components & Borders
- **Buttons:**
  - Solid, high contrast. (e.g., Gold background `#d4af37` with Black text).
  - Hover states: DO NOT use crazy animations. Use subtle scaling (`active:scale-95`), slight brightness adjustments (`hover:bg-[#f3d98b]`), or subtle shadow increases.
  - Horizontal padding must be at least 2x vertical padding (`px-8 py-4`).
- **Borders & Shadows:**
  - No 1px hairline borders mixed with wide soft shadows. Choose one.
  - On dark mode, use extremely subtle borders (`border-white/5` or `border-[#d4af37]/20`) to define edges.
  - Drop shadows on dark mode must be dark and deep (`shadow-[0_4px_20px_rgba(0,0,0,0.5)]`), NEVER glowing (unless specifically for a tiny indicator light).

## 6. NFC Wristband Specific Rules (/nfcwristband)
- **Imagery is King:** The 3D assets/photos (Full body, Surface, Adjustable strap) are the heroes. Do not cover them with heavy UI.
- **Copywriting:** Use physical verbs. "Tap", "Wear", "Share", "Waterproof", "Adjustable". Avoid abstract software jargon. 
- **Structure:**
  1. Hero: Massive claim + Full Product + CTA.
  2. Tech/Surface: Focus on the chip, zero charging, universal compatibility.
  3. Design/Strap: Focus on material, waterproof, adjustable comfort.
  4. Final CTA: Urgency (Pre-order / Waitlist).
- **Animations:** Motion should feel slow, heavy, and deliberate (like moving physical hardware). Use `duration: 0.8` or `1.0`, `ease: "easeOut"`. No bouncy spring physics.

## 7. Anti-AI Slop Checklist before executing any code:
- [ ] Did I use a purple-to-blue gradient? (If yes, DELETE).
- [ ] Did I use a "glassmorphism" card with massive blur on top of a messy background? (If yes, SIMPLIFY).
- [ ] Are my buttons correctly padded (horizontal >= 2x vertical)?
- [ ] Did I use the words "Supercharge", "Empower", or "Unleash"? (If yes, REWRITE).
- [ ] Is there enough negative space (`py-24`+) between sections?
- [ ] Are icons consistently sized (`w-5 h-5`) and stroked?
