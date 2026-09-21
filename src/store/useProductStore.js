import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useProductStore = create((set, get) => ({
    products: [],
    categories: [],
    authors: [],
    loading: false,
    error: null,

    fetchAll: async () => {
        set({ loading: true, error: null });
        const [{ data: products, error: prodErr }, { data: categories, error: catErr }, { data: authors, error: authErr }] =
            await Promise.all([
                supabase
                    .from('products')
                    .select('*, categories(name_az, name_en, img_url), authors(name, name_az, img_url)')
                    .order('created_at', { ascending: false }),
                supabase.from('categories').select('*').order('created_at', { ascending: false }),
                supabase.from('authors').select('*').order('created_at', { ascending: false }),
            ]);

        const error = prodErr || catErr || authErr;
        if (error) {
            set({ error: error.message, loading: false });
            return;
        }

        set({
            products: products || [],
            categories: categories || [],
            authors: authors || [],
            loading: false,
        });
    },

    addProduct: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('products')
            .insert(payload)
            .select('*, categories(name_az, name_en, img_url), authors(name, name_az, img_url)')
            .single();

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({ products: [data, ...state.products] }));
        return { data };
    },

    updateProduct: async (id, payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', id)
            .select('*, categories(name_az, name_en, img_url), authors(name, name_az, img_url)')
            .single();

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({
            products: state.products.map((p) => (p.id === id ? data : p)),
        }));
        return { data };
    },

    deleteProduct: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({
            products: state.products.filter((p) => p.id !== id),
        }));
        return { success: true };
    },
}));