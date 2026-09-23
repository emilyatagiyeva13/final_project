import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    error: null,

    // customer: { fullName, email, phone, address }
    // items: [{ id (product_id), title_az, title_en, price, quantity, image }]
    // totals: { subtotal, shippingCost, total }
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
                status: 'completed', // sifariş yaradılan kimi review yazmağa icazə versin
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