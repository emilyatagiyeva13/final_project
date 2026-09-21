import { create } from 'zustand';
import { supabase } from '../supabaseClient.js';

export const useCustomerStore = create((set) => ({
    customers: [],
    loading: false,
    error: null,

    fetchCustomers: async () => {
        set({ loading: true, error: null });
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('role', 'admin')
            .order('created_at', { ascending: false });

        if (error) {
            set({ error: error.message, loading: false });
            return;
        }

        set({ customers: data || [], loading: false });
    },
}));