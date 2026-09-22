import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  const { data } = await supabaseAdmin.from('profile_messages').select('id, is_read').eq('profile_id', 'd381e6cf-68b3-4932-8c61-960b984a35fc');
  console.log("USER MESSAGES:", data);
}
check();
