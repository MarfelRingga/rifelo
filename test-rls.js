const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_policies'); // this might not exist.
  // let's query pg_policies
  const { data: policies, error: err } = await supabase.from('pg_policies').select('*').eq('tablename', 'profile_messages');
  console.log(policies, err);
}
check();
