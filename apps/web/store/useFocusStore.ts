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
  deleteSession: (id: string) => Promise<void>;
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

    if (error) {
      console.error("Fetch Sessions Error:", error);
      alert(`Error fetching focus sessions: ${error.message}`);
    }

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

    if (error) {
      console.error("Failed to add focus session:", error);
      alert(`Failed to save focus session: ${error.message}`);
      return;
    }

    if (data) {
      set((state) => ({ sessions: [data as FocusSession, ...state.sessions] }));
    }
  },
  deleteSession: async (id: string) => {
    const { error } = await supabase.from('focus_sessions').delete().eq('id', id);
    if (error) {
      console.error("Failed to delete focus session:", error);
      alert(`Failed to delete session: ${error.message}`);
    } else {
      set((state) => ({ sessions: state.sessions.filter(s => s.id !== id) }));
    }
  }
}));
