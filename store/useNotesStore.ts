import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Note {
  id: string;
  title: string | null;
  content: string;
  linked_note_ids: string[] | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

interface NotesState {
  notes: Note[];
  tags: Tag[];
  isLoading: boolean;
  fetchNotes: () => Promise<void>;
  fetchTags: () => Promise<void>;
  addNote: (title: string | null, content: string, tagIds: string[]) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>, newTagIds?: string[]) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addTag: (name: string, color: string) => Promise<Tag | null>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  tags: [],
  isLoading: false,

  fetchTags: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return;

    const { data } = await supabase.from('tags').select('*').eq('user_id', userId);
    if (data) set({ tags: data });
  },

  fetchNotes: async () => {
    set({ isLoading: true });
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      set({ isLoading: false });
      return;
    }

    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        note_tags (
          tags (*)
        )
      `)
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Fetch Notes Error:", error);
      alert(`Error fetching notes: ${error.message}`);
    }

    if (!error && data) {
      const formattedNotes = data.map((note: any) => ({
        ...note,
        tags: note.note_tags.map((nt: any) => nt.tags).filter(Boolean)
      }));
      set({ notes: formattedNotes as Note[] });
    }
    set({ isLoading: false });
  },

  addTag: async (name, color) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) return null;

    const { data, error } = await supabase
      .from('tags')
      .insert({ user_id: userId, name, color })
      .select()
      .single();

    if (!error && data) {
      set((state) => ({ tags: [...state.tags, data as Tag] }));
      return data as Tag;
    }
    return null;
  },

  addNote: async (title, content, tagIds) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    if (!userId) {
      alert("Debug Error: You are not logged in! (userId is missing)");
      return;
    }

    const { data, error } = await supabase
      .from('notes')
      .insert({ user_id: userId, title, content })
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error:", error);
      alert(`Database Error: ${error.message}`);
      return;
    }

    if (data) {
      const noteId = data.id;
      if (tagIds.length > 0) {
        const tagInserts = tagIds.map(tagId => ({ note_id: noteId, tag_id: tagId }));
        await supabase.from('note_tags').insert(tagInserts);
      }
      get().fetchNotes();
    }
  },

  updateNote: async (id, updates, newTagIds) => {
    await supabase.from('notes').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);

    if (newTagIds !== undefined) {
      await supabase.from('note_tags').delete().eq('note_id', id);
      if (newTagIds.length > 0) {
        const tagInserts = newTagIds.map(tagId => ({ note_id: id, tag_id: tagId }));
        await supabase.from('note_tags').insert(tagInserts);
      }
    }
    get().fetchNotes();
  },

  deleteNote: async (id) => {
    await supabase.from('notes').delete().eq('id', id);
    set((state) => ({ notes: state.notes.filter(n => n.id !== id) }));
  }
}));
