import { supabaseAdmin } from './src/lib/supabaseAdmin';

async function test() {
  const { data, error } = await supabaseAdmin.from('nfc_tags').select(`
    user_id, 
    status, 
    interaction_mode, 
    redirect_url, 
    circle_id,
    circles (slug, invite_code)
  `).limit(1);
  console.log(JSON.stringify({ data, error }, null, 2));

  const { data: data2, error: err2 } = await supabaseAdmin.from('nfc_tags').select(`
    user_id, 
    status, 
    interaction_mode, 
    redirect_url, 
    circle_id,
    circles (slug, invite_code),
    profiles (username)
  `).limit(1);
  console.log(JSON.stringify({ data: data2, error: err2 }, null, 2));
}
test();
