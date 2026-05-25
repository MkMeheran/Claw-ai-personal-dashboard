'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Explicitly grab the provider token from the URL hash before Supabase clears it!
    if (typeof window !== 'undefined' && window.location.hash) {
      const match = window.location.hash.match(/provider_token=([^&]+)/);
      if (match && match[1]) {
        localStorage.setItem('google_provider_token', match[1]);
      }
    }

    // Supabase handles the URL hash/code automatically via detectSessionInUrl: true
    // We just need to wait for the session to be established then redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (session.user.email !== 'mdmokammelmorshed@gmail.com') {
          supabase.auth.signOut().then(() => {
            alert('Access Denied: This is a private instance. Only the owner can log in.');
            router.replace('/login');
          });
          return;
        }

        if (session.provider_token) {
          localStorage.setItem('google_provider_token', session.provider_token);
        }
        subscription.unsubscribe();
        router.replace('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('google_provider_token');
        router.replace('/login');
      }
    });

    // Also check immediately in case event already fired
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (session.user.email !== 'mdmokammelmorshed@gmail.com') {
          supabase.auth.signOut().then(() => router.replace('/login'));
          return;
        }
        router.replace('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-[family-name:var(--font-space-mono)] font-black text-amber-400 uppercase tracking-widest text-sm">
          Connecting to NEXUS...
        </p>
      </div>
    </div>
  );
}
