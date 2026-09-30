'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Shield, Trash2, Save, Sparkles,
  Palette, Copy, Search, AlertCircle, CheckCircle2, Loader2,
  Settings, RefreshCw, ExternalLink, Lock, Unlock, UserMinus,
  Check, ArrowUpRight, Share2, Info
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastContext';
import { updateCircleIdentity, updateMemberColor } from '@/app/actions/circle';

// Curated luxury Rifelo color palettes
const COLOR_PRESETS = [
  { name: 'Rifelo Gold', hex: '#D4AF37' },
  { name: 'Slate Grey', hex: '#64748B' },
  { name: 'Deep Emerald', hex: '#0D9488' },
  { name: 'Royal Cobalt', hex: '#2563EB' },
  { name: 'Amethyst', hex: '#8B5CF6' },
  { name: 'Warm Wine', hex: '#BE185D' },
];

const CircleNameDisplay = ({ name, isVisible }: { name: string; isVisible: boolean }) => {
  const lines = (name || 'Untitled').split('\n').slice(0, 3);
  
  // Calculate length to determine font size dynamically
  const maxLineLength = Math.max(...lines.map(l => l.length));
  let textSizeClass = 'text-lg';
  if (maxLineLength > 8 || lines.length > 1) textSizeClass = 'text-base';
  if (maxLineLength > 12 || lines.length === 3) textSizeClass = 'text-sm';
  if (maxLineLength > 18) textSizeClass = 'text-xs';

  return (
    <div className={`font-black ${textSizeClass} tracking-widest text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] relative z-20 transition-opacity duration-500 delay-300 px-3 text-center flex flex-col items-center justify-center leading-tight w-full h-full ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {lines.map((line, idx) => (
        <span key={idx} className="block w-full break-words">
          {line}
        </span>
      ))}
    </div>
  );
};

const HexColorSelector = ({
  value,
  onChange,
  disabled = false,
  presets = COLOR_PRESETS,
}: {
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
  presets?: { name: string; hex: string }[];
}) => {
  const [inputText, setInputText] = useState(value.replace('#', ''));

  useEffect(() => {
    setInputText(value.replace('#', ''));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
    setInputText(clean);

    if (clean.length === 6) {
      onChange(`#${clean.toUpperCase()}`);
    } else if (clean.length === 3) {
      const full = clean.split('').map(c => c + c).join('');
      onChange(`#${full.toUpperCase()}`);
    }
  };

  const handleBlur = () => {
    if (inputText.length !== 6 && inputText.length !== 3) {
      setInputText(value.replace('#', ''));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Quick Color Presets */}
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((preset) => {
          const isSelected = value.toLowerCase() === preset.hex.toLowerCase();
          return (
            <button
              key={preset.hex}
              type="button"
              disabled={disabled}
              onClick={() => {
                onChange(preset.hex);
                setInputText(preset.hex.replace('#', ''));
              }}
              className={`w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all ${
                isSelected 
                  ? 'ring-2 ring-slate-900 ring-offset-2 scale-105' 
                  : 'hover:scale-105 opacity-85 hover:opacity-100'
              } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              style={{ backgroundColor: preset.hex }}
              title={preset.name}
            >
              {isSelected && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
            </button>
          );
        })}
      </div>

      {/* Integrated Color Picker Swatch + Direct Typing/Paste Hex Input */}
      <div 
        className={`flex items-center bg-white border border-slate-200/90 rounded-xl px-3 py-2 shadow-2xs hover:border-slate-300 focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all ${
          disabled ? 'opacity-60 pointer-events-none bg-slate-50' : ''
        }`}
      >
        {/* Clickable Color Swatch that opens native picker */}
        <label 
          className="relative flex items-center justify-center cursor-pointer mr-2.5 shrink-0 group" 
          title="Click to open color palette picker"
        >
          <input
            type="color"
            value={value}
            onChange={(e) => {
              const hex = e.target.value.toUpperCase();
              onChange(hex);
              setInputText(hex.replace('#', ''));
            }}
            disabled={disabled}
            className="sr-only"
          />
          <div 
            className="w-6 h-6 rounded-lg border border-black/15 shadow-inner transition-transform group-hover:scale-110 active:scale-95 flex items-center justify-center" 
            style={{ backgroundColor: value }}
          >
            <Palette className="w-3 h-3 text-white/90 drop-shadow-xs opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </label>

        {/* Editable / Pasteable Hex code input */}
        <span className="font-mono text-sm font-semibold text-slate-400 select-none">#</span>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="D4AF37"
          maxLength={6}
          className="w-20 font-mono text-sm font-bold text-slate-900 uppercase focus:outline-none bg-transparent ml-1 tracking-wider placeholder:text-slate-300"
          title="Type or paste Hex Color (e.g. D4AF37)"
        />
      </div>
    </div>
  );
};

export default function CircleManagementPage() {
  const router = useRouter();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'identity' | 'roster'>('identity');
  
  // State
  const [activeCircle, setActiveCircle] = useState<any>(null);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Identity State
  const [circleName, setCircleName] = useState('');
  const [circleDescription, setCircleDescription] = useState('');
  const [resonanceColor, setResonanceColor] = useState('#D4AF37');
  const [myColor, setMyColor] = useState('#D4AF37');
  const [whoCanEdit, setWhoCanEdit] = useState<'admin' | 'all'>('all');
  
  // Settings & Delete State
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Roster State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('Member');
  
  // Hash for tracking unsaved changes
  const [originalStateHash, setOriginalStateHash] = useState<string>('');

  const getCurrentStateHash = (
    cn = circleName,
    cd = circleDescription,
    rc = resonanceColor,
    mc = myColor
  ) => {
    return JSON.stringify({ cn: cn.trim(), cd: cd.trim(), rc, mc });
  };

  const hasUnsavedChanges = !isLoading && originalStateHash !== '' && originalStateHash !== getCurrentStateHash();

  useEffect(() => {
    const savedTab = localStorage.getItem('circleActiveTab');
    if (savedTab && (savedTab === 'identity' || savedTab === 'roster')) {
      setActiveTab(savedTab as any);
    }
  }, []);

  const handleTabChange = (tab: 'identity' | 'roster') => {
    setActiveTab(tab);
    localStorage.setItem('circleActiveTab', tab);
  };

  useEffect(() => {
    const handleWorkspaceChange = () => {
      const stored = localStorage.getItem('activeWorkspaceId');
      setActiveWorkspaceId(prev => prev === stored ? prev : stored);
    };
    handleWorkspaceChange();
    window.addEventListener('workspace-changed', handleWorkspaceChange);
    return () => window.removeEventListener('workspace-changed', handleWorkspaceChange);
  }, []);

  useEffect(() => {
    const fetchCircleData = async () => {
      if (!activeWorkspaceId || activeWorkspaceId === 'personal' || activeWorkspaceId === 'admin') {
        if (activeWorkspaceId) router.push('/profile');
        return;
      }
      
      // Only show full skeleton on initial load when data is not yet cached
      if (!activeCircle) {
        setIsLoading(true);
      }
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          if (sessionError.message.includes('Refresh Token Not Found') || sessionError.message.includes('Invalid Refresh Token')) {
            await supabase.auth.signOut();
            router.push('/login');
            return;
          }
        }
        if (session) {
          setCurrentUser(session.user);
        }

        // Fetch circle details
        const { data: circleData, error: circleError } = await supabase
          .from('circles')
          .select('*')
          .eq('id', activeWorkspaceId)
          .single();

        if (circleError) throw circleError;
        setActiveCircle(circleData);
        setCircleName(circleData.name || '');
        
        let parsedDesc = '';
        let parsedColor = '#D4AF37';
        let parsedWhoCanEdit: 'admin' | 'all' = 'all';

        // Parse branding from description JSON
        if (circleData.description?.startsWith('{')) {
          try {
            const parsed = JSON.parse(circleData.description);
            parsedDesc = parsed.originalDescription || '';
            parsedColor = parsed.resonanceColor || '#D4AF37';
            parsedWhoCanEdit = parsed.whoCanEdit || 'all';
          } catch (e) {
            parsedDesc = circleData.description || '';
          }
        } else {
          parsedDesc = circleData.description || '';
        }

        setCircleDescription(parsedDesc);
        setResonanceColor(parsedColor);
        setWhoCanEdit(parsedWhoCanEdit);

        // Fetch members
        const { data: dataWithColor, error: errorWithColor } = await supabase
          .from('circle_members')
          .select(`
            id,
            role,
            color,
            profile_id,
            profiles (
              id,
              full_name,
              username
            )
          `)
          .eq('circle_id', activeWorkspaceId);

        let memberData: any = dataWithColor;
        if (errorWithColor && errorWithColor.message.includes('color')) {
          const { data: fallbackData } = await supabase
            .from('circle_members')
            .select(`
              id,
              role,
              profile_id,
              profiles (
                id,
                full_name,
                username
              )
            `)
            .eq('circle_id', activeWorkspaceId);
          memberData = fallbackData;
        }

        setMembers(memberData || []);
        
        let initialMyColor = '#D4AF37';
        if (memberData && session?.user) {
          const me = memberData.find((m: any) => m.profile_id === session.user.id);
          if (me) {
            setCurrentUserRole(me.role || 'Member');
            if (me.color) {
              setMyColor(me.color);
              initialMyColor = me.color;
            }
          }
        }

        setOriginalStateHash(getCurrentStateHash(
          circleData.name || '',
          parsedDesc,
          parsedColor,
          initialMyColor
        ));

      } catch (error) {
        console.error('Error fetching circle data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCircleData();

    // Realtime member updates
    const channel = supabase
      .channel(`circle-members-${activeWorkspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'circle_members',
          filter: `circle_id=eq.${activeWorkspaceId}`
        },
        async () => {
          const { data } = await supabase
            .from('circle_members')
            .select(`
              id,
              role,
              color,
              profile_id,
              profiles (
                id,
                full_name,
                username
              )
            `)
            .eq('circle_id', activeWorkspaceId);
          if (data) setMembers(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeWorkspaceId]);

  const isAdmin = currentUserRole === 'Admin' || currentUserRole === 'admin';
  const canEditDetails = whoCanEdit === 'all' || isAdmin;

  // --- SAVE IDENTITY & BRANDING ---
  const handleSaveIdentity = async () => {
    if (!activeCircle) return;
    setIsSaving(true);
    
    try {
      if (canEditDetails) {
        let existingData = {};
        try {
          if (activeCircle?.description?.startsWith('{')) {
            existingData = JSON.parse(activeCircle.description);
          }
        } catch (e) {}

        const brandingData = {
          ...existingData,
          originalDescription: circleDescription,
          resonanceColor,
          whoCanEdit
        };
        
        const result = await updateCircleIdentity(
          activeCircle.id,
          circleName.trim(),
          JSON.stringify(brandingData)
        );
          
        if (!result.success) throw new Error(result.error);

        setActiveCircle({
          ...activeCircle,
          name: circleName.trim(),
          description: JSON.stringify(brandingData)
        });
      }
      
      // Save member's personal color
      if (currentUser && activeCircle) {
        const memberResult = await updateMemberColor(activeCircle.id, currentUser.id, myColor);
        if (!memberResult.success) {
          console.warn('Fallback saving color via client supabase:', memberResult.error);
          await supabase
            .from('circle_members')
            .update({ color: myColor })
            .eq('circle_id', activeCircle.id)
            .eq('profile_id', currentUser.id);
        }
        setMembers(prev => prev.map(m => m.profile_id === currentUser.id ? { ...m, color: myColor } : m));
      }
      
      setOriginalStateHash(getCurrentStateHash(circleName, circleDescription, resonanceColor, myColor));
      showSuccessToast('Circle updated successfully!');
      
    } catch (error: any) {
      console.error('Error saving circle:', error);
      showErrorToast(error.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- SHORTCUT (CMD+S) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && canEditDetails) {
          handleSaveIdentity();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, canEditDetails, circleName, circleDescription, resonanceColor, myColor]);

  // --- REGENERATE INVITE CODE ---
  const handleRegenerateCode = async () => {
    if (!activeCircle || !isAdmin) return;
    if (!confirm('Regenerate invite code? The previous invite code will stop working immediately.')) return;
    
    setIsSaving(true);
    try {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { error } = await supabase
        .from('circles')
        .update({ invite_code: newCode })
        .eq('id', activeCircle.id);
        
      if (error) throw error;
      
      setActiveCircle({ ...activeCircle, invite_code: newCode });
      showSuccessToast('New invite code generated!');
    } catch (error) {
      console.error('Error regenerating code:', error);
      showErrorToast('Failed to regenerate invite code.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- REMOVE MEMBER ---
  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!isAdmin) return;
    if (!confirm(`Are you sure you want to remove "${memberName || 'this member'}" from the circle?`)) return;
    
    try {
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      setMembers(members.filter(m => m.id !== memberId));
      showSuccessToast('Member removed.');
    } catch (error) {
      console.error('Error removing member:', error);
      showErrorToast('Failed to remove member.');
    }
  };

  // --- LEAVE CIRCLE ---
  const handleLeaveCircle = async () => {
    if (!confirm('Are you sure you want to leave this circle? You will need an invite code to rejoin.')) return;
    
    try {
      const myMembership = members.find(m => m.profile_id === currentUser?.id);
      if (!myMembership) return;
      
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('id', myMembership.id);
        
      if (error) throw error;
      
      localStorage.setItem('activeWorkspaceId', 'personal');
      window.dispatchEvent(new Event('workspace-changed'));
      router.push('/profile');
    } catch (error) {
      console.error('Error leaving circle:', error);
      showErrorToast('Failed to leave circle.');
    }
  };

  // --- DELETE CIRCLE ---
  const handleDeleteCircle = async () => {
    if (!isAdmin || !activeCircle) return;
    if (deleteConfirmation.trim() !== activeCircle.name.trim()) {
      showErrorToast('Confirmation name does not match.');
      return;
    }
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('circles')
        .delete()
        .eq('id', activeCircle.id);
        
      if (error) throw error;
      
      localStorage.setItem('activeWorkspaceId', 'personal');
      window.dispatchEvent(new Event('workspace-changed'));
      router.push('/profile');
    } catch (error) {
      console.error('Error deleting circle:', error);
      showErrorToast('Failed to delete circle.');
      setIsDeleting(false);
    }
  };

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const name = member.profiles?.full_name?.toLowerCase() || '';
      const username = member.profiles?.username?.toLowerCase() || '';
      const q = searchTerm.toLowerCase();
      return name.includes(q) || username.includes(q);
    }).sort((a, b) => {
      if (a.role === 'Admin' && b.role !== 'Admin') return -1;
      if (a.role !== 'Admin' && b.role === 'Admin') return 1;
      return 0;
    });
  }, [members, searchTerm]);

  // --- SKELETON LOADING STATE ---
  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8 font-sans max-w-5xl mx-auto pb-24 animate-pulse w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-44 bg-slate-200 rounded-lg" />
            <div className="h-4 w-72 bg-slate-100 rounded-md" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-28 bg-slate-100 rounded-xl" />
            <div className="h-10 w-32 bg-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Tab Bar Skeleton (Centered) */}
        <div className="flex justify-center w-full">
          <div className="h-11 w-64 bg-slate-100 rounded-2xl p-1 flex gap-1">
            <div className="flex-1 bg-white rounded-xl shadow-xs" />
            <div className="flex-1 rounded-xl" />
          </div>
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Card Skeleton */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-3 w-52 bg-slate-100 rounded" />
              </div>
            </div>

            {/* Field: Name */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-slate-100 rounded" />
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
            </div>

            {/* Field: Description */}
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-100 rounded" />
              <div className="h-20 w-full bg-slate-100 rounded-xl" />
            </div>

            <div className="h-px bg-slate-100" />

            {/* Field: Circle Accent Color */}
            <div className="space-y-2.5">
              <div className="h-3 w-36 bg-slate-100 rounded" />
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-8.5 h-8.5 rounded-xl bg-slate-100" />
                  ))}
                </div>
                <div className="h-9 w-28 bg-slate-100 rounded-xl" />
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Field: Personal Member Accent */}
            <div className="space-y-2.5">
              <div className="h-3 w-48 bg-slate-100 rounded" />
              <div className="h-2.5 w-60 bg-slate-50 rounded" />
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-8.5 h-8.5 rounded-xl bg-slate-100" />
                  ))}
                </div>
                <div className="h-9 w-28 bg-slate-100 rounded-xl" />
              </div>
            </div>

            {/* Save Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-100 rounded" />
              <div className="h-9 w-32 bg-slate-200 rounded-xl" />
            </div>
          </div>

          {/* Right Column: Physical Smartphone Chassis Skeleton */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-6 w-full py-4 lg:py-0">
            <div className="flex items-center justify-between w-full max-w-[312px] px-1 mb-2">
              <div className="h-3 w-20 bg-slate-100 rounded" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>

            {/* Scaled Device Wrapper */}
            <div className="w-[270px] sm:w-[312px] h-[567px] sm:h-[654px] relative shrink-0 flex justify-center my-auto">
              <div className="w-[416px] h-[872px] origin-top scale-[0.65] sm:scale-[0.75] shrink-0 [transform:translateZ(0)]">
                {/* Physical Smartphone Chassis */}
                <div className="w-[416px] h-[872px] bg-[#0c0d12] rounded-[3.4rem] p-[13px] border-[3.5px] border-slate-800 flex flex-col relative shrink-0 select-none shadow-xl">
                  {/* Buttons on edge */}
                  <div className="absolute -left-[5.5px] top-28 w-[3.5px] h-7 bg-slate-800 rounded-l-sm" />
                  <div className="absolute -left-[5.5px] top-40 w-[3.5px] h-12 bg-slate-800 rounded-l-sm" />
                  <div className="absolute -left-[5.5px] top-56 w-[3.5px] h-12 bg-slate-800 rounded-l-sm" />
                  <div className="absolute -right-[5.5px] top-44 w-[3.5px] h-16 bg-slate-800 rounded-r-sm" />

                  {/* Top Speaker Ear-piece */}
                  <div className="w-16 h-1 bg-slate-800 rounded-full mx-auto mb-1.5 opacity-80" />

                  {/* Phone Screen Viewport */}
                  <div className="w-[390px] h-[844px] rounded-[2.5rem] overflow-hidden flex flex-col justify-between items-center bg-[#0c0e0b] p-6 relative">
                    {/* Status bar */}
                    <div className="w-full flex justify-between items-center text-white/30 text-xs px-2 pt-1">
                      <div className="h-3 w-8 bg-white/10 rounded" />
                      <div className="h-3 w-12 bg-white/10 rounded" />
                    </div>

                    {/* Top Content */}
                    <div className="space-y-2 mt-4 text-center">
                      <div className="h-7 w-40 bg-white/10 rounded-lg mx-auto" />
                      <div className="h-3 w-28 bg-white/5 rounded mx-auto" />
                    </div>

                    {/* Visualizer Sphere Skeleton */}
                    <div className="relative w-[280px] h-[280px] rounded-full border border-dashed border-white/5 flex items-center justify-center my-4">
                      <div className="w-36 h-36 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <div className="h-4 w-20 bg-white/10 rounded" />
                      </div>
                      <div className="w-4 h-4 rounded-full bg-white/10 absolute -top-2 left-1/2 -translate-x-1/2" />
                      <div className="w-4 h-4 rounded-full bg-white/10 absolute -bottom-2 left-1/2 -translate-x-1/2" />
                    </div>

                    {/* Member rows skeleton */}
                    <div className="space-y-2 w-full max-w-[200px] mb-4">
                      <div className="h-2.5 w-32 bg-white/5 rounded mx-auto" />
                      <div className="h-2.5 w-24 bg-white/5 rounded mx-auto" />
                    </div>

                    {/* iOS Home bar */}
                    <div className="w-36 h-1 rounded-full bg-white/10 mb-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeCircle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Circle Unavailable</h3>
        <p className="text-sm text-slate-500">This workspace is inaccessible or no longer exists.</p>
        <Link 
          href="/profile" 
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          Return to Profile
        </Link>
      </div>
    );
  }

  const publicUrl = `/c/${activeCircle.slug || activeCircle.invite_code}`;

  return (
    <div className="space-y-6 sm:space-y-8 font-sans max-w-5xl mx-auto pb-28 md:pb-16 w-full">
      {/* ============================================================ */}
      {/* 1. UNIFIED PAGE HEADER (Mobile & Laptop Specifics)            */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {activeCircle.name || 'Untitled Circle'}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isAdmin 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              {currentUserRole}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage collective identity, members, and shared digital presence.
          </p>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          {/* Invite Code Badge with 1-click copy */}
          <div className="flex items-center bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 rounded-xl p-1 transition-all">
            <button
              onClick={() => {
                navigator.clipboard.writeText(activeCircle.invite_code);
                setIsCopied(true);
                showSuccessToast('Invite code copied to clipboard!');
                setTimeout(() => setIsCopied(false), 2000);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold tracking-widest text-slate-800 hover:text-slate-950 active:scale-95 transition-all"
              title="Click to copy invite code"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">COPIED</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{activeCircle.invite_code}</span>
                </>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={handleRegenerateCode}
                disabled={isSaving}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors border-l border-slate-200"
                title="Regenerate invite code"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          {/* View Public Hub button */}
          <Link
            href={publicUrl}
            target="_blank"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-all shadow-2xs active:scale-95"
          >
            <span>Public Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STANDARDIZED SEGMENTED TABS (Centered & Single Row)       */}
      {/* ============================================================ */}
      <div className="flex justify-center w-full">
        <div className="relative inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 max-w-full overflow-x-auto hide-scrollbar flex-nowrap shrink-0">
          {[
            { id: 'identity', label: 'Identity & Brand', icon: Palette },
            { id: 'roster', label: `Members (${members.length})`, icon: Users }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`relative flex items-center justify-center px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 z-10 ${
                  isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="circleActiveTab"
                    className="absolute inset-0 bg-white shadow-2xs rounded-xl"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <div className="relative z-20 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. TAB 1: IDENTITY & BRAND (BENTO GRID 7:5)                  */}
      {/* ============================================================ */}
      {activeTab === 'identity' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Permission Notice if member cannot edit */}
          {!canEditDetails && (
            <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                General details can only be modified by Circle Admins. You can still customize your personal member accent color below.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (Left: 7 cols on Desktop) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              {/* Card Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Circle Identity</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Define name, description, and accent themes</p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Field: Circle Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Circle Name
                  </label>
                  <input
                    type="text"
                    required
                    value={circleName}
                    onChange={(e) => canEditDetails && setCircleName(e.target.value)}
                    disabled={!canEditDetails}
                    placeholder="e.g. Creative Collective"
                    className={`w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all ${
                      !canEditDetails ? 'opacity-70 bg-slate-50 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                {/* Field: Description / Bio */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Description / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={circleDescription}
                    onChange={(e) => canEditDetails && setCircleDescription(e.target.value)}
                    disabled={!canEditDetails}
                    placeholder="Describe your space, community mission, or guidelines..."
                    className={`w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all resize-none leading-relaxed ${
                      !canEditDetails ? 'opacity-70 bg-slate-50 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                <div className="h-px bg-slate-100" />

                {/* Field: Theme Accent Color (Resonance) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Circle Accent Color
                  </label>
                  <HexColorSelector
                    value={resonanceColor}
                    onChange={(hex) => setResonanceColor(hex)}
                    disabled={!canEditDetails}
                    presets={COLOR_PRESETS}
                  />
                </div>

                <div className="h-px bg-slate-100" />

                {/* Field: Personal Member Aura Color */}
                <div>
                  <div className="mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Your Personal Member Accent
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">Your unique badge halo when interacting in this circle.</p>
                  </div>
                  <HexColorSelector
                    value={myColor}
                    onChange={(hex) => {
                      setMyColor(hex);
                      setMembers(prev => prev.map(m => (m.profile_id === currentUser?.id) ? { ...m, color: hex } : m));
                    }}
                    presets={COLOR_PRESETS}
                  />
                </div>

                {/* In-Card Save Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {hasUnsavedChanges ? 'Changes unsaved' : 'All changes saved'}
                  </span>

                  <button
                    type="button"
                    onClick={handleSaveIdentity}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-2xs active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Smartphone Preview (Exact Mockup Chassis from /profile) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-6 w-full py-4 lg:py-0">
              <div className="flex items-center justify-between w-full max-w-[312px] px-1 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Live Preview</span>
                <span className="text-[11px] text-slate-400 font-mono">Mobile View</span>
              </div>

              {/* Scaled Device Wrapper matching /profile */}
              <div className="w-[270px] sm:w-[312px] h-[567px] sm:h-[654px] relative shrink-0 flex justify-center my-auto">
                <div className="w-[416px] h-[872px] origin-top scale-[0.65] sm:scale-[0.75] shrink-0 [transform:translateZ(0)]">
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
                      className="w-[390px] h-[844px] rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-inner bg-[#0c0e0b] text-white [transform:translateZ(0)]"
                      style={{
                        backgroundImage: `radial-gradient(ellipse at 50% 30%, ${resonanceColor}25 0%, transparent 75%)`
                      }}
                    >
                      {/* Realistic Native Status Bar */}
                      <div className="h-10 px-6 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-30 relative text-white">
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

                      {/* Phone Screen Content (Complete 100% /circle Public Page) */}
                      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col items-center justify-between py-6 px-4 relative z-10">
                        {/* Top Header: Circle Name & Private Live Space */}
                        <div className="text-center z-20 mt-4 mb-2 shrink-0">
                          <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-1">
                            {circleName.trim() || 'Test'}
                          </h1>
                          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                            Private Live Space
                          </p>
                        </div>

                        {/* Visualization Hub with Orbit & Member Names */}
                        <div className="relative w-[280px] h-[280px] flex items-center justify-center z-10 shrink-0 my-4">
                          {/* Orbit Track Guideline */}
                          <div className="absolute inset-[15px] rounded-full border border-dashed border-white/10 pointer-events-none" />

                          {/* Orbiting Members Container */}
                          <div 
                            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-spin"
                            style={{ animationDuration: '24s', animationTimingFunction: 'linear' }}
                          >
                            {(members.length > 0 ? members : [
                              { id: '1', profile_id: currentUser?.id, profiles: { full_name: 'You' }, color: myColor },
                              { id: '2', profiles: { full_name: 'Member 2' }, color: resonanceColor }
                            ]).map((member, i, arr) => {
                              const total = arr.length;
                              const angle = (i / total) * Math.PI * 2;
                              const radius = 115;
                              const x = Math.cos(angle) * radius;
                              const y = Math.sin(angle) * radius;
                              const isMe = member.profile_id ? member.profile_id === currentUser?.id : i === 0;
                              const color = isMe ? myColor : (member.color || resonanceColor);
                              const memberName = member.profiles?.full_name || member.profiles?.username || `Member ${i + 1}`;

                              return (
                                <div
                                  key={member.id || i}
                                  className="absolute flex items-center justify-center"
                                  style={{
                                    transform: `translate(${x}px, ${y}px)`
                                  }}
                                >
                                  {/* Aura Dot */}
                                  <div
                                    className="w-4 h-4 rounded-full border border-white/30 shadow-md relative"
                                    style={{
                                      backgroundColor: color,
                                      boxShadow: `0 0 12px ${color}`
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>

                          {/* Center Merged Sphere */}
                          <div
                            className="w-36 h-36 rounded-full z-30 flex items-center justify-center p-3 text-center transition-all border border-white/10 relative overflow-hidden"
                            style={{
                              backgroundColor: '#0c0e0b',
                              backgroundImage: `radial-gradient(circle, ${resonanceColor} 0%, transparent 80%)`,
                              boxShadow: `0 0 60px ${resonanceColor}, inset 0 0 20px rgba(255,255,255,0.1)`
                            }}
                          >
                            <div
                              className="absolute inset-0 rounded-full animate-pulse"
                              style={{
                                boxShadow: `0 0 40px ${resonanceColor}`
                              }}
                            />
                            <div className="font-black text-xs tracking-widest text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] z-20 text-center flex flex-col items-center justify-center leading-tight">
                              <CircleNameDisplay name={circleName || 'Test'} isVisible={true} />
                            </div>
                          </div>
                        </div>

                        {/* Minimal Member List at Bottom of Viewport */}
                        <div className="w-full flex flex-col items-center gap-1.5 mt-2 mb-4 shrink-0 z-20 overflow-y-auto max-h-[140px] hide-scrollbar px-4">
                          {(members.length > 0 ? members : [
                            { id: '1', profile_id: currentUser?.id, profiles: { full_name: 'You' }, color: myColor },
                            { id: '2', profiles: { full_name: 'Member 2' }, color: resonanceColor }
                          ]).map((member, i) => {
                            const isMe = member.profile_id ? member.profile_id === currentUser?.id : i === 0;
                            const color = isMe ? myColor : (member.color || resonanceColor);
                            const name = isMe ? (currentUser?.user_metadata?.full_name || member.profiles?.full_name || 'You') : (member.profiles?.full_name || member.profiles?.username || `Member ${i + 1}`);

                            return (
                              <div key={member.id || i} className="flex items-center gap-2">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                                />
                                <span className="text-[10px] font-medium tracking-widest uppercase text-white/70 truncate max-w-[200px]">
                                  {name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom iOS Home Indicator Bar */}
                      <div className="h-5 w-full shrink-0 flex items-center justify-center relative z-20 pointer-events-none">
                        <div className="w-36 h-1 rounded-full bg-white/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 4. TAB 2: MEMBERS ROSTER (Laptop & Mobile Responsive)         */}
      {/* ============================================================ */}
      {activeTab === 'roster' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search member name or @username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 px-3 py-2 bg-white border border-slate-200 rounded-xl">
                {filteredMembers.length} {filteredMembers.length === 1 ? 'person' : 'people'}
              </span>
            </div>
          </div>

          {/* Members List Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden divide-y divide-slate-100">
            {filteredMembers.map((member) => {
              const isMe = member.profile_id === currentUser?.id;
              const isMemberAdmin = member.role === 'Admin' || member.role === 'admin';
              const memberName = member.profiles?.full_name || 'Anonymous User';
              const memberUsername = member.profiles?.username || 'user';
              const memberAccent = isMe ? myColor : (member.color || resonanceColor);

              return (
                <div
                  key={member.id}
                  className="px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar with Personal Aura Border */}
                    <div 
                      className="w-9 h-9 rounded-full bg-slate-100 border-2 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0"
                      style={{ borderColor: memberAccent }}
                    >
                      {memberName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {memberName}
                        </p>
                        {isMe && (
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">(You)</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">@{memberUsername}</p>
                    </div>
                  </div>

                  {/* Role Badge & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isMemberAdmin
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {member.role || 'Member'}
                    </span>

                    {/* Admin Kick Member button (cannot kick self) */}
                    {isAdmin && !isMe && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id, memberName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredMembers.length === 0 && (
              <div className="py-12 px-4 text-center">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No members found</p>
                <p className="text-xs text-slate-400 mt-0.5">Try searching with a different name or username.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
