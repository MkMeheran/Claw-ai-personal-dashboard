import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface FileQueueItem {
  id: string;
  user_id: string;
  file_name: string;
  drive_file_id: string | null;
  download_url: string | null;
  qr_code_data: string | null;
  status: 'pending' | 'uploaded' | 'downloaded';
  created_at: string;
}

interface FilesState {
  items: FileQueueItem[];
  isLoading: boolean;
  fetchFiles: () => Promise<void>;
}

export const useFilesStore = create<FilesState>((set) => ({
  items: [],
  isLoading: false,
  fetchFiles: async () => {
    set({ isLoading: true });
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('file_queue')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ items: data as FileQueueItem[] });
    }
    set({ isLoading: false });
  }
}));
