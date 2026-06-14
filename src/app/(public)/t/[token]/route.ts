import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  
  try {
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

    if (tagError || !tag || tag.status !== 'active') {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    if (tag.interaction_mode === 'redirect' && tag.redirect_url) {
      let finalUrl = tag.redirect_url;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      return NextResponse.redirect(finalUrl);
    }

    if (tag.interaction_mode === 'photobooth' && tag.redirect_url) {
      let finalUrl = tag.redirect_url;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      return NextResponse.redirect(finalUrl);
    }

    if (tag.interaction_mode === 'circle') {
      if (tag.redirect_url) {
        return NextResponse.redirect(new URL(`/c/${tag.redirect_url}`, request.url));
      }
      
      const circleData = tag.circles as any;
      const target = circleData?.slug || circleData?.invite_code;
      if (target) {
        return NextResponse.redirect(new URL(`/c/${target}`, request.url));
      }
    }

    if (tag.user_id) {
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('username')
        .eq('id', tag.user_id)
        .maybeSingle();
      
      if (profileData?.username) {
        return NextResponse.redirect(new URL(`/u/${profileData.username}`, request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.redirect(new URL(`/claim?token=${token}`, request.url));
  } catch (error) {
    console.error('Error fetching token destination:', error);
    return NextResponse.redirect(new URL('/404', request.url));
  }
}
