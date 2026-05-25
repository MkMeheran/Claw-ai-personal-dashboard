'use client';

import { RetroCard } from '@/components/ui/RetroCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { Bot, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, [router]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'https://www.googleapis.com/auth/drive.file',
      },
    });
    if (error) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 p-4 font-[family-name:var(--font-space)]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-amber-400 border-4 border-stone-950 rounded flex items-center justify-center mb-4"
            style={{ boxShadow: 'inset -3px -3px 0px #6b6b6b, inset 3px 3px 0px #e0d8cc' }}>
            <Bot size={40} className="text-stone-900" />
          </div>
          <h1 className="font-[family-name:var(--font-space-mono)] font-black text-4xl text-stone-100 tracking-widest uppercase">
            NEXUS
          </h1>
          <p className="text-stone-400 font-bold mt-2 text-center">
            Personal Cross-Platform Companion App
          </p>
        </div>

        <RetroCard title="System Login" icon={LogIn} accentColor="amber">
          <div className="py-6 flex flex-col items-center space-y-4">
            <p className="text-center font-bold text-stone-600 mb-2">
              Authentication required to access the central hub.
            </p>
            <RetroButton
              label="Login with Google"
              variant="primary"
              fullWidth
              onClick={handleGoogleLogin}
            />
          </div>
        </RetroCard>
      </div>
    </div>
  );
}
