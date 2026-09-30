import { redirect, notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { unstable_cache } from 'next/cache';
import { Radio } from 'lucide-react';

// Removed edge runtime due to connection drop on initial load.
export const dynamic = 'force-dynamic';

export const fetchTokenDestination = (token: string) => unstable_cache(
  async () => {
    try {
      // 1. Find the tag and related data in ONE query
      const { data: tag, error: tagError } = await supabaseAdmin
        .from('nfc_tags')
        .select(`
          user_id, 
          status, 
          interaction_mode, 
          redirect_url, 
          circle_id,
          circles (slug, invite_code)
        `)
        .eq('token', token.trim())
        .maybeSingle();

    if (tagError || !tag) {
      return { isValid: false, isInactive: false, destination: null };
    }

    if (tag.status === 'inactive') {
      return { isValid: false, isInactive: true, destination: null };
    }

    // 2. Handle redirect mode
    if (tag.interaction_mode === 'redirect' && tag.redirect_url) {
      let finalUrl = tag.redirect_url;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      return { isValid: true, destination: finalUrl, isExternal: true };
    }

    // 2.5 Handle queue mode
    if (tag.interaction_mode === 'photobooth' && tag.redirect_url) {
      let finalUrl = tag.redirect_url;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      return { isValid: true, destination: finalUrl, isExternal: true };
    }

    // 3. Handle circle mode
    if (tag.interaction_mode === 'circle') {
      let circleData = tag.circles as any;
      if (Array.isArray(circleData)) {
        circleData = circleData[0];
      }
      
      // Prefer the slug if available, then fallback to stored redirect_url or invite_code
      const target = circleData?.slug || tag.redirect_url || circleData?.invite_code;
      if (target) {
        return { isValid: true, destination: `/c/${target}`, isExternal: false };
      }
    }

    // 4. Handle profile mode (default)
    if (tag.user_id) {
      // Manually fetch the username from profiles
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('id', tag.user_id)
        .maybeSingle();
      
      if (profileData?.username) {
        return { isValid: true, destination: `/u/${profileData.username}`, isExternal: false };
      }
      return { isValid: true, destination: '/', isExternal: false };
    }

    // Tag is active but not claimed
    return { isValid: true, destination: `/claim?token=${token}`, isExternal: false };
  } catch (error) {
    console.error('Error fetching token destination:', error);
    return { isValid: false, destination: null };
  }
}, ['nfc-token-redirect', token], {
  revalidate: 60, // Cache for 60 seconds
  tags: ['nfc-tag-redirect']
})();

export default async function NFCTagRedirectPage({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}) {
  const { token } = await params;
  const destination = await fetchTokenDestination(token);
  
  if (destination.isInactive) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 select-none font-sans">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 text-slate-400">
            <Radio className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-slate-300 border border-white/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Tag Inactive</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-2">
            This tag is paused
          </h1>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            The owner has temporarily deactivated redirection for this physical NFC device.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors shadow-sm"
          >
            Go to Rifelo
          </a>
        </div>
      </div>
    );
  }

  if (destination.isValid && destination.destination) {
    redirect(destination.destination);
  } else {
    notFound();
  }
}

