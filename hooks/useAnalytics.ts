import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { EnhancedAnalytics, SaleItem } from '@/types/Sale';
import { useAuth } from '@/hooks/useAuth';

export function useAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<EnhancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  useEffect(() => {
    if (user) {
      const now = Date.now();
      if (now - lastFetch < 2000) {
        return;
      }
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const now = Date.now();
      if (now - lastFetch < 2000) {
        return;
      }
      setLastFetch(now);
      
      setLoading(true);
      
      if (!supabase || !user) {
        setAnalytics({
          totalEarnings: 0,
          totalItemsSold: 0,
          totalCakesSold: 0,
          totalCupcakesSold: 0,
          cashEarnings: 0,
          bankEarnings: 0,
          popularFlavors: [],
          monthlyTrends: [],
          itemTypeBreakdown: [],
          totalExpenses: 0,
          netIncome: 0,
          cashExpenses: 0,
          bankExpenses: 0,
          netCashFlow: 0,
          netBankFlow: 0,
          expensesByCategory: [],
          monthlyExpenseTrends: [],
        });
        setError(null);
        return;
      }
      
      // Fetch sales data
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (*)
        `)
        .eq('user_id', user.id);

      if (salesError) throw salesError;

      // Fetch expenses data
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);

      if (expensesError) throw expensesError;

      if (!sales && !expenses) {
        setAnalytics({
          totalEarnings: 0,
          totalItemsSold: 0,
          totalCakesSold: 0,
          totalCupcakesSold: 0,
          cashEarnings: 0,
          bankEarnings: 0,
          popularFlavors: [],
          monthlyTrends: [],
          itemTypeBreakdown: [],
          totalExpenses: 0,
          netIncome: 0,
          cashExpenses: 0,
          bankExpenses: 0,
          netCashFlow: 0,
          netBankFlow: 0,
          expensesByCategory: [],
          monthlyExpenseTrends: [],
        });
        return;
      }

      // Calculate sales analytics
      const totalEarnings = (sales || []).reduce((sum, sale) => sum + sale.total_amount, 0);
      const cashEarnings = (sales || [])
        .filter(sale => sale.payment_method === 'Cash')
        .reduce((sum, sale) => sum + sale.total_amount, 0);
      const bankEarnings = (sales || [])
        .filter(sale => sale.payment_method === 'Bank')
        .reduce((sum, sale) => sum + sale.total_amount, 0);

      // Calculate expense analytics
      const totalExpenses = (expenses || []).reduce((sum, expense) => sum + expense.amount, 0);
      const cashExpenses = (expenses || [])
        .filter(expense => expense.payment_method === 'Cash')
        .reduce((sum, expense) => sum + expense.amount, 0);
      const bankExpenses = (expenses || [])
        .filter(expense => expense.payment_method === 'Bank')
        .reduce((sum, expense) => sum + expense.amount, 0);

      // Calculate net values
      const netIncome = totalEarnings - totalExpenses;
      const netCashFlow = cashEarnings - cashExpenses;
      const netBankFlow = bankEarnings - bankExpenses;

      // Calculate item statistics
      const allItems = (sales || []).flatMap(sale => sale.sale_items || []);
      const totalItemsSold = allItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalCakesSold = allItems
        .filter(item => item.item_type === 'Cake')
        .reduce((sum, item) => sum + item.quantity, 0);
      const totalCupcakesSold = allItems
        .filter(item => item.item_type === 'Cupcake')
        .reduce((sum, item) => sum + item.quantity, 0);

      // Popular flavors with item type
      const flavorStats = allItems.reduce((acc, item) => {
        const key = `${item.flavor}-${item.item_type}`;
        if (!acc[key]) {
          acc[key] = { 
            flavor: item.flavor, 
            itemType: item.item_type,
            count: 0, 
            earnings: 0 
          };
        }
        acc[key].count += item.quantity;
        acc[key].earnings += item.subtotal;
        return acc;
      }, {} as Record<string, { flavor: string; itemType: string; count: number; earnings: number }>);

      const popularFlavors = Object.values(flavorStats)
        .sort((a, b) => b.count - a.count);

      // Item type breakdown
      const itemTypeStats = allItems.reduce((acc, item) => {
        if (!acc[item.item_type]) {
          acc[item.item_type] = { count: 0, earnings: 0 };
        }
        acc[item.item_type].count += item.quantity;
        acc[item.item_type].earnings += item.subtotal;
        return acc;
      }, {} as Record<string, { count: number; earnings: number }>);

      const itemTypeBreakdown = Object.entries(itemTypeStats)
        .map(([itemType, stats]) => ({
          itemType,
          count: stats.count,
          earnings: stats.earnings,
        }));

      // Expenses by category
      const categoryStats = (expenses || []).reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.amount;
        return acc;
      }, {} as Record<string, number>);

      const expensesByCategory = Object.entries(categoryStats)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);

      // Monthly trends including expenses
      const monthlyStats = (sales || []).reduce((acc, sale) => {
        const monthKey = sale.sale_date.substring(0, 7);
        if (!acc[monthKey]) {
          acc[monthKey] = { earnings: 0, sales: 0, expenses: 0 };
        }
        acc[monthKey].earnings += sale.total_amount;
        acc[monthKey].sales += (sale.sale_items || []).reduce((sum, item) => sum + item.quantity, 0);
        return acc;
      }, {} as Record<string, { earnings: number; sales: number; expenses: number }>);

      // Add expenses to monthly stats
      (expenses || []).forEach(expense => {
        const monthKey = expense.expense_date.substring(0, 7);
        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = { earnings: 0, sales: 0, expenses: 0 };
        }
        monthlyStats[monthKey].expenses += expense.amount;
      });

      const monthlyTrends = Object.entries(monthlyStats)
        .map(([month, stats]) => ({
          month,
          earnings: stats.earnings,
          sales: stats.sales,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      const monthlyExpenseTrends = Object.entries(monthlyStats)
        .map(([month, stats]) => ({
          month,
          expenses: stats.expenses,
          netIncome: stats.earnings - stats.expenses,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      setAnalytics({
        totalEarnings,
        totalItemsSold,
        totalCakesSold,
        totalCupcakesSold,
        cashEarnings,
        bankEarnings,
        popularFlavors,
        monthlyTrends,
        itemTypeBreakdown,
        totalExpenses,
        netIncome,
        cashExpenses,
        bankExpenses,
        netCashFlow,
        netBankFlow,
        expensesByCategory,
        monthlyExpenseTrends,
      });
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analytics';
      
      if (errorMessage.includes('rate-limited') || errorMessage.includes('rate limit')) {
        setError('Too many requests. Please wait a moment and try again.');
        setTimeout(() => {
          fetchAnalytics();
        }, 5000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}