import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data } = await supabaseAdmin.from('profile_messages').select('*').eq('is_read', false);
  console.log("ALL UNREAD MESSAGES IN DATABASE:", data);
}
check();
