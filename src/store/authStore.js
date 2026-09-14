import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    set({ profile: data });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ user: session.user });
      await useAuthStore.getState().fetchProfile(session.user.id);
    }
    set({ loading: false });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ user: session?.user ?? null });
      if (session?.user) {
        await useAuthStore.getState().fetchProfile(session.user.id);
      } else {
        set({ profile: null });
      }
    });
  },
}));