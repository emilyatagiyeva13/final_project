import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useFaqStore = create((set) => ({
    faqs: [],
    faqCategories: [],
    loading: false,
    error: null,

    fetchAll: async () => {
        set({ loading: true, error: null });
        const [{ data: faqs, error: faqErr }, { data: faqCategories, error: catErr }] = await Promise.all([
            supabase
                .from('faqs')
                .select('*, faq_categories(title, title_az)')
                .order('sort_order', { ascending: true }),
            supabase.from('faq_categories').select('*').order('sort_order', { ascending: true }),
        ]);

        const error = faqErr || catErr;
        if (error) {
            set({ error: error.message, loading: false });
            return;
        }

        set({ faqs: faqs || [], faqCategories: faqCategories || [], loading: false });
    },

    addFaq: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('faqs')
            .insert(payload)
            .select('*, faq_categories(title, title_az)')
            .single();

        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ faqs: [...state.faqs, data] }));
        return { data };
    },

    updateFaq: async (id, payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('faqs')
            .update(payload)
            .eq('id', id)
            .select('*, faq_categories(title, title_az)')
            .single();

        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ faqs: state.faqs.map((f) => (f.id === id ? data : f)) }));
        return { data };
    },

    deleteFaq: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ faqs: state.faqs.filter((f) => f.id !== id) }));
        return { success: true };
    },

    addFaqCategory: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('faq_categories')
            .insert(payload)
            .select('*')
            .single();

        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ faqCategories: [...state.faqCategories, data] }));
        return { data };
    },

    updateFaqCategory: async (id, payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('faq_categories')
            .update(payload)
            .eq('id', id)
            .select('*')
            .single();

        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ faqCategories: state.faqCategories.map((c) => (c.id === id ? data : c)) }));
        return { data };
    },

    deleteFaqCategory: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('faq_categories').delete().eq('id', id);
        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ faqCategories: state.faqCategories.filter((c) => c.id !== id) }));
        return { success: true };
    },
}));