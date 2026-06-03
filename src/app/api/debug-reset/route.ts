import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 10 });
  const { data: resetCodes, error: resetError } = await supabaseAdmin.from('reset_codes').select('*').limit(10);
  
  return NextResponse.json({
    users: listData?.users.map(u => ({ id: u.id, phone: u.phone, email: u.email })),
    listError,
    resetCodes,
    resetError
  });
}
