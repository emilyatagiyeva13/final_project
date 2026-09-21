import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useBlogStore = create((set) => ({
    posts: [],
    loading: false,
    error: null,

    fetchPosts: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from('blog_cards')
            .select('*')
            .order('post_date', { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return;
        }

        set({ posts: data || [], loading: false });
    },

    addPost: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('blog_cards')
            .insert(payload)
            .select('*')
            .single();

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({ posts: [data, ...state.posts] }));
        return { data };
    },

    updatePost: async (id, payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('blog_cards')
            .update(payload)
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({
            posts: state.posts.map((p) => (p.id === id ? data : p)),
        }));
        return { data };
    },

    deletePost: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('blog_cards').delete().eq('id', id);

        if (error) {
            set({ error: error.message });
            return { error };
        }

        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) }));
        return { success: true };
    },
}));