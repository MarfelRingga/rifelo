import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users, error: err } = await supabase.auth.admin.listUsers();
  if (users?.users) {
     for (const user of users.users) {
       if (user.email === 'marfelringgacoder@gmail.com') {
          console.log('User id:', user.id);
          const { data, count } = await supabase.from('profile_messages').select('*', {count: 'exact'}).eq('profile_id', user.id);
          console.log('Messages count:', count);
          console.log('Messages:', data);
       }
     }
  }
}
check();
