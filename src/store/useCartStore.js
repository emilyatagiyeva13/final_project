import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '../supabaseClient';
import { useAuthStore } from './authStore';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetchCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return set({ items: [] });

        set({ loading: true });
        const { data, error } = await supabase
          .from('basket')
          .select('id, quantity, products(id, title_az, title_en, price, image_url, stock)')
          .eq('user_id', user.id);

        if (!error && data) {
          const items = data.map((row) => ({
            id: row.id,
            productId: row.products.id,
            title: row.products.title_az,
            price: row.products.price,
            image: row.products.image_url,
            stock: row.products.stock,
            quantity: row.quantity,
          }));
          set({ items, loading: false });
        } else {
          set({ loading: false });
        }
      },

      addItem: async (product) => {
        const user = useAuthStore.getState().user;
        if (!user) return false; // login yoxdursa əlavə edilmir

        const { items } = get();
        const existing = items.find((i) => i.productId === product.id);
        if (existing) {
          await get().updateQuantity(existing.id, existing.quantity + 1);
          return true;
        }

        const { data, error } = await supabase
          .from('basket')
          .insert({ user_id: user.id, product_id: product.id, quantity: 1 })
          .select()
          .single();

        if (!error) {
          set({
            items: [
              ...items,
              {
                id: data.id,
                productId: product.id,
                title: product.title_az,
                price: product.price,
                image: product.image_url,
                stock: product.stock,
                quantity: 1,
              },
            ],
          });
          return true;
        }
        return false;
      },

      removeItem: async (basketId) => {
        await supabase.from('basket').delete().eq('id', basketId);
        set({ items: get().items.filter((i) => i.id !== basketId) });
      },

      updateQuantity: async (basketId, quantity) => {
        if (quantity < 1) return get().removeItem(basketId);

        await supabase
          .from('basket')
          .update({ quantity, updated_at: new Date().toISOString() })
          .eq('id', basketId);

        set({
          items: get().items.map((i) =>
            i.id === basketId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: async () => {
        const user = useAuthStore.getState().user;
        if (user) await supabase.from('basket').delete().eq('user_id', user.id);
        set({ items: [] });
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'xezer-kitabevi-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;