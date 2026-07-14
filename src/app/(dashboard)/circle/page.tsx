'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Trash2, Save, Sparkles,
  Globe, RefreshCw, Palette,
  Copy, ChevronDown, Search, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { useToast } from '@/components/ui/ToastContext';
import { updateCircleIdentity } from '@/app/actions/circle';

const CircleNameDisplay = ({ name, isVisible }: { name: string, isVisible: boolean }) => {
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

export default function CircleManagementPage() {
  const router = useRouter();
  const { success: showSuccessToast, error: showErrorToast } = useToast();
  const [activeTab, setActiveTab] = useState<'identity' | 'roster' | 'vault'>('identity');
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  useEffect(() => {
    const savedTab = localStorage.getItem('circleActiveTab');
    if (savedTab && (savedTab === 'identity' || savedTab === 'roster' || savedTab === 'vault')) {
      setActiveTab(savedTab as any);
    }
  }, []);

  const handleTabChange = (tab: 'identity' | 'roster' | 'vault') => {
    setActiveTab(tab);
    localStorage.setItem('circleActiveTab', tab);
  };
  const [activeCircle, setActiveCircle] = useState<any>(null);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Identity State
  const [circleName, setCircleName] = useState('');
  const [whoCanEdit, setWhoCanEdit] = useState<string>('all');
  const [circleDescription, setCircleDescription] = useState('');
  const [resonanceColor, setResonanceColor] = useState('#a299af');
  const [myColor, setMyColor] = useState('#a299af');
  
  // Roster State
  const [searchTerm, setSearchTerm] = useState('');
  const [origin, setOrigin] = useState('');
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('Member');

  const [originalStateHash, setOriginalStateHash] = useState<string>('');

  const getCurrentStateHash = (
    cn = circleName,
    cd = circleDescription,
    rc = resonanceColor,
    mc = myColor
  ) => {
    return JSON.stringify({ cn, cd, rc, mc });
  };

  const hasUnsavedChanges = !isLoading && originalStateHash !== '' && originalStateHash !== getCurrentStateHash();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);


  useEffect(() => {
    const handleWorkspaceChange = () => {
      setActiveWorkspaceId(localStorage.getItem('activeWorkspaceId'));
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
      
      setIsLoading(true);
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

        console.log('Fetching circle data for workspace:', activeWorkspaceId);
        // Fetch circle details
        const { data: circleData, error: circleError } = await supabase
          .from('circles')
          .select('*')
          .eq('id', activeWorkspaceId)
          .single();

        if (circleError) throw circleError;
        setActiveCircle(circleData);
        setCircleName(circleData.name);
        
        // Parse branding from description
        if (circleData.description?.startsWith('{')) {
          try {
            const parsed = JSON.parse(circleData.description);
            setCircleDescription(parsed.originalDescription || '');
            setResonanceColor(parsed.resonanceColor || '#a299af');
            setWhoCanEdit(parsed.whoCanEdit || 'all');
          } catch (e) {
            setCircleDescription(circleData.description);
          }
        } else {
          setCircleDescription(circleData.description || '');
        }

        // Fetch members
        let memberData: any = null;
        let memberError: any = null;
        
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

        if (errorWithColor && errorWithColor.message.includes('color')) {
          const { data: fallbackData, error: fallbackError } = await supabase
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
          memberError = fallbackError;
        } else {
          memberData = dataWithColor;
          memberError = errorWithColor;
        }
          
        if (memberError) {
          console.error('Error fetching members:', memberError);
        }
        console.log('Fetched members raw data:', memberData);
        setMembers(memberData || []);
        
        if (memberData && session?.user) {
          const me = memberData.find((m: any) => m.profile_id === session.user.id);
          let initialMyColor = '#a299af';
          if (me) {
            setCurrentUserRole(me.role || 'Member');
            if (me.color) {
              setMyColor(me.color);
              initialMyColor = me.color;
            }
          }

          let parsedDesc = '';
          let parsedColor = '#a299af';
          if (circleData.description?.startsWith('{')) {
             try {
               const parsed = JSON.parse(circleData.description);
               parsedDesc = parsed.originalDescription || '';
               parsedColor = parsed.resonanceColor || '#a299af';
             } catch(e) {
               parsedDesc = circleData.description;
             }
          } else {
             parsedDesc = circleData.description || '';
          }

          setOriginalStateHash(getCurrentStateHash(
             circleData.name,
             parsedDesc,
             parsedColor,
             initialMyColor
          ));
        }

      } catch (error) {
        console.error('Error fetching circle data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCircleData();

    // Subscribe to real-time updates for members
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
        () => {
          // Re-fetch members on any change
          const fetchMembers = async () => {
            let memberData: any = null;
            let memberError: any = null;
            
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

            if (errorWithColor && errorWithColor.message.includes('color')) {
              const { data: fallbackData, error: fallbackError } = await supabase
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
              memberError = fallbackError;
            } else {
              memberData = dataWithColor;
              memberError = errorWithColor;
            }
            
            if (memberError) {
              console.error('Real-time fetch error:', memberError);
            }
            if (memberData) {
              setMembers(memberData);
              if (currentUser) {
                const me = memberData.find((m: any) => m.profile_id === currentUser.id);
                if (me && me.color) {
                  setMyColor(me.color);
                }
              }
            }
          };
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeWorkspaceId, router]);

  const handleSaveIdentity = async () => {
    if (!activeCircle) return;
    setIsSaving(true);
    
    try {
      const isAllowedToEditDetails = whoCanEdit === 'all' || currentUserRole === 'Admin' || currentUserRole === 'admin';
      if (isAllowedToEditDetails) {
        let existingData = {};
        try {
          if (activeCircle?.description?.startsWith('{')) {
            existingData = JSON.parse(activeCircle.description);
          }
        } catch (e) {}

        const brandingData = {
          ...existingData,
          originalDescription: circleDescription,
          resonanceColor
        };
        
        const result = await updateCircleIdentity(
          activeCircle.id,
          circleName,
          JSON.stringify(brandingData)
        );
          
        if (!result.success) throw new Error(result.error);
      }
      
      if (currentUser) {
        const { error: memberError } = await supabase
          .from('circle_members')
          .update({ color: myColor })
          .eq('circle_id', activeCircle.id)
          .eq('profile_id', currentUser.id);
          
        if (memberError) {
          console.error('Error saving member color:', memberError);
          // Don't throw here, as the main circle update succeeded
          // This might fail if the user hasn't run the SQL migration yet
        }
      }
      
      // Update local state
      if (isAllowedToEditDetails) {
        let existingData = {};
        try {
          if (activeCircle?.description?.startsWith('{')) {
            existingData = JSON.parse(activeCircle.description);
          }
        } catch (e) {}
        
        const brandingData = {
          ...existingData,
          originalDescription: circleDescription,
          resonanceColor
        };
        
        setActiveCircle({
          ...activeCircle,
          name: circleName,
          description: JSON.stringify(brandingData)
        });

        setOriginalStateHash(getCurrentStateHash(circleName, circleDescription, resonanceColor, myColor));
      } else {
        setOriginalStateHash(getCurrentStateHash(circleName, circleDescription, resonanceColor, myColor));
      }
      
      setShowSuccess(true);
      setErrorMsg(null);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error: any) {
      console.error('Error saving identity:', error);
      setErrorMsg(error.message || 'Failed to save changes.');
      showErrorToast(error.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges || !originalStateHash) {
          handleSaveIdentity();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, originalStateHash, circleName, circleDescription, resonanceColor, myColor]);

  const handleRegenerateCode = async () => {
    if (!activeCircle) return;
    
    setIsSaving(true);
    try {
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { error } = await supabase
        .from('circles')
        .update({ invite_code: newCode })
        .eq('id', activeCircle.id);
        
      if (error) throw error;
      
      setActiveCircle({ ...activeCircle, invite_code: newCode });
      showSuccessToast('Invite code regenerated!');
    } catch (error) {
      console.error('Error revoking code:', error);
      showErrorToast('Failed to revoke invite code.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      const { error } = await supabase
        .from('circle_members')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      setMembers(members.filter(m => m.id !== memberId));
    } catch (error) {
      console.error('Error removing member:', error);
      showErrorToast('Failed to remove member.');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      (member.profiles?.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (member.profiles?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (a.role === 'Admin' && b.role !== 'Admin') return -1;
    if (a.role !== 'Admin' && b.role === 'Admin') return 1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl space-y-8 pb-12 animate-pulse w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="h-10 w-40 bg-slate-200 rounded-xl w-full sm:w-auto"></div>
            <div className="h-10 w-36 bg-slate-200 rounded-xl w-full sm:w-auto"></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="h-12 w-full sm:w-[320px] bg-slate-100 rounded-2xl flex p-1 gap-1">
          <div className="flex-1 bg-white rounded-xl shadow-xs"></div>
          <div className="flex-1 rounded-xl"></div>
          <div className="flex-1 rounded-xl"></div>
        </div>

        {/* Identity Cards Skeleton */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Details Left Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 min-h-[440px] flex flex-col justify-between shadow-sm">
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
                <div className="h-4 w-52 bg-slate-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
                <div className="h-24 w-full bg-slate-100 rounded-2xl"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-slate-200 rounded"></div>
                <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between gap-4">
              <div className="h-12 w-28 bg-slate-50 border border-slate-100 rounded-xl"></div>
              <div className="h-12 w-28 bg-slate-50 border border-slate-100 rounded-xl"></div>
            </div>
          </div>

          {/* Resonance Preview Right Card */}
          <div className="bg-[#0b0d0c] border border-slate-800/60 rounded-3xl p-6 min-h-[440px] flex flex-col justify-between items-center relative overflow-hidden">
            {/* Meta Header */}
            <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-bold text-slate-700">
              <div className="flex items-center gap-1.5 font-semibold">
                <div className="w-3.5 h-3.5 rounded bg-slate-800" />
                <div className="h-3 w-28 bg-slate-800 rounded"></div>
              </div>
            </div>

            {/* Visualizer Area */}
            <div className="relative w-full flex-1 flex items-center justify-center my-8 z-10">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Glowing sphere mimic */}
                <div className="absolute inset-0 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                  <div className="h-4 w-20 bg-slate-800 rounded"></div>
                </div>
                {/* Orbit Path Guide Guidance */}
                <div className="absolute inset-[-20px] rounded-full border border-dashed border-slate-800/40" />
                {/* Simulated Orbiting Particle */}
                <div className="absolute inset-[-20px] rounded-full animate-spin pointer-events-none" style={{ animationDuration: '6s' }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-800 border border-slate-700" />
                </div>
              </div>
            </div>

            {/* Bottom metadata */}
            <div className="w-full flex justify-between items-center gap-2">
              <div className="h-12 w-full bg-slate-900 border border-slate-850 rounded-2xl"></div>
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
      <p>This space is hidden or unavailable.</p>
    </div>
  );
}

const canEditDetails = whoCanEdit === 'all' || currentUserRole === 'Admin' || currentUserRole === 'admin';

return (
  <div className="max-w-5xl space-y-8 pb-12">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">{activeCircle.name}</h1>
        </div>
        <p className="text-sm text-slate-500">Shape your circle's appearance and resonance.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-1 px-1.5 py-1 bg-slate-100 border border-slate-200/60 rounded-xl sm:rounded-lg">
          <button
            onClick={() => {
              navigator.clipboard.writeText(activeCircle.invite_code);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            className="flex-1 sm:flex-none px-3 sm:px-2.5 py-1.5 sm:py-1 rounded-lg hover:bg-slate-200/50 transition-colors text-center relative"
            title="Tap to copy code"
          >
            <span className="text-slate-900 text-sm font-mono font-bold tracking-[0.2em]">
              {activeCircle.invite_code}
            </span>
            {isCopied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap animate-in fade-in zoom-in duration-200">
                Copied!
              </span>
            )}
          </button>
          <div className="w-px h-5 sm:h-4 bg-slate-300 mx-0.5"></div>
          <button
            onClick={handleRegenerateCode}
            disabled={isSaving}
            className="p-2 sm:p-1.5 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-lg hover:bg-red-50 relative group"
            title="Revoke Code"
          >
            <RefreshCw className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden sm:block">
              Revoke
            </span>
          </button>
        </div>
        <Link
          href={`/c/${activeCircle.slug || activeCircle.invite_code}`}
          className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          View Resonance
        </Link>
      </div>
    </div>

    {/* Navigation Tabs */}
    <div className="relative inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/50 w-full sm:w-auto min-w-[300px] overflow-hidden">
      {[
        { id: 'identity', label: 'Atmosphere', icon: Palette },
        { id: 'roster', label: 'People', icon: Users }
      ].map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`relative flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold transition-all flex-1 z-10 ${
              isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white shadow-sm rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-20 flex items-center">
              <tab.icon className={`w-4 h-4 mr-2 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>

    {/* Tab Content */}
    <div className="mt-8">
      {/* IDENTITY TAB */}
      {activeTab === 'identity' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Card: General Details */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="flex flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">General Details</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure your space presence and branding</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Circle Name</label>
                    <textarea 
                      value={circleName}
                      onChange={(e) => {
                        if (!canEditDetails) return;
                        const lines = e.target.value.split('\n');
                        if (lines.length <= 3) {
                          setCircleName(e.target.value);
                        }
                      }}
                      disabled={!canEditDetails}
                      rows={3}
                      placeholder="e.g. Creative Lab"
                      className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all sm:text-sm resize-none font-medium placeholder:text-slate-400 ${!canEditDetails ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5">Max 3 lines of display text.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Resonance Preview */}
            <div className="bg-[#0b0d0c] border border-slate-800/60 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between items-center min-h-[400px] lg:min-h-[440px]">
              {/* Meta Header */}
              <div className="w-full flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 z-20">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>Resonance Preview</span>
                </div>
              </div>

              {/* Main Visualizer Portal Area */}
              <div className="relative w-full flex-1 flex items-center justify-center my-8 z-10">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  {/* Outer Radiance Glow (Resonance Color Picker) */}
                  <label className={`absolute inset-0 rounded-full z-10 ${canEditDetails ? 'cursor-pointer group/resonance' : 'cursor-not-allowed'}`}>
                    <input 
                      type="color"
                      value={resonanceColor}
                      onChange={(e) => canEditDetails && setResonanceColor(e.target.value)}
                      disabled={!canEditDetails}
                      className="sr-only"
                    />
                    <div
                      className="absolute inset-0 rounded-full transition-all duration-1000 group-hover/resonance:scale-105"
                      style={{
                        background: `radial-gradient(circle, ${resonanceColor} 0%, transparent 80%)`,
                        boxShadow: `0 0 80px ${resonanceColor}, inset 0 0 25px rgba(255,255,255,0.05)`
                      }}
                    />
                    
                    {/* Pulse Element */}
                    <div
                      className="absolute inset-0 rounded-full animate-pulse opacity-85 group-hover/resonance:opacity-100"
                      style={{ boxShadow: `0 0 50px ${resonanceColor}` }}
                    />

                    {/* Highly Visual Hover Overlay for Custom Color picking (No text) */}
                    <div className="absolute inset-2 rounded-full border border-white/10 group-hover/resonance:border-white/30 transition-all duration-300 flex items-center justify-center bg-black/0 group-hover/resonance:bg-black/20 group-hover/resonance:scale-102 backdrop-blur-[1px] group-hover/resonance:backdrop-blur-[3px]">
                      <div className="p-3 rounded-full bg-white/10 border border-white/30 text-white/95 scale-75 opacity-0 group-hover/resonance:scale-100 group-hover/resonance:opacity-100 transition-all duration-300 shadow-2xl backdrop-blur-md">
                        <Palette className="w-4 h-4" />
                      </div>
                    </div>
                  </label>

                  {/* Orbit Path Track Guideline */}
                  <div className="absolute inset-[-20px] rounded-full border border-dashed border-white/10 pointer-events-none" />
                  
                  {/* Orbiting Aura Circle (Personal Aura Color Picker) */}
                  <div 
                    className="absolute inset-[-20px] rounded-full animate-spin pointer-events-none z-20"
                    style={{ animationDuration: '8s' }}
                  >
                    <label className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group/aura pointer-events-auto">
                      <input 
                        type="color"
                        value={myColor}
                        onChange={(e) => setMyColor(e.target.value)}
                        className="sr-only"
                      />
                      <div 
                        className="w-5 h-5 rounded-full shadow-lg border border-white/30 transition-transform group-hover/aura:scale-125 duration-150 relative flex items-center justify-center"
                        style={{ 
                          backgroundColor: myColor,
                          boxShadow: `0 0 15px ${myColor}, 0 0 30px ${myColor}`
                        }}
                      >
                        {/* Ping Halo Effect on Aura hover */}
                        <span className="absolute inset-[-6px] rounded-full border border-white/40 group-hover/aura:animate-ping opacity-0 group-hover/aura:opacity-100 transition-all duration-300 pointer-events-none" />
                        
                        {/* Mini Star spark inside aura on hover */}
                        <div className="opacity-0 group-hover/aura:opacity-100 transition-opacity duration-150 text-white pointer-events-none">
                          <Sparkles className="w-2.5 h-2.5 shrink-0" />
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {/* Text Container (No Spin) */}
                  <div className="relative w-full h-full flex items-center justify-center z-15 pointer-events-none">
                    <CircleNameDisplay name={circleName} isVisible={true} />
                  </div>
                </div>
              </div>

              {/* Color Metadata & Status Chip Bar (Interactive Pickers) */}
              <div className="w-full grid grid-cols-2 gap-3 z-20">
                <label className={`flex flex-col gap-1.5 min-w-0 items-center text-center p-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl transition-all duration-200 shadow-sm ${canEditDetails ? 'cursor-pointer group/resonance-chip hover:border-white/12 hover:bg-white/[0.04] active:scale-[0.98]' : 'opacity-70 cursor-not-allowed'}`}>
                  <input 
                    type="color"
                    value={resonanceColor}
                    onChange={(e) => canEditDetails && setResonanceColor(e.target.value)}
                    disabled={!canEditDetails}
                    className="sr-only"
                  />
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider group-hover/resonance-chip:text-slate-400 transition-colors">Resonance</span>
                  <div className="flex items-center justify-center gap-2 font-semibold w-full">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20 shadow-sm transition-transform group-hover/resonance-chip:scale-110" style={{ backgroundColor: resonanceColor }} />
                    <span className="font-mono text-[10px] text-slate-300 uppercase truncate font-medium group-hover/resonance-chip:text-white transition-colors">{resonanceColor}</span>
                  </div>
                </label>

                <label className="flex flex-col gap-1.5 min-w-0 items-center text-center cursor-pointer group/aura-chip p-3 bg-white/[0.02] border border-white/[0.06] hover:border-white/12 hover:bg-white/[0.04] rounded-2xl transition-all duration-200 shadow-sm active:scale-[0.98]">
                  <input 
                    type="color"
                    value={myColor}
                    onChange={(e) => setMyColor(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider group-hover/aura-chip:text-slate-400 transition-colors">Your Aura</span>
                  <div className="flex items-center justify-center gap-2 font-semibold w-full">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/20 shadow-sm transition-transform group-hover/aura-chip:scale-110" style={{ backgroundColor: myColor }} />
                    <span className="font-mono text-[10px] text-slate-300 uppercase truncate font-medium group-hover/aura-chip:text-white transition-colors">{myColor}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ROSTER TAB */}
      {activeTab === 'roster' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all sm:text-sm shadow-sm placeholder:text-slate-400"
            />
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm divide-y divide-slate-100/80 overflow-hidden">
            {filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/50 overflow-hidden flex items-center justify-center text-slate-600 font-semibold shrink-0">
                    {member.profiles?.full_name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="truncate">{member.profiles?.full_name || 'Unknown'}</span>
                      {member.role === 'Admin' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase tracking-widest shrink-0 border border-slate-200/50">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-medium truncate">@{member.profiles?.username || 'unknown'}</div>
                  </div>
                </div>
                
                {members.find(m => m.profiles?.id === currentUser?.id)?.role === 'Admin' && (
                  <div className="shrink-0">
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95 duration-200"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-400 font-medium flex flex-col items-center justify-center gap-2">
                <Users className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                <span className="text-sm">No people found</span>
              </div>
            )}
          </div>
          </motion.div>
        )}
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
                onClick={handleSaveIdentity} 
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
    </div>
  );
}
