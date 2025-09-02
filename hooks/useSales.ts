import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sale, SaleItem, SaleFilters } from '@/types/Sale';
import { useAuth } from '@/hooks/useAuth';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSales(filters?: SaleFilters) {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    if (user) {
      const now = Date.now();
      if (now - lastFetch < 1000) {
        return;
      }
      fetchSales();
    }
  }, [debouncedFilters, user]);

  const fetchSales = async () => {
    try {
      const now = Date.now();
      if (now - lastFetch < 1000) {
        return;
      }
      setLastFetch(now);
      
      setLoading(true);
      
      if (!supabase || !user) {
        setSales([]);
        setError(null);
        return;
      }
      
      let query = supabase
        .from('sales')
        .select(`
          *,
          sale_items (*)
        `)
        .eq('user_id', user.id)
        .order('sale_date', { ascending: false });

      if (debouncedFilters?.month && debouncedFilters?.year) {
        const startDate = `${debouncedFilters.year}-${debouncedFilters.month.padStart(2, '0')}-01`;
        const endDate = `${debouncedFilters.year}-${debouncedFilters.month.padStart(2, '0')}-31`;
        query = query.gte('sale_date', startDate).lte('sale_date', endDate);
      } else if (debouncedFilters?.year) {
        query = query.gte('sale_date', `${debouncedFilters.year}-01-01`).lte('sale_date', `${debouncedFilters.year}-12-31`);
      }

      if (debouncedFilters?.date) {
        query = query.eq('sale_date', debouncedFilters.date);
      }

      if (debouncedFilters?.paymentMethod) {
        query = query.eq('payment_method', debouncedFilters.paymentMethod);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      let filteredData = data || [];
      
      // Filter by flavor or item type if specified
      if (debouncedFilters?.flavor || debouncedFilters?.itemType) {
        filteredData = filteredData.filter(sale => 
          sale.sale_items?.some((item: SaleItem) => {
            const flavorMatch = !debouncedFilters.flavor || item.flavor === debouncedFilters.flavor;
            const typeMatch = !debouncedFilters.itemType || item.item_type === debouncedFilters.itemType;
            return flavorMatch && typeMatch;
          })
        );
      }
      
      setSales(filteredData);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('rate-limited') || errorMessage.includes('rate limit')) {
        setError('Too many requests. Please wait a moment and try again.');
        setTimeout(() => {
          fetchSales();
        }, 3000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (saleData: {
    sale_date: string;
    payment_method: 'Cash' | 'Bank';
    notes?: string;
    items: [
      {
        item_type: 'Cake' | 'Cupcake',
        flavor: string,
        quantity: number
        price_per_item: number,
      }
    ]
  }) => {
    try {
      if (!supabase || !user) {
        throw new Error('Database not configured or user not authenticated');
      }

      // Calculate total amount
      const total_amount = saleData.items.reduce(
        (sum, item) => sum + (item.quantity * item.price_per_item), 
        0
      );
      console.log('test user id ', 'c44975c3-8fa8-4419-b8e6-c2b189e5fca8' === user.id)

      // Insert sale
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert([
          {
            user_id: user.id,
            sale_date: saleData.sale_date,
            payment_method: saleData.payment_method,
            notes: saleData.notes,
            total_amount
          }
        ])
        .select()
        .single();

      if (saleError) throw saleError;

      // Insert sale items
      const saleItems = saleData.items.map(item => ({
        sale_id: sale.id,
        item_type: item.item_type,
        flavor: item.flavor,
        quantity: item.quantity,
        price_per_item: item.price_per_item
      }));

      const { data: items, error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems)
        .select();

      if (itemsError) throw itemsError;

      const newSale = { ...sale, sale_items: items };
      setSales(prev => [newSale, ...prev]);
      return newSale;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add sale';
      
      if (errorMessage.includes('rate-limited') || errorMessage.includes('rate limit')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(errorMessage);
      }
      throw err;
    }
  };

  return {
    sales,
    loading,
    error,
    addSale,
    refetch: fetchSales,
  };
}