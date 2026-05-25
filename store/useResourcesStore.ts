import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface SavedLink {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  category: string | null;
  thumbnail_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  user_id: string;
  name: string;
  platform: string | null;
  progress_pct: number;
  updated_at: string;
}

interface ResourcesState {
  links: SavedLink[];
  courses: Course[];
  isLoading: boolean;
  fetchLinks: () => Promise<void>;
  fetchCourses: () => Promise<void>;
  addLink: (link: Partial<SavedLink>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  addCourse: (course: Partial<Course>) => Promise<void>;
  updateCourseProgress: (id: string, progress: number) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
}

export const useResourcesStore = create<ResourcesState>((set, get) => ({
  links: [],
  courses: [],
  isLoading: false,
  
  fetchLinks: async () => {
    set({ isLoading: true });
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) {
      set({ isLoading: false });
      return;
    }

    const { data } = await supabase.from('saved_links').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) set({ links: data });
    set({ isLoading: false });
  },

  fetchCourses: async () => {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) return;

    const { data } = await supabase.from('courses').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
    if (data) set({ courses: data });
  },

  addLink: async (link) => {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) return;

    await supabase.from('saved_links').insert({ ...link, user_id: userId });
    get().fetchLinks();
  },

  deleteLink: async (id) => {
    await supabase.from('saved_links').delete().eq('id', id);
    get().fetchLinks();
  },

  addCourse: async (course) => {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    if (!userId) return;

    await supabase.from('courses').insert({ ...course, user_id: userId });
    get().fetchCourses();
  },

  updateCourseProgress: async (id, progress) => {
    await supabase.from('courses').update({ progress_pct: progress, updated_at: new Date().toISOString() }).eq('id', id);
    get().fetchCourses();
  },

  deleteCourse: async (id) => {
    await supabase.from('courses').delete().eq('id', id);
    get().fetchCourses();
  }
}));
