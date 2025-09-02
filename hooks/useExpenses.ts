import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Expense, ExpenseFilters } from '@/types/Sale';
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

export function useExpenses(filters?: ExpenseFilters) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
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
      fetchExpenses();
    }
  }, [debouncedFilters, user]);

  const fetchExpenses = async () => {
    try {
      const now = Date.now();
      if (now - lastFetch < 1000) {
        return;
      }
      setLastFetch(now);
      
      setLoading(true);
      
      if (!supabase || !user) {
        setExpenses([]);
        setError(null);
        return;
      }
      
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false });

      if (debouncedFilters?.month && debouncedFilters?.year) {
        const startDate = `${debouncedFilters.year}-${debouncedFilters.month.padStart(2, '0')}-01`;
        const endDate = `${debouncedFilters.year}-${debouncedFilters.month.padStart(2, '0')}-31`;
        query = query.gte('expense_date', startDate).lte('expense_date', endDate);
      } else if (debouncedFilters?.year) {
        query = query.gte('expense_date', `${debouncedFilters.year}-01-01`).lte('expense_date', `${debouncedFilters.year}-12-31`);
      }

      if (debouncedFilters?.date) {
        query = query.eq('expense_date', debouncedFilters.date);
      }

      if (debouncedFilters?.paymentMethod) {
        query = query.eq('payment_method', debouncedFilters.paymentMethod);
      }

      if (debouncedFilters?.category) {
        query = query.eq('category', debouncedFilters.category);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setExpenses(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('rate-limited') || errorMessage.includes('rate limit')) {
        setError('Too many requests. Please wait a moment and try again.');
        setTimeout(() => {
          fetchExpenses();
        }, 3000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: {
    expense_date: string;
    description: string;
    amount: number;
    payment_method: 'Cash' | 'Bank';
    category: string;
    notes?: string;
  }) => {
    try {
      if (!supabase || !user) {
        throw new Error('Database not configured or user not authenticated');
      }

      const { data: expense, error } = await supabase
        .from('expenses')
        .insert([
          {
            user_id: user.id,
            expense_date: expenseData.expense_date,
            description: expenseData.description,
            amount: expenseData.amount,
            payment_method: expenseData.payment_method,
            category: expenseData.category,
            notes: expenseData.notes,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [expense, ...prev]);
      return expense;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add expense';
      
      if (errorMessage.includes('rate-limited') || errorMessage.includes('rate limit')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(errorMessage);
      }
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    refetch: fetchExpenses,
  };
}