import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useAuthorStore = create((set) => ({
    authors: [],
    loading: false,
    error: null,

    fetchAuthors: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from('authors')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return;
        }

        set({ authors: data || [], loading: false });
    },

    addAuthor: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('authors')
            .insert(payload)
            .select('*')
            .single();

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({ authors: [data, ...state.authors] }));
        return { data };
    },

    updateAuthor: async (id, payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('authors')
            .update(payload)
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({
            authors: state.authors.map((a) => (a.id === id ? data : a)),
        }));
        return { data };
    },

    deleteAuthor: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('authors').delete().eq('id', id);

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({
            authors: state.authors.filter((a) => a.id !== id),
        }));
        return { success: true };
    },
}));