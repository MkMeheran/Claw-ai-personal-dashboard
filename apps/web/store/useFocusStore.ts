import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface FocusSession {
  id: string;
  user_id: string;
  subject: string;
  duration_minutes: number;
  session_type: 'pomodoro' | 'manual';
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

interface FocusState {
  sessions: FocusSession[];
  isLoading: boolean;
  fetchSessions: () => Promise<void>;
  addSession: (session: Partial<FocusSession>) => Promise<void>;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  sessions: [],
  isLoading: false,
  fetchSessions: async () => {
    set({ isLoading: true });
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ sessions: data as FocusSession[] });
    }
    set({ isLoading: false });
  },
  addSession: async (session) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({ ...session, user_id: userId })
      .select()
      .single();

    if (!error && data) {
      set((state) => ({ sessions: [data as FocusSession, ...state.sessions] }));
    }
  }
}));
