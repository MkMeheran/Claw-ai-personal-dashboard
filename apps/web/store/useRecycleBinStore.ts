import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface RecycleItem {
  id: string;
  user_id: string;
  original_table: string;
  original_id: string;
  payload: any;
  deleted_at: string;
}

interface RecycleBinState {
  items: RecycleItem[];
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  restoreItem: (id: string) => Promise<void>;
  deletePermanently: (id: string) => Promise<void>;
  emptyBin: () => Promise<void>;
}

export const useRecycleBinStore = create<RecycleBinState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user?.id) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('recycle_bin')
      .select('*')
      .order('deleted_at', { ascending: false });

    if (error) {
      console.error("Recycle Bin Fetch Error:", error);
      alert(`Recycle Bin Error: ${error.message}`);
    }

    if (!error && data) {
      set({ items: data as RecycleItem[] });
    }
    set({ isLoading: false });
  },

  restoreItem: async (id: string) => {
    const { error } = await supabase.rpc('restore_from_recycle_bin', { bin_id: id });
    if (!error) {
      get().fetchItems();
    } else {
      console.error("Restore failed:", error);
      alert("Failed to restore item: " + (error as any).message);
    }
  },

  deletePermanently: async (id: string) => {
    await supabase.from('recycle_bin').delete().eq('id', id);
    get().fetchItems();
  },

  emptyBin: async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user?.id) return;
    
    await supabase.from('recycle_bin').delete().eq('user_id', session.session.user.id);
    get().fetchItems();
  }
}));
