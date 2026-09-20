import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';
import { useAuthStore } from './authStore.js';

const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchBasket: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      set({ items: [] });
      return;
    }

    set({ loading: true });

    const { data, error } = await supabase
      .from('basket')
      .select(`
        product_id,
        quantity,
        products (
          id,
          title_az,
          title_en,
          price,
          image_url,
          stock
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Basket fetch error:', error);
      set({ items: [] });
    } else {
      const formattedItems = data.map((row) => ({
        id: row.products.id,
        product_id: row.product_id,
        title: row.products.title_az || row.products.title_en,
        title_az: row.products.title_az,
        title_en: row.products.title_en,
        price: row.products.price,
        image: row.products.image_url,
        stock: row.products.stock,
        quantity: row.quantity,
      }));
      set({ items: formattedItems });
    }
    set({ loading: false });
  },

  addItem: async (product) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const existing = get().items.find((b) => b.id === product.id);

    if (existing) {
      await get().updateQuantity(product.id, existing.quantity + 1);
      return;
    }

    set((state) => ({
      items: [
        ...state.items,
        {
          id: product.id,
          product_id: product.id,
          title: product.title_az || product.title,
          title_az: product.title_az,
          title_en: product.title_en,
          price: product.price,
          image: product.image_url || product.image,
          stock: product.stock,
          quantity: 1,
        },
      ],
    }));

    const { error } = await supabase
      .from('basket')
      .upsert(
        { user_id: userId, product_id: product.id, quantity: 1 },
        { onConflict: 'user_id,product_id' }
      );

    if (error) {
      console.error('Add to basket error:', error);
      get().fetchBasket();
    }
  },

  updateQuantity: async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const userId = useAuthStore.getState().user?.id;
    const current = get().items.find((b) => b.id === productId);
    if (!current) return;

    set((state) => ({
      items: state.items.map((b) =>
        b.id === productId ? { ...b, quantity: newQuantity } : b
      ),
    }));

    const { error } = await supabase
      .from('basket')
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Update quantity error:', error);
      get().fetchBasket();
    }
  },

  removeItem: async (productId) => {
    const userId = useAuthStore.getState().user?.id;
    const previous = get().items;

    set((state) => ({
      items: state.items.filter((b) => b.id !== productId),
    }));

    const { error } = await supabase
      .from('basket')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Remove from basket error:', error);
      set({ items: previous });
    }
  },

  clearBasket: async () => {
    const userId = useAuthStore.getState().user?.id;
    const previousItems = get().items;

    set({ items: [] });

    if (userId) {
      const { error } = await supabase
        .from('basket')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Clear basket error:', error);
        set({ items: previousItems }); 
      }
    }
  },

  clearCart: async () => {
    await get().clearBasket();
  },

  totalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

export default useCartStore;