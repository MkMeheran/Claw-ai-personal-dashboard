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
const key = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!url || !key) {
  console.error("Missing Supabase URL or Key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function runTests() {
  console.log("🔍 Checking actual Supabase Database state...\n");

  const tablesToTest = [
    'users',
    'clipboard_items',
    'media_items',
    'file_queue',
    'notes',
    'saved_links',
    'courses',
    'focus_sessions',
    'daily_logs',
    'vault_secrets'
  ];

  for (const table of tablesToTest) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ Table '${table}' ERROR: ${error.message}`);
    } else {
      console.log(`✅ Table '${table}' exists and is accessible.`);
    }
  }
}

runTests();
