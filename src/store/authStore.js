import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';
import { useWishlistStore } from './useWishlistStore.js';
import useCartStore from './useCartStore.js';

let initStarted = false;

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
    useCartStore.getState().clearBasket();
  },

  init: async () => {
    if (initStarted) return;
    initStarted = true;

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      set({ user: session.user, loading: false }); 

      Promise.all([
        useAuthStore.getState().fetchProfile(session.user.id),
        useWishlistStore.getState().fetchWishlist(),
        useCartStore.getState().fetchBasket(),
      ]);
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ user: session?.user ?? null });
      if (session?.user) {
        Promise.all([
          useAuthStore.getState().fetchProfile(session.user.id),
          useWishlistStore.getState().fetchWishlist(),
          useCartStore.getState().fetchBasket(),
        ]);
      } else {
        set({ profile: null, loading: false });
        useWishlistStore.getState().clearWishlist();
        useCartStore.getState().clearBasket();
      }
    });
  },
}));