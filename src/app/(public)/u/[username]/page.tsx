import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { 
  CheckCircle2, 
  Briefcase, 
  Mail, 
  Link as LinkIcon, 
  Hash,
  Globe,
  EyeOff,
  User,
  Building,
  GraduationCap,
  Palette,
  Phone,
  Info,
  FileText,
  Feather,
  MessageCircle
} from 'lucide-react';
import MessageForm from './MessageForm';
import { getPlatformInfo } from '@/lib/platforms';
import CircleRealtimeView from './CircleRealtimeView';
import Link from 'next/link';
import { decodeMessageSettings } from '@/lib/messageSettings';
import { themePresets, getTheme } from '@/lib/themePresets';
import { ProfileMode } from '@/lib/types/profile';
import HeroBrutalism from '@/components/HeroBrutalism';
import PhantomDeckProfile from '@/components/PhantomDeckProfile';
import MinimalProfile from '@/components/MinimalProfile';
import PublicProfileView from '@/components/profile/PublicProfileView';

export const revalidate = 60; // Cache for 60 seconds (ISR)

async function getProfileData(username: string) {
  try {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        profile_links (*)
      `)
      .ilike('username', username)
      .maybeSingle();

    if (profileError || !profile) return null;

    // Sort links by sort_order
    const links = profile.profile_links || [];
    links.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

    const visibleLinks = links.filter((l: any) => l.is_visible !== false);

    const messageSettings = decodeMessageSettings(profile.message_placeholder_name || 'Your Name (Optional)');

    return {
      id: profile.id,
      username: profile.username,
      fullName: profile.full_name || 'User',
      bio: profile.bio || '',
      company: profile.company || '',
      email: profile.email || '',
      phone: profile.phone || '',
      website: profile.website || '',
      jobTitle: profile.job_title || '',
      links: visibleLinks,
      isPublic: profile.is_public !== false,
      allowMessages: messageSettings.isEnabled,
      messagePlaceholderName: messageSettings.cleanName,
      messagePlaceholderContent: profile.message_placeholder_content || 'Write a secret message...',
      profileMode: (profile.profile_mode as ProfileMode) || 'casual',
      themePreset: profile.theme_preset || 'minimal',
      customTheme: profile.custom_theme
    };
  } catch (err) {
    console.error('Error fetching profile data:', err);
    return null;
  }
}

export default async function PublicProfilePage({ params, searchParams }: { params: Promise<{ username: string }>, searchParams: Promise<{ mode?: string, circle?: string }> }) {
  const { username } = await params;
  const { mode, circle } = await searchParams;
  const profile = await getProfileData(username);

  if (!profile) notFound();

  // Handle Private Profile
  if (!profile.isPublic) {
    return (
      <div className="min-h-screen bg-[#F4F3EE] font-sans py-12 px-4 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#0c0e0b] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <EyeOff className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0c0e0b]">Profile is Private</h1>
          <p className="text-[#aaafbc]">This user has chosen to keep their profile private.</p>
          <Link  
            href="/"
            className="inline-block mt-6 text-sm font-bold text-[#0c0e0b] hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Handle Hub Mode via Secret Link
  if (circle) {
    // Fetch circle slug for better navigation
    const { data: circleData } = await supabaseAdmin
      .from('circles')
      .select('slug')
      .eq('invite_code', circle.toUpperCase())
      .maybeSingle();

    return <CircleRealtimeView inviteCode={circle} slug={circleData?.slug} profileId={profile.id} profileName={profile.fullName} />;
  }

  // Handle Legacy Hub Mode
  if (mode === 'hub' || mode === 'circle') {
    return (
      <div className="min-h-screen bg-[#F4F3EE] font-sans py-12 px-4 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#0c0e0b] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0c0e0b]">Link Expired</h1>
          <p className="text-[#aaafbc]">This hub link format is no longer supported. Please use the new secret link format from your dashboard.</p>
        </div>
      </div>
    );
  }

  return <PublicProfileView profile={profile} />;
}

