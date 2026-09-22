import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users, error: err } = await supabaseAdmin.auth.admin.listUsers();
  const user = users?.users?.find(u => u.email === 'marfelringgacoder@gmail.com');
  if (!user) {
    console.log("User not found"); return;
  }
  
  const { count, error } = await supabaseAdmin
      .from('profile_messages')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id)
      .eq('is_read', false);
      
  console.log("Count for false:", count, error);

  const { count: count2, error: error2 } = await supabaseAdmin
      .from('profile_messages')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id)
      .is('is_read', null);
      
  console.log("Count for null:", count2, error2);
}
check();
