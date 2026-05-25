import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envContent = fs.readFileSync(path.resolve(__dirname, '.env.local'), 'utf-8');
const envVars = Object.fromEntries(
  envContent.split('\n').filter(line => line && !line.startsWith('#')).map(line => {
    const parts = line.split('=');
    return [parts[0].trim(), parts.slice(1).join('=').trim()];
  })
);

const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const key = envVars['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(url, key);

async function debug() {
  console.log("=== SUPABASE DEBUGGER ===");
  
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.log("Failed to list auth.users:", authError.message);
    return;
  }
  console.log(`Auth users count: ${authData.users.length}`);
  if (authData.users.length === 0) {
    console.log("No users have signed up yet.");
    return;
  }
  
  const userId = authData.users[0].id;
  console.log(`First User ID: ${userId} (${authData.users[0].email})`);

  const { data: pubData, error: pubError } = await supabase.from('users').select('*');
  console.log(`Public users count: ${pubData?.length || 0}`);
  if (pubError) console.log("Public users error:", pubError.message);
  
  console.log("\nAttempting to insert a test item into clipboard_items...");
  const { data: insertData, error: insertError } = await supabase.from('clipboard_items').insert({
    user_id: userId,
    content: "TEST DEBUG ITEM",
    type: "text"
  }).select();

  if (insertError) {
    console.log("❌ INSERT FAILED with error:");
    console.log(insertError);
  } else {
    console.log("✅ INSERT SUCCEEDED!");
    console.log(insertData);
    await supabase.from('clipboard_items').delete().eq('content', 'TEST DEBUG ITEM');
  }
}

debug();
