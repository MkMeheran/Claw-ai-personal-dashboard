import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envContent = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf-8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const parts = line.split('=');
      return [parts[0].trim(), parts.slice(1).join('=').trim()];
    })
);

const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const key = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixUserIssue() {
  console.log("Fetching users from auth.users...");
  // Use admin api to list users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error("Auth error:", authError);
    return;
  }

  const users = authData.users;
  console.log(`Found ${users.length} authenticated users.`);

  for (const u of users) {
    // Check if user exists in public.users
    const { data: pubUser } = await supabase.from('users').select('*').eq('id', u.id).single();
    
    if (!pubUser) {
      console.log(`User ${u.email} missing from public.users. Inserting...`);
      const { error: insertError } = await supabase.from('users').insert({
        id: u.id,
        email: u.email,
        display_name: u.user_metadata?.full_name || u.email.split('@')[0]
      });
      
      if (insertError) {
        console.error("Failed to insert user:", insertError.message);
      } else {
        console.log("Successfully synced user!");
      }
    } else {
      console.log(`User ${u.email} already exists in public.users.`);
    }
  }

  console.log("Checking for trigger setup...");
}

fixUserIssue();
