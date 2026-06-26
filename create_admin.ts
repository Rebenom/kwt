import { loadEnvConfig } from '@next/env';
// Load environment variables from .env / .env.local
loadEnvConfig(process.cwd());

import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Clean the URL if it contains /rest/v1/
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || 'admin@example.com';
  const password = args[1] || 'PasswordAdmin123!';

  console.log(`Creating admin user: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });

  if (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }

  console.log('Admin user created successfully!');
  console.log('Email:', data.user?.email);
  console.log('You can now log in at /admin/login');
}

main();
