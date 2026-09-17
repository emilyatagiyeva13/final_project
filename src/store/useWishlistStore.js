import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';
import { useAuthStore } from './authStore.js';

export const useWishlistStore = create((set, get) => ({
  wishlist: [], // product_id-lərin siyahısı
  loading: false,

  fetchWishlist: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      set({ wishlist: [] });
      return;
    }

    set({ loading: true });
    const { data, error } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Wishlist fetch error:', error);
    } else {
      set({ wishlist: data.map((row) => row.product_id) });
    }
    set({ loading: false });
  },

  isInWishlist: (productId) => {
    return get().wishlist.includes(productId);
  },

  addToWishlist: async (productId) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.warn('İstifadəçi login deyil');
      return;
    }

    set((state) => ({ wishlist: [...state.wishlist, productId] }));

    const { error } = await supabase
      .from('wishlist')
      .insert({ user_id: userId, product_id: productId });

    if (error) {
      console.error('Add to wishlist error:', error);
      set((state) => ({
        wishlist: state.wishlist.filter((id) => id !== productId),
      }));
    }
  },

  removeFromWishlist: async (productId) => {
    const userId = useAuthStore.getState().user?.id;

    set((state) => ({
      wishlist: state.wishlist.filter((id) => id !== productId),
    }));

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Remove from wishlist error:', error);
    }
  },

  toggleWishlist: (productId) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = get();
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  },

  clearWishlist: () => set({ wishlist: [] }),
}));