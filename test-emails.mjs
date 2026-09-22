import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  const { data: users } = await supabaseAdmin.auth.admin.listUsers();
  for (const u of users.users) {
    if (u.id === '0b6ff8f5-f571-4e32-9119-89b9e81cbdde' || u.id === 'ced21a3b-2eed-4724-9d39-071155fdd566') {
      console.log(u.email, u.id);
    }
  }
}
check();
