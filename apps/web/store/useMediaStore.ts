import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface MediaItem {
  id: string;
  user_id: string;
  drive_file_id: string;
  drive_url: string;
  thumbnail_url: string;
  file_name: string;
  file_type: string;
  size_bytes: number;
  created_at: string;
}

interface MediaState {
  items: MediaItem[];
  isLoading: boolean;
  fetchMedia: () => Promise<void>;
}

export const useMediaStore = create<MediaState>((set) => ({
  items: [],
  isLoading: false,
  fetchMedia: async () => {
    set({ isLoading: true });
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('media_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ items: data as MediaItem[] });
    }
    set({ isLoading: false });
  }
}));
