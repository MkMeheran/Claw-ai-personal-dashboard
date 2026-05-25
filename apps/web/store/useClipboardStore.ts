import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type ClipboardType = 'text' | 'url' | 'code' | 'address';

export interface ClipboardItem {
  id: string;
  user_id: string;
  content: string;
  type: ClipboardType;
  is_pinned: boolean;
  is_secret: boolean;
  device_source: string;
  created_at: string;
}

interface ClipboardState {
  items: ClipboardItem[];
  isLoading: boolean;
  setItems: (items: ClipboardItem[]) => void;
  addItem: (item: ClipboardItem) => void;
  updateItem: (id: string, updates: Partial<ClipboardItem>) => void;
  removeItem: (id: string) => void;
  fetchItems: () => Promise<void>;
  addClip: (content: string, deviceSource?: string) => Promise<void>;
  togglePin: (id: string, isPinned: boolean) => Promise<void>;
  deleteClip: (id: string) => Promise<void>;
}

const detectType = (content: string): ClipboardType => {
  if (/^https?:\/\//i.test(content.trim())) return 'url';
  if (/([{};]|\b(const|let|var|function|class|import)\b|<\/?\w+>)/.test(content)) return 'code';
  if (/^\d+\s+[A-Za-z\s]+(,\s*[A-Za-z\s]+)?(,\s*[A-Z]{2}\s+\d{5})?/i.test(content)) return 'address';
  return 'text';
};

export const useClipboardStore = create<ClipboardState>((set, get) => ({
  items: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => {
    // Keep max 50 items
    const newItems = [item, ...state.items.filter(i => i.id !== item.id)].slice(0, 50);
    return { items: newItems.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) };
  }),
  updateItem: (id, updates) => set((state) => {
    const newItems = state.items.map((item) => (item.id === id ? { ...item, ...updates } : item));
    return { items: newItems.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),

  fetchItems: async () => {
    set({ isLoading: true });
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('clipboard_items')
      .select('*')
      .eq('user_id', userId)
      .eq('is_secret', false)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      set({ items: data as ClipboardItem[] });
    }
    set({ isLoading: false });
  },

  addClip: async (content, deviceSource = 'web') => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;

    const type = detectType(content);
    
    // Optimistic insert
    const tempId = crypto.randomUUID();
    const newItem: ClipboardItem = {
      id: tempId,
      user_id: userId,
      content,
      type,
      is_pinned: false,
      is_secret: false,
      device_source: deviceSource,
      created_at: new Date().toISOString()
    };
    get().addItem(newItem);

    const { data, error } = await supabase
      .from('clipboard_items')
      .insert({
        user_id: userId,
        content,
        type,
        device_source: deviceSource
      })
      .select()
      .single();

    if (!error && data) {
      get().updateItem(tempId, data as ClipboardItem);
    } else {
      console.error("Supabase Insert Error:", error);
      alert(`Debug Error: ${error?.message || "Unknown error occurred"}`);
      get().removeItem(tempId);
    }
  },

  togglePin: async (id, isPinned) => {
    get().updateItem(id, { is_pinned: !isPinned });
    await supabase
      .from('clipboard_items')
      .update({ is_pinned: !isPinned })
      .eq('id', id);
  },

  deleteClip: async (id) => {
    get().removeItem(id);
    await supabase
      .from('clipboard_items')
      .delete()
      .eq('id', id);
  }
}));
