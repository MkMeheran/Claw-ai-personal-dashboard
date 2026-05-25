import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  rating: number;
  focus_score: number;
  mood: string | null;
  notes: string | null;
}

interface AnalyticsState {
  logs: DailyLog[];
  isLoading: boolean;
  fetchLogs: () => Promise<void>;
  addLog: (log: Partial<DailyLog>) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  logs: [],
  isLoading: false,

  fetchLogs: async () => {
    set({ isLoading: true });
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) {
      set({ isLoading: false });
      return;
    }

    const { data } = await supabase.from('daily_logs').select('*').eq('user_id', userId).order('date', { ascending: false });
    if (data) set({ logs: data as DailyLog[] });
    set({ isLoading: false });
  },

  addLog: async (log) => {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) return;

    // Check if entry for date already exists
    const existing = get().logs.find(l => l.date === log.date);
    
    if (existing) {
      await supabase.from('daily_logs').update(log).eq('id', existing.id);
    } else {
      await supabase.from('daily_logs').insert({ ...log, user_id: userId });
    }
    
    get().fetchLogs();
  }
}));
