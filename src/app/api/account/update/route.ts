import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { normalizePhoneNumber, isValidPhoneNumber } from '@/lib/phone';

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: 'Invalid or expired session. Please sign in again.' }, { status: 401 });
    }

    // Fetch user profile for latest baseline values
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('email, phone')
      .eq('id', user.id)
      .maybeSingle();

    const currentEmail = (user.email || profile?.email || '').trim().toLowerCase();
    const currentPhone = normalizePhoneNumber(user.phone || profile?.phone || '');

    const body = await req.json();
    const { type } = body;

    // ==========================================
    // 1. UPDATE PHONE NUMBER
    // ==========================================
    if (type === 'phone') {
      const { oldPhone, newPhone } = body;

      if (!oldPhone || typeof oldPhone !== 'string') {
        return NextResponse.json({ error: 'Current phone number is required for verification.' }, { status: 400 });
      }

      if (!newPhone || typeof newPhone !== 'string') {
        return NextResponse.json({ error: 'New phone number is required.' }, { status: 400 });
      }

      // Verify old phone matches registered phone (checks normalized auth phone or profile phone)
      const normInputOld = normalizePhoneNumber(oldPhone);
      const normAuth = normalizePhoneNumber(user.phone);
      const normProfile = normalizePhoneNumber(profile?.phone);

      const isMatch = 
        (normAuth && normInputOld === normAuth) || 
        (normProfile && normInputOld === normProfile);

      if (!isMatch) {
        return NextResponse.json({ error: 'Current phone number does not match registered records.' }, { status: 400 });
      }

      if (!isValidPhoneNumber(newPhone)) {
        return NextResponse.json({ error: 'New phone number is invalid (must be between 10-15 digits).' }, { status: 400 });
      }

      const cleanNewPhone = normalizePhoneNumber(newPhone);

      if (cleanNewPhone === currentPhone) {
        return NextResponse.json({ error: 'New phone number cannot be the same as your current phone.' }, { status: 400 });
      }

      // Check if new phone is already registered by another account in profiles
      const { data: existingPhoneProfile, error: phoneCheckError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('phone', cleanNewPhone)
        .neq('id', user.id)
        .maybeSingle();

      if (phoneCheckError) {
        console.error('Phone check error:', phoneCheckError);
        return NextResponse.json({ error: 'Failed to validate phone number.' }, { status: 500 });
      }

      if (existingPhoneProfile) {
        return NextResponse.json({ error: 'This phone number is already registered to another account.' }, { status: 400 });
      }

      // Update auth user (Supabase Auth saves in standard digits format)
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          phone: cleanNewPhone,
          phone_confirm: true,
        }
      );

      if (authUpdateError) {
        console.error('Auth phone update error:', authUpdateError);
        return NextResponse.json({ error: authUpdateError.message || 'Failed to update phone number in authentication.' }, { status: 400 });
      }

      // Update profiles table in unified format
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({
          phone: cleanNewPhone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileUpdateError) {
        console.error('Profiles phone update error:', profileUpdateError);
        return NextResponse.json({ error: 'Failed to update phone number in profile.' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Phone number updated successfully.',
        phone: cleanNewPhone
      });
    }

    // ==========================================
    // 2. UPDATE EMAIL ADDRESS
    // ==========================================
    if (type === 'email') {
      const { oldEmail, newEmail } = body;

      if (!oldEmail || typeof oldEmail !== 'string') {
        return NextResponse.json({ error: 'Current email address is required for verification.' }, { status: 400 });
      }

      if (!newEmail || typeof newEmail !== 'string') {
        return NextResponse.json({ error: 'New email address is required.' }, { status: 400 });
      }

      const cleanInputOldEmail = oldEmail.trim().toLowerCase();
      if (cleanInputOldEmail !== currentEmail) {
        return NextResponse.json({ error: 'Current email address does not match registered records.' }, { status: 400 });
      }

      const cleanNewEmail = newEmail.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanNewEmail)) {
        return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
      }

      if (cleanNewEmail === currentEmail) {
        return NextResponse.json({ error: 'New email address cannot be the same as your current email.' }, { status: 400 });
      }

      // Check if new email is already registered by another account
      const { data: existingEmailProfile, error: emailCheckError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', cleanNewEmail)
        .neq('id', user.id)
        .maybeSingle();

      if (emailCheckError) {
        console.error('Email check error:', emailCheckError);
        return NextResponse.json({ error: 'Failed to validate email address.' }, { status: 500 });
      }

      if (existingEmailProfile) {
        return NextResponse.json({ error: 'This email is already registered to another account.' }, { status: 400 });
      }

      // Update auth user
      const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          email: cleanNewEmail,
          email_confirm: true,
        }
      );

      if (authUpdateError) {
        console.error('Auth email update error:', authUpdateError);
        return NextResponse.json({ error: authUpdateError.message || 'Failed to update email in authentication.' }, { status: 400 });
      }

      // Update profiles table
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({
          email: cleanNewEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileUpdateError) {
        console.error('Profiles email update error:', profileUpdateError);
        return NextResponse.json({ error: 'Failed to update email in profile.' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Email address updated successfully.',
        email: cleanNewEmail
      });
    }

    return NextResponse.json({ error: 'Invalid update type. Choose phone or email.' }, { status: 400 });

  } catch (error: any) {
    console.error('Account update error:', error);
    return NextResponse.json({ error: error.message || 'An unexpected server error occurred.' }, { status: 500 });
  }
}
