import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { formatIndonesianPhoneNumber } from '@/lib/phone';
import { isRateLimited } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting protection
    let ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    // If it's a list, take the first one (real client IP)
    if (ip.includes(',')) ip = ip.split(',')[0].trim();
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { identifier, phone, code: rawCode, newPassword } = await request.json();
    const finalIdentifier = identifier || phone;

    if (!finalIdentifier || !rawCode || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter.' }, { status: 400 });
    }

    const code = rawCode.trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[System] Missing SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        { error: 'Server error. Please contact support.' },
        { status: 500 }
      );
    }

    // Create a Supabase client with the Service Role Key (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const isEmail = finalIdentifier.includes('@');

    let formattedPhone = finalIdentifier;
    let phoneWithoutPlus = finalIdentifier;
    
    if (!isEmail) {
      formattedPhone = formatIndonesianPhoneNumber(finalIdentifier);
      phoneWithoutPlus = formattedPhone.startsWith('+') ? formattedPhone.substring(1) : formattedPhone;
    }

    // 2. Verify the code in reset_codes table
    const { data: resetRecords, error: resetError } = await supabaseAdmin
      .from('reset_codes')
      .select('*')
      .eq('secret_code', code)
      .not('is_used', 'eq', true);

    if (resetError) {
      console.error('[Reset Password] External DB error:', resetError.message);
      return NextResponse.json(
        { error: 'Terjadi kesalahan sistem(500). Silakan coba beberapa saat lagi.' },
        { status: 500 }
      );
    }

    // Find a record where the cleaned identifier matches
    const resetRecord = resetRecords?.find(record => {
      if (!record.phone) return false;
      const dbIdentifierStr = String(record.phone);
      
      if (isEmail) {
        return dbIdentifierStr.toLowerCase() === finalIdentifier.toLowerCase();
      }

      // Clean both phones (remove all non-digits)
      let dbPhoneCleaned = dbIdentifierStr.replace(/\D/g, '');
      let inputPhoneCleaned = finalIdentifier.replace(/\D/g, '');
      
      // Strip leading country codes or local prefixes
      if (dbPhoneCleaned.startsWith('62')) dbPhoneCleaned = dbPhoneCleaned.substring(2);
      else if (dbPhoneCleaned.startsWith('0')) dbPhoneCleaned = dbPhoneCleaned.substring(1);
      
      if (inputPhoneCleaned.startsWith('62')) inputPhoneCleaned = inputPhoneCleaned.substring(2);
      else if (inputPhoneCleaned.startsWith('0')) inputPhoneCleaned = inputPhoneCleaned.substring(1);
      
      return dbPhoneCleaned === inputPhoneCleaned;
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Kode reset tidak valid. Silakan periksa kembali email/nomor telepon dan kode Anda.' },
        { status: 400 }
      );
    }

    // Check expiration (15 minutes from created_at)
    const createdAt = new Date(resetRecord.created_at).getTime();
    const now = Date.now();
    const expirationTimeMs = 15 * 60 * 1000;
    
    if (now - createdAt > expirationTimeMs) {
      return NextResponse.json(
        { error: 'Kode reset sudah kedaluwarsa. Silakan minta admin untuk membuat kode baru.' },
        { status: 400 }
      );
    }

    // 2. Get the user ID
    let userId;
    
    if (isEmail) {
      console.log('[Reset Password] Using listUsers to find by email', finalIdentifier);
      let page = 1;
      let hasNextPage = true;
      while (hasNextPage) {
        const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
        if (listError) break;
        const users = listData.users;
        if (!users || users.length === 0) break;
        
        const foundUser = users.find(u => u.email?.toLowerCase() === finalIdentifier.toLowerCase());

        if (foundUser) {
           userId = foundUser.id;
           break;
        }

        if (users.length < 100) hasNextPage = false;
        page++;
      }
    } else {
      let { data: rpcUserId, error: rpcError } = await supabaseAdmin.rpc('get_user_id_by_phone', {
        phone_number: formattedPhone
      });

      userId = rpcUserId;

      if (!userId) {
        // Fallback: Use listUsers with pagination to find the user by phone
        console.log('[Reset Password] RPC fallback: listing users to find phone', formattedPhone);
        let page = 1;
        let hasNextPage = true;
        while (hasNextPage) {
          const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 100 });
          if (listError) break;
          const users = listData.users;
          if (!users || users.length === 0) break;
          
          const foundUser = users.find(u => {
             if (!u.phone) return false;
             const uPhone = u.phone.replace(/\D/g, '');
             const tPhone1 = phoneWithoutPlus.replace(/\D/g, '');
             const tPhone2 = formattedPhone.replace(/\D/g, '');
             return uPhone === tPhone1 || uPhone === tPhone2 || uPhone.endsWith(tPhone1);
          });

          if (foundUser) {
             userId = foundUser.id;
             break;
          }

          if (users.length < 100) hasNextPage = false;
          page++;
        }
      }
    }

    if (!userId) {
      console.error('Failed to find user ID for identifier:', finalIdentifier);
      return NextResponse.json(
        { error: 'Akun tidak ditemukan untuk email/nomor telepon ini.' },
        { status: 404 }
      );
    }

    // 3. Update the user's password using Admin API
    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateAuthError) {
      return NextResponse.json(
        { error: updateAuthError.message },
        { status: 400 }
      );
    }

    // 4. Mark code as used
    await supabaseAdmin
      .from('reset_codes')
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq('id', resetRecord.id);

    return NextResponse.json({ success: true, message: 'Password updated successfully' });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
