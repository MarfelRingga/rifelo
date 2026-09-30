'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Smartphone, 
  Settings2, 
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronDown,
  Globe,
  Radio,
  Link as LinkIcon,
  Check,
  Shield,
  QrCode,
  User
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { getPlatformInfo } from '@/lib/platforms';
import { cn } from '@/lib/utils';

interface NFCTag {
  id: string;
  token: string;
  tag_name: string | null;
  status: string;
  interaction_mode: string;
  redirect_url: string | null;
  created_at: string;
}

export default function NFCTagsPage() {
  return (
    <Suspense fallback={<PageSkeleton type="tags" />}>
      <NFCTagsContent />
    </Suspense>
  );
}

function NFCTagsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [tags, setTags] = useState<NFCTag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Form States for Selected Tag
  const [token, setToken] = useState('');
  const [tagName, setTagName] = useState('');
  const [tagStatus, setTagStatus] = useState<'active' | 'inactive'>('active');
  const [interactionMode, setInteractionMode] = useState('profile');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [customRedirectMode, setCustomRedirectMode] = useState<'link' | 'custom'>('link');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [userCircles, setUserCircles] = useState<any[]>([]);
  const [userLinks, setUserLinks] = useState<any[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('personal');
  const [isCircleWorkspace, setIsCircleWorkspace] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasQueueMode, setHasQueueMode] = useState(false);

  // Dropdown States
  const [isInteractionModeOpen, setIsInteractionModeOpen] = useState(false);

  useEffect(() => {
    const claimToken = searchParams.get('claim');
    if (claimToken) {
      const autoClaim = async () => {
        setIsLoading(true);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;

          const response = await fetch('/api/tags/claim', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              token: claimToken.trim(),
              tagName: 'My NFC Tag'
            })
          });

          const result = await response.json();

          if (!response.ok) {
            console.error('Invalid token or already claimed:', result.error);
            return;
          }

          if (result.tag?.circle_id) {
            window.dispatchEvent(new Event('workspace-changed'));
          }

          // Refresh tags
          fetchTags();
          
          // Remove query param
          router.replace('/tags');
        } catch (err: any) {
          console.error('Auto claim error:', err);
          fetch('/api/notify-error', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: err.message, stack: err.stack, customContext: 'Auto Claim Tag Error' })
          }).catch(() => {});
        } finally {
          setIsLoading(false);
        }
      };
      
      autoClaim();
    }
  }, [searchParams, router]);

  useEffect(() => {
    const saved = localStorage.getItem('activeWorkspaceId');
    if (saved) {
      setActiveWorkspaceId(saved);
      setIsCircleWorkspace(saved !== 'personal' && saved !== 'admin');
    }

    // Check for array in pb_events
    try {
      const storedPb = localStorage.getItem('pb_events');
      if (storedPb) {
        const events = JSON.parse(storedPb);
        if (Array.isArray(events) && events.length > 0) {
          setHasQueueMode(true);
        }
      }
    } catch (_) {}

    const handleWorkspaceChange = () => {
      const newSaved = localStorage.getItem('activeWorkspaceId');
      if (newSaved) {
        setActiveWorkspaceId(newSaved);
        setIsCircleWorkspace(newSaved !== 'personal' && newSaved !== 'admin');
      }
    };

    window.addEventListener('workspace-changed', handleWorkspaceChange);
    return () => window.removeEventListener('workspace-changed', handleWorkspaceChange);
  }, []);

  const populateFormWithTag = (tag: NFCTag, currentLinks: any[] = userLinks) => {
    setTagName(tag.tag_name || '');
    setTagStatus((tag.status as 'active' | 'inactive') || 'active');
    setInteractionMode(tag.interaction_mode || 'profile');
    setRedirectUrl(tag.redirect_url || '');
    setError(null);
    setSuccess(null);
    setIsInteractionModeOpen(false);

    if (tag.interaction_mode === 'redirect' && tag.redirect_url) {
      const isLink = currentLinks.some(l => {
        const platform = getPlatformInfo(l.title, l.url);
        const resolved = platform ? platform.finalUrl : (l.url.startsWith('http') ? l.url : `https://${l.url}`);
        return resolved === tag.redirect_url || l.url === tag.redirect_url;
      });
      setCustomRedirectMode(isLink ? 'link' : 'custom');
    } else {
      setCustomRedirectMode('link');
    }
  };

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      // Check admin status
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      setIsAdmin(profile?.role === 'admin' || profile?.role === 'superadmin');

      // Fetch user's profile links for custom redirect dropdown
      const { data: linksData } = await supabase
        .from('profile_links')
        .select('id, title, url')
        .eq('profile_id', session.user.id)
        .order('sort_order', { ascending: true });
      
      const loadedLinks = linksData || [];
      setUserLinks(loadedLinks);

      // Fetch tags
      let query = supabase
        .from('nfc_tags')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeWorkspaceId === 'personal') {
        query = query.eq('user_id', session.user.id).is('circle_id', null);
      } else if (activeWorkspaceId === 'admin') {
        // Admin workspace views all user's tags
        query = query.eq('user_id', session.user.id);
      } else {
        // Circle workspace views tags assigned to circle
        query = query.eq('circle_id', activeWorkspaceId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching tags:', error);
      } else {
        const loadedTags = data || [];
        setTags(loadedTags);

        // Select the active tag
        if (loadedTags.length > 0) {
          const currentSelected = loadedTags.find(t => t.id === selectedTagId);
          const activeTag = currentSelected || loadedTags[0];
          setSelectedTagId(activeTag.id);
          populateFormWithTag(activeTag, loadedLinks);
        } else {
          setSelectedTagId(null);
        }
      }

      // Fetch user's circles for redirect options
      if (activeWorkspaceId === 'personal') {
        const { data: memberCircles } = await supabase
          .from('circle_members')
          .select('circles(id, name, slug, invite_code)')
          .eq('profile_id', session.user.id);

        if (memberCircles) {
          const circles = memberCircles
            .map((m: any) => m.circles)
            .filter(Boolean);
          setUserCircles(circles);
        }
      }
    } catch (err: any) {
      console.error('Error fetching tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [activeWorkspaceId]);

  const currentTag = tags.find(t => t.id === selectedTagId) || null;

  const handleSelectTag = (tag: NFCTag) => {
    setSelectedTagId(tag.id);
    setIsAddingNew(false);
    populateFormWithTag(tag);
  };

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTag) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      let targetUrl = redirectUrl;
      if (interactionMode === 'redirect' && customRedirectMode === 'custom') {
        if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
          targetUrl = `https://${redirectUrl}`;
        }
      }

      // Find circle_id if interaction mode is circle
      let targetCircleId = null;
      if (interactionMode === 'circle' && redirectUrl) {
        const circle = userCircles.find(c => c.invite_code === redirectUrl || c.slug === redirectUrl);
        if (circle) targetCircleId = circle.id;
      }

      const response = await fetch(`/api/tags/${currentTag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          tagName: tagName.trim(),
          interactionMode: interactionMode,
          redirectUrl: targetUrl ? targetUrl.trim() : null,
          circleId: targetCircleId,
          status: tagStatus
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update tag');

      // Update local state smoothly
      setTags(prev => prev.map(t => t.id === currentTag.id ? {
        ...t,
        tag_name: tagName.trim() || 'My NFC Tag',
        status: tagStatus,
        interaction_mode: interactionMode,
        redirect_url: targetUrl ? targetUrl.trim() : null
      } : t));

      setSuccess('Tag configuration saved successfully!');
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/api/tags/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          token: token.trim(),
          tagName: tagName.trim() || 'My NFC Tag',
          circleId: isCircleWorkspace ? activeWorkspaceId : null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add tag');
      }

      setToken('');
      setTagName('');
      setIsAddingNew(false);
      setSuccess('Tag connected successfully!');
      await fetchTags();
    } catch (err: any) {
      setError(err.message || 'Failed to connect tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`/api/tags/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to detach tag');

      setDeleteId(null);
      await fetchTags();
    } catch (err: any) {
      console.error('Error deleting tag:', err);
      fetch('/api/notify-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: err.message, stack: err.stack, customContext: 'Delete Tag Error' })
      }).catch(() => {});
      setErrorMessage(err.message || 'Failed to delete tag');
    }
  };

  const getSelectedModeInfo = () => {
    if (interactionMode === 'profile') {
      return {
        label: 'Digital Profile (Default)',
        sublabel: 'Directs to your public profile',
        icon: Globe,
        iconColor: 'text-slate-700',
        bgColor: 'bg-slate-100 border border-slate-200/60'
      };
    }

    if (interactionMode === 'redirect') {
      if (customRedirectMode === 'custom') {
        return {
          label: 'Custom URL',
          sublabel: redirectUrl || 'External web destination',
          icon: ExternalLink,
          iconColor: 'text-slate-700',
          bgColor: 'bg-slate-100 border border-slate-200/60'
        };
      }

      const matched = userLinks.find(l => {
        const p = getPlatformInfo(l.title, l.url);
        const res = p ? p.finalUrl : (l.url.startsWith('http') ? l.url : `https://${l.url}`);
        return res === redirectUrl || l.url === redirectUrl;
      });

      if (matched) {
        const p = getPlatformInfo(matched.title, matched.url);
        if (p) {
          return {
            label: matched.title || p.id,
            sublabel: redirectUrl || matched.url,
            icon: p.icon,
            iconColor: p.color,
            bgColor: 'bg-slate-50 border border-slate-200/60'
          };
        }
        return {
          label: matched.title || 'Profile Link',
          sublabel: redirectUrl || matched.url,
          icon: LinkIcon,
          iconColor: 'text-slate-700',
          bgColor: 'bg-slate-100 border border-slate-200/60'
        };
      }

      return {
        label: 'Custom URL',
        sublabel: redirectUrl || 'External web destination',
        icon: ExternalLink,
        iconColor: 'text-slate-700',
        bgColor: 'bg-slate-100 border border-slate-200/60'
      };
    }

    if (interactionMode === 'photobooth') {
      return {
        label: 'Queue Customer',
        sublabel: 'Photobooth event queue',
        icon: QrCode,
        iconColor: 'text-amber-600',
        bgColor: 'bg-amber-50 border border-amber-200/60'
      };
    }

    if (interactionMode === 'circle') {
      const circle = userCircles.find(c => c.invite_code === redirectUrl || c.slug === redirectUrl);
      return {
        label: circle ? `Circle (${circle.name})` : 'Circle Protocol',
        sublabel: 'Smart scan access flow',
        icon: Shield,
        iconColor: 'text-indigo-600',
        bgColor: 'bg-indigo-50 border border-indigo-200/60'
      };
    }

    return {
      label: 'Digital Profile (Default)',
      sublabel: 'Directs to your public profile',
      icon: Globe,
      iconColor: 'text-slate-700',
      bgColor: 'bg-slate-100 border border-slate-200/60'
    };
  };

  if (isLoading) return <PageSkeleton type="tags" />;

  const testLiveUrl = currentTag ? `/t/${currentTag.token}` : null;

  return (
    <div className="space-y-6 sm:space-y-8 font-sans max-w-4xl mx-auto pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">NFC Tags</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
              {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Configure your physical NFC device and tap destination.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
          {currentTag && !isAddingNew && testLiveUrl && (
            <a
              href={testLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-2xs hover:border-slate-300"
            >
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Test Live Link</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              if (isAddingNew && tags.length > 0) {
                setIsAddingNew(false);
              } else {
                setToken('');
                setTagName('');
                setError(null);
                setSuccess(null);
                setIsAddingNew(true);
              }
            }}
            className={cn(
              "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-2xs active:scale-[0.98]",
              isAddingNew
                ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {isAddingNew ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Pair New Tag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Horizontal Multi-Tag Selector Tabs (when user has multiple tags and not in add mode) */}
      {tags.length > 1 && !isAddingNew && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {tags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleSelectTag(t)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 active:scale-[0.98]",
                selectedTagId === t.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                t.status === 'active' ? "bg-emerald-400" : "bg-slate-400"
              )} />
              <span>{t.tag_name || 'Unnamed Tag'}</span>
              <span className="font-mono text-[10px] opacity-70 bg-white/10 px-1.5 py-0.5 rounded">
                {t.token}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* VIEW 1: Connect First Tag / Pair Tag Full Page Card */}
      {(tags.length === 0 || isAddingNew) ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {tags.length === 0 ? 'Connect Your First Tag' : 'Pair New NFC Tag'}
                </h2>
                <p className="text-xs text-slate-500">
                  Enter the hardware token or code printed on your NFC device.
                </p>
              </div>
            </div>
            {isAddingNew && tags.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Back to tag
              </button>
            )}
          </div>

          <form onSubmit={handleAddTag} className="p-5 sm:p-6 space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Hardware Token / Tag Code
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="e.g. AB12CD34 or rifelo.com/t/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Tag Label (Optional)
              </label>
              <input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g. Black Wristband, Desk Card"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !token.trim()}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xs inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Tag...</span>
                  </>
                ) : (
                  'Connect Tag'
                )}
              </button>

              {error && (
                <span className="flex items-center text-sm text-red-600 font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                  {error}
                </span>
              )}
            </div>
          </form>
        </div>
      ) : currentTag && (
        /* VIEW 2: Configure Tag Full Page Form (Direct on Page like /profile) */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="px-5 py-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 truncate">
                    {currentTag.tag_name || 'My NFC Tag'}
                  </h2>
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md shrink-0">
                    {currentTag.token}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Physical tag identifier and destination routing
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDeleteId(currentTag.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
              title="Unbind tag from your account"
              aria-label="Unbind tag"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveTag} className="p-5 sm:p-6 space-y-6">
            {/* Field: Tag Name */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Tag Label
              </label>
              <input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="e.g. Black Wristband, Desk Card"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Field: Tag Status Toggle Switch */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <div className="space-y-0.5 min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">Active Status</span>
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                    tagStatus === 'active'
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  )}>
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      tagStatus === 'active' ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    )} />
                    <span className="capitalize">{tagStatus}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {tagStatus === 'active' 
                    ? 'Tag is active. Tapping the tag will immediately redirect visitors to your destination.'
                    : 'Tag is paused. Tapping the tag will be temporarily disabled until re-activated.'}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={tagStatus === 'active'}
                onClick={() => setTagStatus(prev => prev === 'active' ? 'inactive' : 'active')}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
                  tagStatus === 'active' ? "bg-emerald-500" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                    tagStatus === 'active' ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            {/* Field: Interaction Mode & Destination with App Logos */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Interaction Mode & Destination
              </label>
              <div>
                <input type="hidden" name="interactionMode" value={interactionMode} />
                
                {/* Trigger button with current app logo */}
                <button
                  type="button"
                  onClick={() => setIsInteractionModeOpen(!isInteractionModeOpen)}
                  className={cn(
                    "flex items-center justify-between w-full p-2.5 px-3.5 rounded-xl border outline-none transition-all shadow-2xs",
                    isInteractionModeOpen
                      ? "bg-slate-50/80 border-slate-900 ring-1 ring-slate-900"
                      : "bg-white border-slate-200/80 hover:border-slate-300"
                  )}
                >
                  {(() => {
                    const currentInfo = getSelectedModeInfo();
                    const CurrentIcon = currentInfo.icon;
                    return (
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg ${currentInfo.bgColor} flex items-center justify-center shrink-0`}>
                          <CurrentIcon className={`w-4 h-4 ${currentInfo.iconColor}`} />
                        </div>
                        <div className="text-left min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {currentInfo.label}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {currentInfo.sublabel}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  <ChevronDown className={cn(
                    "w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200",
                    isInteractionModeOpen && "rotate-180 text-slate-900"
                  )} />
                </button>
                
                {/* Options list rendered in-flow right on the page */}
                {isInteractionModeOpen && (
                  <div className="mt-2.5 bg-slate-50/60 border border-slate-200/90 rounded-2xl p-1.5 max-h-72 overflow-y-auto divide-y divide-slate-100 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-150">
                    
                    {/* 1. Digital Profile default */}
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setInteractionMode('profile');
                          setRedirectUrl('');
                          setIsInteractionModeOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all",
                          interactionMode === 'profile' ? "bg-white shadow-2xs text-slate-900 font-medium" : "hover:bg-white/80 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                            <Globe className="w-4 h-4 text-slate-700" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">Digital Profile (Default)</div>
                            <div className="text-[11px] text-slate-400 truncate">Directs to your public profile</div>
                          </div>
                        </div>
                        {interactionMode === 'profile' && <Check className="w-4 h-4 text-slate-900 shrink-0 ml-2" />}
                      </button>
                    </div>

                    {/* 2. User Social / Web Links */}
                    {userLinks.length > 0 && (
                      <div className="py-1">
                        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Your Social & Profile Links
                        </div>
                        {userLinks.map(link => {
                          const platform = getPlatformInfo(link.title, link.url);
                          const resolvedTarget = platform ? platform.finalUrl : (link.url.startsWith('http') ? link.url : `https://${link.url}`);
                          const isSelected = interactionMode === 'redirect' && customRedirectMode === 'link' && redirectUrl === resolvedTarget;
                          const IconComponent = platform?.icon || LinkIcon;
                          const iconColor = platform?.color || 'text-slate-700';

                          return (
                            <button
                              key={link.id}
                              type="button"
                              onClick={() => {
                                setInteractionMode('redirect');
                                setCustomRedirectMode('link');
                                setRedirectUrl(resolvedTarget);
                                setIsInteractionModeOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all",
                                isSelected ? "bg-white shadow-2xs text-slate-900 font-medium" : "hover:bg-white/80 text-slate-700"
                              )}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center shrink-0">
                                  <IconComponent className={`w-4 h-4 ${iconColor}`} />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-semibold truncate">{link.title || platform?.id || 'Link'}</div>
                                  <div className="text-[11px] text-slate-400 truncate">{link.url}</div>
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-slate-900 shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* 3. Custom URL & Special Protocols */}
                    <div className="py-1">
                      <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Custom & Protocols
                      </div>
                      
                      {/* Custom URL Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setInteractionMode('redirect');
                          setCustomRedirectMode('custom');
                          if (!redirectUrl || !redirectUrl.startsWith('http')) {
                            setRedirectUrl('https://');
                          }
                          setIsInteractionModeOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all",
                          interactionMode === 'redirect' && customRedirectMode === 'custom' ? "bg-white shadow-2xs text-slate-900 font-medium" : "hover:bg-white/80 text-slate-700"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                            <ExternalLink className="w-4 h-4 text-slate-700" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">Custom URL</div>
                            <div className="text-[11px] text-slate-400 truncate">Enter any external destination</div>
                          </div>
                        </div>
                        {interactionMode === 'redirect' && customRedirectMode === 'custom' && <Check className="w-4 h-4 text-slate-900 shrink-0 ml-2" />}
                      </button>

                      {/* Queue Customer */}
                      {(isAdmin || hasQueueMode) && (
                        <button
                          type="button"
                          onClick={() => {
                            setInteractionMode('photobooth');
                            setIsInteractionModeOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all",
                            interactionMode === 'photobooth' ? "bg-white shadow-2xs text-slate-900 font-medium" : "hover:bg-white/80 text-slate-700"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                              <QrCode className="w-4 h-4 text-amber-700" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold truncate">Queue Customer</div>
                              <div className="text-[11px] text-slate-400 truncate">Photobooth / event queue flow</div>
                            </div>
                          </div>
                          {interactionMode === 'photobooth' && <Check className="w-4 h-4 text-slate-900 shrink-0 ml-2" />}
                        </button>
                      )}

                      {/* Circle Protocols */}
                      {userCircles.map(c => {
                        const isSelected = interactionMode === 'circle' && (redirectUrl === c.slug || redirectUrl === c.invite_code);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setInteractionMode('circle');
                              setRedirectUrl(c.slug || c.invite_code);
                              setIsInteractionModeOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all",
                              isSelected ? "bg-white shadow-2xs text-slate-900 font-medium" : "hover:bg-white/80 text-slate-700"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 text-indigo-700" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold truncate">Circle ({c.name})</div>
                                <div className="text-[11px] text-slate-400 truncate">Smart scan access flow</div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-slate-900 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                )}
              </div>
            </div>

            {/* Additional inputs depending on selected mode */}
            {interactionMode === 'redirect' && (customRedirectMode === 'custom' || !userLinks.find(l => {
              const platform = getPlatformInfo(l.title, l.url);
              const resolved = platform ? platform.finalUrl : (l.url.startsWith('http') ? l.url : `https://${l.url}`);
              return resolved === redirectUrl || l.url === redirectUrl;
            })) && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Destination URL
                </label>
                <input
                  type="url"
                  required
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            )}

            {interactionMode === 'photobooth' && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Link Queue Registration (Event Join Link)
                </label>
                <input
                  type="url"
                  required
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://rifelo.com/q/join?event_id=XYZ"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/80 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all text-sm"
                />
                <p className="text-[11px] text-slate-400">
                  When the tag is tapped, the visitor will be directed to this queue join link.
                </p>
              </div>
            )}

            {/* Bottom Actions Bar (Matches /profile save design) */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xs inline-flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>

              <div className="flex items-center">
                {error && (
                  <span className="flex items-center text-sm text-red-600 font-medium">
                    <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                    {error}
                  </span>
                )}
                {success && (
                  <span className="flex items-center text-sm text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                    {success}
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-xl p-6 text-center border border-slate-200"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Unbind Tag?</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Are you sure you want to unbind this tag from your account? You can re-pair it anytime using its token code.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-2xs"
                >
                  Unbind
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Message Modal */}
      <AnimatePresence>
        {errorMessage && (
          <div className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-xl p-6 text-center border border-slate-200"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Error</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{errorMessage}</p>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-2xs"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
