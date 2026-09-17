import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';
import { useWishlistStore } from './useWishlistStore.js';

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
    useWishlistStore.getState().clearWishlist();
  },

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ user: session.user });
      await useAuthStore.getState().fetchProfile(session.user.id);
      await useWishlistStore.getState().fetchWishlist();
    }
    set({ loading: false });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ user: session?.user ?? null });
      if (session?.user) {
        await useAuthStore.getState().fetchProfile(session.user.id);
        await useWishlistStore.getState().fetchWishlist();
      } else {
        set({ profile: null });
        useWishlistStore.getState().clearWishlist();
      }
    });
  },
}));