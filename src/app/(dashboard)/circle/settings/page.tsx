'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, AlertCircle, Trash2, CheckCircle2, Lock, Unlock, ArrowLeft, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { useToast } from '@/components/ui/ToastContext';

export default function CircleSettingsPage() {
  const router = useRouter();
  const { error: showError } = useToast();
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [activeCircle, setActiveCircle] = useState<any>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('Member');
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings State
  const [whoCanEdit, setWhoCanEdit] = useState<'admin' | 'all'>('admin');
  const [circleDescriptionObj, setCircleDescriptionObj] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Delete State
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const { data: circleData, error: circleError } = await supabase
          .from('circles')
          .select('*')
          .eq('id', activeWorkspaceId)
          .single();

        if (circleError) throw circleError;
        setActiveCircle(circleData);

        if (circleData.description?.startsWith('{')) {
          try {
            const parsed = JSON.parse(circleData.description);
            setCircleDescriptionObj(parsed);
            setWhoCanEdit(parsed.whoCanEdit || 'all');
          } catch (e) {}
        }

        // Fetch user role
        const { data: memberData } = await supabase
          .from('circle_members')
          .select('role')
          .eq('circle_id', activeWorkspaceId)
          .eq('profile_id', session.user.id)
          .single();
          
        if (memberData) {
          setCurrentUserRole(memberData.role);
        }

      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCircleData();
  }, [activeWorkspaceId, router]);

  const handleSaveSettings = async () => {
    if (!activeCircle || currentUserRole !== 'Admin') return;
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const updatedDescObj = {
        ...circleDescriptionObj,
        whoCanEdit
      };
      
      const { error } = await supabase
        .from('circles')
        .update({
          description: JSON.stringify(updatedDescObj)
        })
        .eq('id', activeCircle.id);
        
      if (error) throw error;
      
      setCircleDescriptionObj(updatedDescObj);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCircle = async () => {
    if (!activeCircle || currentUserRole !== 'Admin') return;
    if (deleteConfirmation !== activeCircle.name) {
      showError('Confirmation name does not match.');
      return;
    }
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('circles')
        .delete()
        .eq('id', activeCircle.id);
        
      if (error) throw error;
      
      // Fallback workspace
      localStorage.setItem('activeWorkspaceId', 'personal');
      window.dispatchEvent(new Event('workspace-changed'));
      router.push('/profile');
    } catch (error) {
      console.error('Error deleting circle:', error);
      showError('Failed to delete circle.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <PageSkeleton type="circle_settings" />;
  }

  if (!activeCircle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
        <p>This space is hidden or unavailable.</p>
      </div>
    );
  }

  const isAdmin = currentUserRole === 'Admin';

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link 
          href="/circle"
          className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors w-fit mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Circle
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Circle Settings</h1>
            <p className="text-sm text-slate-500">Manage permissions and configuration for {activeCircle.name}.</p>
          </div>
          {isAdmin && (
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}
            </button>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Admin Only Feature</h3>
            <p className="text-xs text-amber-700 mt-1">
              You are currently viewing these settings as a Member. Only Circle Admins can modify settings or delete the circle.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* General Preferences */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" />
            Permissions
          </h2>
          
          <div className="space-y-4">
            <label className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border transition-all ${whoCanEdit === 'all' ? 'border-indigo-500/30 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'} ${isAdmin ? 'cursor-pointer' : 'opacity-80 pointer-events-none'}`}>
              <div className="flex items-start gap-3 mb-3 sm:mb-0">
                <div className={`p-2 rounded-xl mt-1 ${whoCanEdit === 'all' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Unlock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Any Member</div>
                  <div className="text-xs text-slate-500 mt-1">Anyone in the circle can help shape its atmosphere and edit general details.</div>
                </div>
              </div>
              <div className="shrink-0 flex items-center pr-2">
                <input
                  type="radio"
                  name="whoCanEdit"
                  checked={whoCanEdit === 'all'}
                  onChange={() => setWhoCanEdit('all')}
                  disabled={!isAdmin}
                  className="w-5 h-5 border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer disabled:opacity-50"
                  style={{ accentColor: '#4f46e5' }}
                />
              </div>
            </label>

            <label className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border transition-all ${whoCanEdit === 'admin' ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-300'} ${isAdmin ? 'cursor-pointer' : 'opacity-80 pointer-events-none'}`}>
              <div className="flex items-start gap-3 mb-3 sm:mb-0">
                <div className={`p-2 rounded-xl mt-1 ${whoCanEdit === 'admin' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Admin Only</div>
                  <div className="text-xs text-slate-500 mt-1">Only admins have the power to alter the circle's name, description, and resonance.</div>
                </div>
              </div>
              <div className="shrink-0 flex items-center pr-2">
                <input
                  type="radio"
                  name="whoCanEdit"
                  checked={whoCanEdit === 'admin'}
                  onChange={() => setWhoCanEdit('admin')}
                  disabled={!isAdmin}
                  className="w-5 h-5 border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer disabled:opacity-50"
                  style={{ accentColor: '#0f172a' }}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <LogOut className="w-5 h-5 text-slate-400" />
            Account Session
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Since this device retains your session, you only need to sign out if you are on a shared or public computer.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="inline-flex items-center justify-center px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold rounded-xl transition-all border border-red-100 hover:border-red-200 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out / Log Out
          </button>
        </div>

        {/* Danger Zone */}
        {isAdmin && (
          <div className="bg-white border-2 border-red-100 rounded-3xl p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Danger Zone
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Permanently delete this circle, including all members, queue states, and historical data. This action cannot be undone.
            </p>
            
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5">
              <label className="block text-sm font-bold text-slate-900 mb-2">
                To verify, type <span className="text-red-600 bg-red-100 px-1.5 py-0.5 rounded font-mono select-all">{activeCircle.name}</span> below:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={activeCircle.name}
                  className="flex-1 px-4 py-2.5 bg-white border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium sm:text-sm transition-all text-slate-900 placeholder:text-slate-300"
                />
                <button
                  onClick={handleDeleteCircle}
                  disabled={isDeleting || deleteConfirmation !== activeCircle.name}
                  className="flex items-center justify-center px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0 whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Circle'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
