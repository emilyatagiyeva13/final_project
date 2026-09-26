import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useCatalogStore = create((set, get) => ({
    products: [],
    categories: [],
    authors: [],
    orders: [],
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

    fetchProducts: async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name_az, name_en, img_url), authors(name, name_az, img_url)')
            .order('created_at', { ascending: false });
        if (error) { set({ error: error.message }); return; }
        set({ products: data || [] });
    },

    addProduct: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('products')
            .insert(payload)
            .select('*, categories(name_az, name_en, img_url), authors(name, name_az, img_url)')
            .single();
        if (error) { set({ error: error.message }); return { error }; }
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
        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ products: state.products.map((p) => (p.id === id ? data : p)) }));
        return { data };
    },

    deleteProduct: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        return { success: true };
    },

    // ---------- categories ----------
    fetchCategories: async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) { set({ error: error.message }); return; }
        set({ categories: data || [] });
    },

    addCategory: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('categories')
            .insert(payload)
            .select('*')
            .single();
        if (error) { set({ error: error.message }); return { error }; }
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
        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ categories: state.categories.map((c) => (c.id === id ? data : c)) }));
        return { data };
    },

    deleteCategory: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
        return { success: true };
    },

    // ---------- authors ----------
    fetchAuthors: async () => {
        const { data, error } = await supabase
            .from('authors')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) { set({ error: error.message }); return; }
        set({ authors: data || [] });
    },

    addAuthor: async (payload) => {
        set({ error: null });
        const { data, error } = await supabase
            .from('authors')
            .insert(payload)
            .select('*')
            .single();
        if (error) { set({ error: error.message }); return { error }; }
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
        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ authors: state.authors.map((a) => (a.id === id ? data : a)) }));
        return { data };
    },

    deleteAuthor: async (id) => {
        set({ error: null });
        const { error } = await supabase.from('authors').delete().eq('id', id);
        if (error) { set({ error: error.message }); return { error }; }
        set((state) => ({ authors: state.authors.filter((a) => a.id !== id) }));
        return { success: true };
    },

    confirmOrder: async (userId, customer, items, totals) => {
        set({ error: null });

        if (!userId) {
            const err = 'İstifadəçi daxil olmayıb';
            set({ error: err });
            return { error: err };
        }
        if (!items?.length) {
            const err = 'Səbət boşdur';
            set({ error: err });
            return { error: err };
        }

        const { data: order, error: orderErr } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                full_name: customer.fullName,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                subtotal: totals.subtotal,
                shipping_cost: totals.shippingCost,
                total: totals.total,
                status: 'confirmed',
            })
            .select('*')
            .single();

        if (orderErr) {
            set({ error: orderErr.message });
            return { error: orderErr };
        }

        const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            title_az: item.title_az,
            title_en: item.title_en,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image,
        }));

        const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);

        if (itemsErr) {
            set({ error: itemsErr.message });
            return { error: itemsErr };
        }

        set((state) => ({ orders: [order, ...state.orders] }));
        return { data: order };
    },

    fetchOrders: async (userId) => {
        set({ loading: true, error: null });
        let query = supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });

        if (userId) query = query.eq('user_id', userId);

        const { data, error } = await query;
        if (error) { set({ error: error.message, loading: false }); return; }
        set({ orders: data || [], loading: false });
    },
}));