import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return;
        }

        set({ categories: data || [], loading: false });
    },

    addCategory: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('categories')
            .insert(payload)
            .select('*')
            .single();

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({ categories: [data, ...state.categories] }));
        return { data };
    },

    updateCategory: async (id, payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('categories')
            .update(payload)
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? data : c)),
        }));
        return { data };
    },

    deleteCategory: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('categories').delete().eq('id', id);

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
        }));
        return { success: true };
    },
}));