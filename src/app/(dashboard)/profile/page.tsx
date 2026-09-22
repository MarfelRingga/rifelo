'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ExternalLink, Plus, Trash2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Eye, EyeOff, Link as LinkIcon, Loader2, Palette } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { getPlatformInfo } from '@/lib/platforms';
import { revalidateProfile } from '@/app/actions/revalidate';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { encodeMessageSettings, decodeMessageSettings } from '@/lib/messageSettings';
import { useToast } from '@/components/ui/ToastContext';

import { ModeSelector } from '@/components/profile/ModeSelector';
import { ThemeSelector } from '@/components/profile/ThemeSelector';
import { DynamicProfileForm } from '@/components/profile/DynamicProfileForm';
import { ModeSwitchConfirmation } from '@/components/profile/ModeSwitchConfirmation';
import { SortableLinkItem } from '@/components/profile/SortableLinkItem';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, MouseSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ProfileMode } from '@/lib/types/profile';
import { migrateFieldData } from '@/lib/profileMigration';
import { getValidationErrors } from '@/lib/validation/profileValidation';
import { getThemesByMode, getTheme } from '@/lib/themePresets';
import { cn } from '@/lib/utils';
import PublicProfileView from '@/components/profile/PublicProfileView';

interface CustomLink {
  id: string;
  title: string;
  url: string;
  is_visible?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();

  // --- STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [links, setLinks] = useState<CustomLink[]>([]);
  const [expandedLinks, setExpandedLinks] = useState<Record<string, boolean>>({});
  
  const [messagePlaceholderName, setMessagePlaceholderName] = useState('Your Name (Optional)');
  const [messagePlaceholderContent, setMessagePlaceholderContent] = useState('Write a secret message...');
  const [allowMessages, setAllowMessages] = useState(true);
  const { showToast } = useToast();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // --- NEW STATES (Multi-Mode) ---
  const [profileMode, setProfileMode] = useState<ProfileMode>('casual');
  const [themePreset, setThemePreset] = useState<string>('minimal');
  const [showModeSwitchConfirm, setShowModeSwitchConfirm] = useState(false);
  const [pendingMode, setPendingMode] = useState<ProfileMode | null>(null);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [activeAppearanceTab, setActiveAppearanceTab] = useState<'mode' | 'theme' | 'shape' | 'font'>('mode');

  const ACCENT_COLORS = [
    { id: 'gold', name: 'Rifelo Gold', value: '#d4af37', bg: 'bg-[#d4af37]' },
    { id: 'blue', name: 'Executive Blue', value: '#2563eb', bg: 'bg-blue-600' },
    { id: 'emerald', name: 'Emerald Forest', value: '#059669', bg: 'bg-emerald-600' },
    { id: 'rose', name: 'Crimson Rose', value: '#e11d48', bg: 'bg-rose-600' },
    { id: 'obsidian', name: 'Obsidian Black', value: '#0f172a', bg: 'bg-slate-900' },
    { id: 'slate', name: 'Titanium Slate', value: '#64748b', bg: 'bg-slate-500' }
  ];

  const FONTS = [
    { id: 'sans', name: 'Modern Sans', class: 'font-sans', value: 'var(--font-body), system-ui, sans-serif' },
    { id: 'serif', name: 'Luxury Serif', class: 'font-serif', value: 'var(--font-heading), system-ui, serif' },
    { id: 'mono', name: 'Tech Mono', class: 'font-mono', value: 'ui-monospace, SFMono-Regular, monospace' }
  ];
  const [customTheme, setCustomTheme] = useState<any>({});

  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({
    full_name: '',
    job_title: '',
    company: '',
    email: '',
    phone: '',
    bio: ''
  });

  const [modeMemory, setModeMemory] = useState<Record<ProfileMode, Record<string, string>>>({
    casual: {},
    professional: {},
    creative: {}
  });

  const [originalStateHash, setOriginalStateHash] = useState<string>('');

  const getCurrentStateHash = (
    u = username, 
    ip = isPublic, 
    pm = profileMode, 
    tp = themePreset, 
    ct = customTheme,
    dv = dynamicValues, 
    ls = links, 
    mpn = messagePlaceholderName, 
    mpc = messagePlaceholderContent, 
    am = allowMessages,
    mm = modeMemory
  ) => {
    // Strip temporary IDs from links for stable comparison if needed, or just compare as-is.
    const cleanLinks = ls.map(l => ({ title: l.title, url: l.url, is_visible: l.is_visible }));
    return JSON.stringify({ u, ip, pm, tp, dv, cleanLinks, mpn, mpc, am, ct, mm });
  };

  const hasUnsavedChanges = !isLoading && originalStateHash !== '' && originalStateHash !== getCurrentStateHash();

  // --- INITIALIZATION ---
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      // Fetch Profile and Links concurrently (Promise.all)
      const [profileResult, linksResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle(),
        supabase
          .from('profile_links')
          .select('*')
          .eq('profile_id', user.id)
          .order('sort_order', { ascending: true })
      ]);

      const { data: profile, error: profileError } = profileResult;
      const { data: linksData, error: linksError } = linksResult;

      if (profileError) throw new Error(`Failed to load profile: ${profileError.message}`);
      if (linksError) throw new Error(`Failed to load profile links: ${linksError.message}`);

      let finalMemory = { casual: {}, professional: {}, creative: {} } as Record<ProfileMode, Record<string, string>>;

      if (profile) {
        setUsername(profile.username || '');
        setIsPublic(profile.is_public !== false);
        
        setProfileMode((profile.profile_mode as ProfileMode) || 'casual');
        setThemePreset(profile.theme_preset || 'minimal');
        setCustomTheme(profile.custom_theme || {});

        const initialDynamicValues = {
          full_name: profile.full_name || '',
          job_title: profile.job_title || '',
          company: profile.company || '',
          email: profile.email || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
        };
        setDynamicValues(initialDynamicValues);
        
        finalMemory = (profile.field_visibility as Record<ProfileMode, Record<string, string>>) || {
          casual: {},
          professional: {},
          creative: {}
        };
        // Ensure current mode has the latest DB values
        const currentMode = (profile.profile_mode as ProfileMode) || 'casual';
        finalMemory[currentMode] = { ...finalMemory[currentMode], ...initialDynamicValues };
        setModeMemory(finalMemory);
        
        const decodedSettings = decodeMessageSettings(profile.message_placeholder_name || 'Your Name (Optional)');
        setAllowMessages(decodedSettings.isEnabled);
        setMessagePlaceholderName(decodedSettings.cleanName);
        setMessagePlaceholderContent(profile.message_placeholder_content || 'Write a secret message...');
      }

      if (linksData) {
        setLinks(linksData.map(l => ({ id: l.id, title: l.title, url: l.url, is_visible: l.is_visible })));
      }

      // Delay state hash capture slightly to let all states settle
      setTimeout(() => {
        setOriginalStateHash(getCurrentStateHash(
          profile?.username || '',
          profile?.is_public !== false,
          (profile?.profile_mode as ProfileMode) || 'casual',
          profile?.theme_preset || 'minimal',
          profile?.custom_theme || {},
          {
            full_name: profile?.full_name || '',
            job_title: profile?.job_title || '',
            company: profile?.company || '',
            email: profile?.email || '',
            phone: profile?.phone || '',
            bio: profile?.bio || '',
          },
          linksData ? linksData.map(l => ({ id: l.id, title: l.title, url: l.url, is_visible: l.is_visible })) : [],
          decodeMessageSettings(profile?.message_placeholder_name || 'Your Name (Optional)').cleanName,
          profile?.message_placeholder_content || 'Write a secret message...',
          decodeMessageSettings(profile?.message_placeholder_name || 'Your Name (Optional)').isEnabled,
          finalMemory
        ));
      }, 0);

    } catch (error: any) {
      console.error('Initialization error:', error);
      setErrorMsg(error.message || 'Failed to initialize profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges || !originalStateHash) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, originalStateHash, username, isPublic, profileMode, themePreset, customTheme, dynamicValues, links, messagePlaceholderName, messagePlaceholderContent, allowMessages]);

  const updateCustomTheme = (updates: any) => {
    setCustomTheme((prev: any) => ({ ...prev, ...updates }));
  };

  const handleModeChange = (newMode: ProfileMode) => {
    if (newMode === profileMode) return;
    setPendingMode(newMode);
    setShowModeSwitchConfirm(true);
  };

  const confirmModeSwitch = () => {
    if (!pendingMode) return;
    
    // Check if we have memory for pendingMode
    const pendingMemory = modeMemory[pendingMode] || {};
    const hasMemory = Object.keys(pendingMemory).length > 0;
    
    let newDynamicValues: Record<string, string>;
    
    if (hasMemory) {
      newDynamicValues = {
        full_name: pendingMemory.full_name || '',
        job_title: pendingMemory.job_title || '',
        company: pendingMemory.company || '',
        email: pendingMemory.email || '',
        phone: pendingMemory.phone || '',
        bio: pendingMemory.bio || '',
      };
    } else {
      newDynamicValues = migrateFieldData(profileMode, pendingMode, dynamicValues);
    }
    
    setDynamicValues(newDynamicValues);
    setModeMemory(prev => ({
      ...prev,
      [pendingMode]: newDynamicValues
    }));
    setProfileMode(pendingMode);
    
    // Auto-switch theme jika tidak kompatibel
    const compatibleThemes = getThemesByMode(pendingMode);
    const isCurrentThemeOK = compatibleThemes.find(t => t.id === themePreset);
    
    let nextTheme = themePreset;
    if (!isCurrentThemeOK && compatibleThemes.length > 0) {
      nextTheme = compatibleThemes[0].id;
      setThemePreset(nextTheme);
    }
    
    setShowModeSwitchConfirm(false);
    setPendingMode(null);
  };

  const handleThemeChange = (newTheme: string) => {
    setThemePreset(newTheme);
  };

  // --- HANDLERS ---
  const handleFieldChange = (field: string, value: string) => {
    setDynamicValues(prev => ({ ...prev, [field]: value }));
    setModeMemory(prev => ({
      ...prev,
      [profileMode]: {
        ...prev[profileMode],
        [field]: value
      }
    }));
  };

  const handleAddLink = () => {
    const newId = crypto.randomUUID();
    setLinks([{ id: newId, title: '', url: '' }, ...links]);
    setExpandedLinks(prev => ({ ...prev, [newId]: true }));
  };

  const toggleLinkExpansion = (id: string) => {
    setExpandedLinks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleToggleVisibility = (id: string) => {
    const link = links.find(l => l.id === id);
    const newVisibility = link?.is_visible === false ? true : false;
    setLinks(links.map(l => l.id === id ? { ...l, is_visible: newVisibility } : l));
  };

  const handleLinkChange = (id: string, field: 'title' | 'url', value: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const cleanLinkValue = (title: string, value: string) => {
    const lowerTitle = title.toLowerCase();
    let cleaned = value.trim();

    if (!cleaned) return cleaned;

    const socialPlatforms = ['instagram', 'twitter', 'x.com', 'tiktok', 'youtube', 'telegram', 'github', 'facebook', 'linkedin'];
    
    if (socialPlatforms.some(p => lowerTitle.includes(p))) {
      if (cleaned.startsWith('@')) {
        cleaned = cleaned.substring(1);
      }

      let urlToParse = cleaned;
      if (!cleaned.startsWith('http') && cleaned.includes('.')) {
        urlToParse = 'https://' + cleaned;
      }

      try {
        if (urlToParse.startsWith('http')) {
          const url = new URL(urlToParse);
          const hostname = url.hostname.toLowerCase();
          if (socialPlatforms.some(p => hostname.includes(p))) {
            const pathParts = url.pathname.split('/').filter(p => p.length > 0);
            
            if (hostname.includes('linkedin')) {
              if (pathParts[0] === 'in' && pathParts[1]) {
                cleaned = pathParts[1];
              } else if (pathParts[0]) {
                cleaned = pathParts[0];
              }
            } else if (hostname.includes('youtube')) {
              if (pathParts[0]) {
                cleaned = pathParts[0].replace(/^@/, '');
              }
            } else {
              if (pathParts[0]) {
                cleaned = pathParts[0];
              }
            }
          }
        }
      } catch (e) {
      }
    }

    if (lowerTitle.includes('whatsapp') || lowerTitle.includes('wa.me')) {
      cleaned = cleaned.replace(/[^0-9]/g, '');
    }

    return cleaned;
  };

  const handleLinkBlur = (id: string) => {
    setLinks(links.map(l => {
      if (l.id === id) {
        let newTitle = l.title;
        let newUrl = cleanLinkValue(l.title, l.url || '');
        
        if (!newTitle && newUrl) {
          const platformInfo = getPlatformInfo('', newUrl);
          if (platformInfo) {
            newTitle = platformInfo.id.charAt(0).toUpperCase() + platformInfo.id.slice(1);
            newUrl = cleanLinkValue(newTitle, l.url || '');
          }
        }
        
        return { ...l, title: newTitle, url: newUrl };
      }
      return l;
    }));
  };

  // --- SAVE LOGIC ---
  const handleSave = async (options: { overrides?: { mode?: ProfileMode; theme?: string } } = {}) => {
    try {
      setIsSaving(true);
      setErrorMsg(null);
      setShowSuccess(false);

      const currentMode = options.overrides?.mode || profileMode;
      const currentTheme = options.overrides?.theme || themePreset;

      const validationErrors = getValidationErrors(dynamicValues, currentMode as ProfileMode);
      if (validationErrors.length > 0) {
        setErrorMsg(validationErrors[0].message);
        setIsSaving(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required to save.');

      if (username.length > 0) {
        const usernameRegex = /^[a-z0-9._]{3,30}$/;
        if (!usernameRegex.test(username)) {
          throw new Error('Username must be between 3-30 characters and can only contain lowercase letters, numbers, dots, and underscores.');
        }
      }

      const encodedMessageName = encodeMessageSettings(messagePlaceholderName, allowMessages);
      
      const payload: any = {
        id: user.id,
        username: username || null,
        full_name: dynamicValues.full_name || '',
        job_title: dynamicValues.job_title || '',
        company: dynamicValues.company || '',
        email: dynamicValues.email || '',
        phone: dynamicValues.phone || null,
        bio: dynamicValues.bio || '',
        profile_mode: currentMode,
        theme_preset: currentTheme,
        custom_theme: customTheme,
        is_public: isPublic,
        message_placeholder_name: encodedMessageName,
        message_placeholder_content: messagePlaceholderContent,
        field_visibility: modeMemory
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(payload);

      if (profileError) {
        if (profileError.code === '23505') throw new Error('This username is already taken. Please choose another one.');
        throw new Error(`Profile Error: ${profileError.message}`);
      }

      // Links saving
      const validLinks = links.filter(l => l.title.trim() !== '' || l.url.trim() !== '');
      const validLinkIds = validLinks.map(l => l.id);

      if (validLinks.length > 0) {
        const linksToUpsert = validLinks.map((l, index) => ({
          id: l.id,
          profile_id: user.id,
          title: l.title.trim(),
          url: l.url.trim(),
          sort_order: index,
          is_visible: l.is_visible !== false
        }));
        await supabase.from('profile_links').upsert(linksToUpsert);
      }

      if (validLinkIds.length > 0) {
        await supabase.from('profile_links').delete().eq('profile_id', user.id).not('id', 'in', `(${validLinkIds.join(',')})`);
      } else {
        await supabase.from('profile_links').delete().eq('profile_id', user.id);
      }

      setOriginalStateHash(getCurrentStateHash(
        username,
        isPublic,
        currentMode,
        currentTheme,
        customTheme,
        dynamicValues,
        validLinks,
        messagePlaceholderName,
        messagePlaceholderContent,
        allowMessages,
        modeMemory
      ));

      setShowSuccess(true);
      if (username) await revalidateProfile(username);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error: any) {
      console.error('Save failed:', error);
      let friendlyError = error.message || 'An unexpected error occurred while saving.';
      if (friendlyError.includes('Lock broken') || friendlyError.includes('steal')) {
        friendlyError = 'Sesi terganggu oleh aktivitas di tab lain. Silakan coba klik Save sekali lagi.';
      }
      setErrorMsg(friendlyError);
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDER ---
  if (isLoading) return <ProfileSkeleton />;

  // --- PREVIEW PROFILE ---
  const previewProfile = {
    id: 'preview-id',
    username: username,
    fullName: dynamicValues.full_name || 'Your Name',
    bio: dynamicValues.bio || 'Your bio goes here',
    company: dynamicValues.company || '',
    email: dynamicValues.email || '',
    phone: dynamicValues.phone || '',
    website: dynamicValues.website || '',
    jobTitle: dynamicValues.job_title || '',
    links: links.filter(l => l.is_visible !== false),
    isPublic: isPublic,
    allowMessages: allowMessages,
    messagePlaceholderName: messagePlaceholderName,
    messagePlaceholderContent: messagePlaceholderContent,
    profileMode: profileMode,
    themePreset: themePreset,
    customTheme: customTheme
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-20">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Digital ID</h1>
          <p className="text-sm text-slate-500 mt-1">Customize your professional identity and links.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Link 
            href={`/u/${username || 'setup-username-first'}`} 
            target="_blank" 
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4 mr-2 text-slate-400" />
            Live Page
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8 items-start">
        {/* Main Content Column */}
        <div className="w-full space-y-6">

          {/* Section: Rifelo Appearance Studio */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
             {/* Studio Header (Compact) */}
             <div className="px-4 py-3 sm:px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
               <div className="flex items-center gap-2.5">
                 <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                   <Palette className="w-4 h-4" />
                 </div>
                 <h2 className="text-base sm:text-lg font-bold text-slate-900">Appearance</h2>
               </div>
             </div>

              <div className="p-4 sm:p-5">
                {/* Segmented Control: Persona | Theme | Shape | Font */}
                <div className="flex bg-slate-100/90 p-1.5 rounded-xl mb-4 overflow-x-auto hide-scrollbar gap-1">
                <button 
                  onClick={() => setActiveAppearanceTab('mode')} 
                  className={cn("flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-lg transition-all whitespace-nowrap", activeAppearanceTab === 'mode' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                >
                  Persona
                </button>
                <button 
                  onClick={() => setActiveAppearanceTab('theme')} 
                  className={cn("flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-lg transition-all whitespace-nowrap", activeAppearanceTab === 'theme' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                >
                  Theme
                </button>
                <button 
                  onClick={() => setActiveAppearanceTab('shape')} 
                  className={cn("flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-lg transition-all whitespace-nowrap", activeAppearanceTab === 'shape' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                >
                  Shape
                </button>
                <button 
                  onClick={() => setActiveAppearanceTab('font')} 
                  className={cn("flex-1 py-2.5 px-3 sm:px-4 text-sm sm:text-base font-semibold rounded-lg transition-all whitespace-nowrap", activeAppearanceTab === 'font' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700")}
                >
                  Font
                </button>
              </div>

              {/* Tab Content (Flexible height, no wasted space) */}
              <div>
                {activeAppearanceTab === 'mode' && (
                  <div className="animate-in fade-in duration-200">
                    <ModeSelector 
                      currentMode={profileMode}
                      onModeSelect={handleModeChange}
                    />
                  </div>
                )}
                
                {activeAppearanceTab === 'theme' && (
                  <div className="animate-in fade-in duration-200 space-y-4">
                    <ThemeSelector
                      currentMode={profileMode}
                      currentTheme={themePreset}
                      onThemeSelect={handleThemeChange}
                    />

                    {/* Accent Color: Available for Minimal & Glassmorphism Themes */}
                    {(themePreset === 'minimal' || themePreset === 'glassmorphism') && (
                      <div className="pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs sm:text-sm font-semibold text-slate-700">
                            {themePreset === 'glassmorphism' ? 'Glass Accent Color' : 'Minimal Accent Color'}
                          </span>
                          {customTheme?.accent?.name ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-600 font-medium">{customTheme.accent.name}</span>
                              <button
                                type="button"
                                onClick={() => updateCustomTheme({ accent: null })}
                                className="text-[11px] text-slate-400 hover:text-rose-600 underline transition-colors"
                              >
                                Reset
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">
                              {themePreset === 'glassmorphism' ? 'Frosted Crystal' : 'Default Monochrome'}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                          {ACCENT_COLORS.map(color => {
                            const isSelected = customTheme?.accent?.value === color.value;
                            return (
                              <button
                                key={color.id}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    updateCustomTheme({ accent: null });
                                  } else {
                                    updateCustomTheme({ accent: { value: color.value, name: color.name } });
                                  }
                                }}
                                className={cn(
                                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 transition-all hover:scale-105 shrink-0 flex items-center justify-center",
                                  isSelected ? "border-slate-900 scale-105 shadow-md ring-2 ring-slate-900/20" : "border-white shadow-sm",
                                  color.bg
                                )}
                                title={isSelected ? `${color.name} (Klik untuk lepas)` : color.name}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeAppearanceTab === 'shape' && (
                  <div className="animate-in fade-in duration-200 py-1">
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {/* Sharp */}
                      <button 
                        type="button"
                        onClick={() => updateCustomTheme({ borderRadius: 'sharp' })}
                        className={cn(
                          "flex items-center justify-center gap-2 p-2.5 sm:p-3 border-2 transition-all rounded-none",
                          (customTheme?.borderRadius) === 'sharp' ? "border-slate-900 bg-slate-900 text-white font-semibold shadow-sm" : "border-slate-200 bg-slate-50 hover:bg-white text-slate-700"
                        )}
                      >
                        <span className="w-3.5 h-3.5 border-2 border-current rounded-none shrink-0" />
                        <span className="text-xs sm:text-sm">Sharp</span>
                      </button>

                      {/* Rounded */}
                      <button 
                        type="button"
                        onClick={() => updateCustomTheme({ borderRadius: 'rounded' })}
                        className={cn(
                          "flex items-center justify-center gap-2 p-2.5 sm:p-3 border-2 transition-all rounded-xl",
                          (customTheme?.borderRadius || 'rounded') === 'rounded' ? "border-slate-900 bg-slate-900 text-white font-semibold shadow-sm" : "border-slate-200 bg-slate-50 hover:bg-white text-slate-700"
                        )}
                      >
                        <span className="w-3.5 h-3.5 border-2 border-current rounded-md shrink-0" />
                        <span className="text-xs sm:text-sm">Standard</span>
                      </button>

                      {/* Pill */}
                      <button 
                        type="button"
                        onClick={() => updateCustomTheme({ borderRadius: 'pill' })}
                        className={cn(
                          "flex items-center justify-center gap-2 p-2.5 sm:p-3 border-2 transition-all rounded-full",
                          (customTheme?.borderRadius) === 'pill' ? "border-slate-900 bg-slate-900 text-white font-semibold shadow-sm" : "border-slate-200 bg-slate-50 hover:bg-white text-slate-700"
                        )}
                      >
                        <span className="w-3.5 h-3.5 border-2 border-current rounded-full shrink-0" />
                        <span className="text-xs sm:text-sm">Pill</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeAppearanceTab === 'font' && (
                  <div className="animate-in fade-in duration-200 py-1">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {FONTS.map(font => (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => updateCustomTheme({ fontFamily: font.value })}
                          className={cn(
                            "flex items-center justify-between sm:justify-center gap-2 px-3 py-2 sm:py-2.5 border-2 transition-all rounded-xl",
                            (customTheme?.fontFamily || FONTS[0].value) === font.value ? "border-slate-900 bg-slate-900 text-white shadow-sm" : "border-slate-200 bg-slate-50 hover:bg-white text-slate-700"
                          )}
                        >
                          <span className={cn("text-xs sm:text-sm", font.class, (customTheme?.fontFamily || FONTS[0].value) === font.value ? "font-bold text-white" : "font-medium text-slate-700")}>{font.name}</span>
                          <span className={cn("text-sm opacity-70", font.class)}>Aa</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Preview directly integrated inside Appearance card */}
            <div className="border-t border-slate-100 py-6 sm:py-8 flex justify-center items-center overflow-hidden">
              {/* Scaled Device Wrapper with exact layout dimensions to fit 100% cleanly on mobile screen without clipping */}
              <div className="w-[270px] sm:w-[312px] h-[567px] sm:h-[654px] relative shrink-0 flex justify-center">
                  <div className="w-[416px] h-[872px] origin-top scale-[0.65] sm:scale-[0.75] shrink-0">
                    {/* Physical Smartphone Chassis (Exact 390x844 px screen ratio) */}
                    <div className="w-[416px] h-[872px] bg-[#0c0d12] rounded-[3.4rem] p-[13px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] border-[3.5px] border-slate-700/80 flex flex-col relative shrink-0 select-none">
                      
                      {/* Realistic Physical Buttons on Edge */}
                      <div className="absolute -left-[5.5px] top-28 w-[3.5px] h-7 bg-slate-700 rounded-l-sm" />
                      <div className="absolute -left-[5.5px] top-40 w-[3.5px] h-12 bg-slate-700 rounded-l-sm" />
                      <div className="absolute -left-[5.5px] top-56 w-[3.5px] h-12 bg-slate-700 rounded-l-sm" />
                      <div className="absolute -right-[5.5px] top-44 w-[3.5px] h-16 bg-slate-700 rounded-r-sm" />

                      {/* Top Speaker Ear-piece */}
                      <div className="w-16 h-1 bg-slate-800 rounded-full mx-auto mb-1.5 opacity-80" />

                      {/* Phone Screen Viewport (Exact 390px x 844px) */}
                      <div 
                        className="w-[390px] h-[844px] rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-inner [transform:translateZ(0)]"
                        style={{ 
                          background: previewProfile.customTheme?.colors?.background || getTheme(themePreset)?.colors?.background || '#ffffff' 
                        }}
                      >
                        {/* Realistic Native Status Bar */}
                        <div className={cn(
                          "h-10 px-6 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-30 relative",
                          (themePreset === 'brutalism' || themePreset === 'phantom-deck') ? "text-white" : "text-slate-900"
                        )}>
                          <span className="tracking-tight font-medium">9:41</span>

                          {/* Status Icons */}
                          <div className="flex items-center gap-1.5 opacity-90 text-[10px]">
                            <div className="flex items-end gap-[1.5px] h-2.5">
                              <div className="w-[2px] h-1 bg-current rounded-2xs" />
                              <div className="w-[2px] h-1.5 bg-current rounded-2xs" />
                              <div className="w-[2px] h-2 bg-current rounded-2xs" />
                              <div className="w-[2px] h-2.5 bg-current rounded-2xs" />
                            </div>
                            <span className="text-[9px] font-bold">5G</span>
                            <div className="w-4 h-2.5 border border-current rounded-xs p-[1px] flex items-center">
                              <div className="w-full h-full bg-current rounded-2xs" />
                            </div>
                          </div>
                        </div>

                        {/* Scrollable Viewport with interactive events enabled */}
                        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden scroll-smooth overscroll-contain touch-pan-y">
                          <PublicProfileView profile={previewProfile} />
                        </div>

                        {/* Bottom iOS Home Indicator Bar */}
                        <div className="h-5 w-full shrink-0 flex items-center justify-center relative z-20 pointer-events-none">
                          <div className={cn(
                            "w-36 h-1 rounded-full",
                            (themePreset === 'brutalism' || themePreset === 'phantom-deck') ? "bg-white/30" : "bg-black/30"
                          )} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Section 3: Dynamic Fields */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            
            <div className="pb-6 border-b border-slate-100">
              {/* Top row: URL/Username label and Public Profile Visibility toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2 mb-3 sm:mb-2">
                <label className="block text-sm font-medium text-slate-900 order-2 sm:order-1">URL/Username</label>
                
                <div className="flex items-center justify-between sm:justify-end shrink-0 order-1 sm:order-2">
                  <span className="mr-3 text-sm font-medium text-slate-900 whitespace-nowrap">Public Profile Visibility</span>
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 border focus:outline-none ${
                      isPublic 
                        ? 'bg-emerald-500/15 border-emerald-500/30 backdrop-blur-sm' 
                        : 'bg-slate-100/70 border-slate-200 backdrop-blur-sm'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full shadow-md transition-transform duration-300 ${
                      isPublic ? 'translate-x-6 bg-emerald-500' : 'translate-x-1 bg-slate-400'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Input Box */}
              <div className="max-w-xl">
                <div className="flex items-stretch">
                  <span className="flex items-center px-4 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-medium whitespace-nowrap text-sm sm:text-base">
                    rifelo.id/u/
                  </span>
                  <input 
                    type="text" 
                    value={username}
                    onFocus={() => setIsUsernameFocused(true)}
                    onBlur={() => setIsUsernameFocused(false)}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium text-sm sm:text-base" 
                  />
                </div>
                {isUsernameFocused && (
                  <p className="text-xs text-slate-500 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    Only lowercase letters, numbers, dot (.), and underscore (_).
                  </p>
                )}
              </div>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-4">Profile Information</h2>
            <DynamicProfileForm
              mode={profileMode}
              initialValues={dynamicValues}
              onChange={handleFieldChange}
            />
          </div>

          {/* Section 4: Links & Platforms */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Platforms & Links</h3>
                <p className="text-sm text-slate-500 mt-1">Add your social media, portfolio, or contact links.</p>
              </div>
              <button 
                type="button"
                onClick={handleAddLink}
                className="flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </button>
            </div>

            <div className="space-y-4">
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={links.map(l => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {links.map((link) => (
                    <SortableLinkItem
                      key={link.id}
                      link={link}
                      isExpanded={!!expandedLinks[link.id]}
                      toggleLinkExpansion={toggleLinkExpansion}
                      handleToggleVisibility={handleToggleVisibility}
                      handleRemoveLink={handleRemoveLink}
                      handleLinkChange={handleLinkChange}
                      handleLinkBlur={handleLinkBlur}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              
              {links.length === 0 && (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                  <p className="text-sm text-slate-500">No links added yet.<br/>Click "Add Link" to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Message Box Settings */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0">
              <div className="order-2 sm:order-1">
                <h3 className="text-lg font-bold text-slate-900">Message Box Settings</h3>
                <p className="text-sm text-slate-500 mt-1">Customize the placeholders for the message box on your public profile.</p>
              </div>
              <div className="flex items-center justify-between sm:justify-end shrink-0 order-1 sm:order-2">
                <span className="mr-3 text-sm font-medium text-slate-900">Enable Message Box</span>
                <button
                  type="button"
                  onClick={() => setAllowMessages(!allowMessages)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 border focus:outline-none ${
                    allowMessages 
                      ? 'bg-emerald-500/15 border-emerald-500/30 backdrop-blur-sm' 
                      : 'bg-slate-100/70 border-slate-200 backdrop-blur-sm'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full shadow-md transition-transform duration-300 ${
                    allowMessages ? 'translate-x-6 bg-emerald-500' : 'translate-x-1 bg-slate-400'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${allowMessages ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name Input Placeholder</label>
                <input 
                  type="text" 
                  value={messagePlaceholderName}
                  onChange={(e) => setMessagePlaceholderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message Input Placeholder</label>
                <input 
                  type="text" 
                  value={messagePlaceholderContent}
                  onChange={(e) => setMessagePlaceholderContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (Unsaved Changes) */}
      <div 
        className={`fixed bottom-24 md:bottom-24 right-6 md:right-8 z-50 pointer-events-none transition-all duration-500 ease-out flex justify-end
          ${(hasUnsavedChanges || isSaving || showSuccess || errorMsg) ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0'}`}
      >
          <div className="pointer-events-auto flex items-center">
            <div className={`backdrop-blur-xl border shadow-lg rounded-xl p-2 flex items-center gap-3 transition-colors duration-300
              ${showSuccess ? 'bg-emerald-50/90 border-emerald-200' : 'bg-white/90 border-slate-200'}
            `}>
              <div className="flex items-center">
                {errorMsg && (
                  <span className="flex items-center text-[13px] text-red-600 font-medium px-2 animate-in fade-in slide-in-from-right-2">
                    <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                    {errorMsg}
                  </span>
                )}
                {showSuccess && !errorMsg && (
                  <span className="flex items-center text-[13px] text-emerald-700 font-medium px-2 animate-in fade-in slide-in-from-right-2">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                    Saved
                  </span>
                )}
                {!showSuccess && !errorMsg && hasUnsavedChanges && (
                  <span className="flex items-center text-[13px] text-amber-600 font-medium px-2 animate-in fade-in">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                    Unsaved changes
                  </span>
                )}
              </div>
              <div className="flex items-center shrink-0">
                <button 
                  onClick={() => handleSave()} 
                  disabled={isSaving || (!hasUnsavedChanges && !errorMsg)}
                  className={`flex justify-center items-center px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm
                    ${showSuccess ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : showSuccess ? <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                  {isSaving ? 'Saving' : showSuccess ? 'Done' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Confirmation Modal */}
      {pendingMode && (
        <ModeSwitchConfirmation
          isOpen={showModeSwitchConfirm}
          fromMode={profileMode}
          toMode={pendingMode}
          onConfirm={confirmModeSwitch}
          onCancel={() => {
            setShowModeSwitchConfirm(false);
            setPendingMode(null);
          }}
        />
      )}
    </div>
  );
}
