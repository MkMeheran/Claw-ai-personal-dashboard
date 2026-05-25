'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RetroSidebar } from '@/components/ui/RetroSidebar';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Instantly reveal the dashboard if we have a cached login state (0.001s load)
    if (typeof window !== 'undefined' && localStorage.getItem('nexus_is_logged_in') === 'true') {
      setIsChecking(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        if (typeof window !== 'undefined') localStorage.removeItem('nexus_is_logged_in');
        router.replace('/login');
      } else if (session.user.email !== 'mdmokammelmorshed@gmail.com') {
        supabase.auth.signOut().then(() => router.replace('/login'));
      } else {
        if (typeof window !== 'undefined') localStorage.setItem('nexus_is_logged_in', 'true');
        setIsChecking(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (typeof window !== 'undefined') localStorage.removeItem('nexus_is_logged_in');
        router.replace('/login');
      } else if (event === 'SIGNED_IN') {
        if (session.user.email !== 'mdmokammelmorshed@gmail.com') {
          supabase.auth.signOut().then(() => router.replace('/login'));
          return;
        }
        if (typeof window !== 'undefined') localStorage.setItem('nexus_is_logged_in', 'true');
        setIsChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className={cn(
      "flex h-screen bg-stone-100 overflow-hidden relative transition-opacity duration-200",
      isChecking ? "opacity-0" : "opacity-100"
    )}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <RetroSidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-stone-900 p-4 border-b-4 border-stone-950 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 border-2 border-stone-950 rounded flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-900">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" />
                <line x1="16" y1="16" x2="16" y2="16" />
              </svg>
            </div>
            <h1 className="font-[family-name:var(--font-space-mono)] font-black text-xl text-stone-100 tracking-widest">
              NEXUS
            </h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-stone-800 text-stone-100 rounded border-2 border-stone-950 hover:bg-stone-700 active:translate-y-0.5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isSidebarOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
