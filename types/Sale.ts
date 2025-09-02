export interface SaleItem {
  id: string;
  sale_id: string;
  item_type: 'Cake' | 'Cupcake';
  flavor: string;
  quantity: number;
  price_per_item: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  user_id: string;
  created_at: string;
  sale_date: string;
  total_amount: number;
  payment_method: 'Cash' | 'Bank';
  notes?: string;
  sale_items?: SaleItem[];
}

export interface SaleFilters {
  month?: string;
  year?: string;
  date?: string;
  flavor?: string;
  paymentMethod?: string;
  itemType?: string;
}

export interface Analytics {
  totalEarnings: number;
  totalItemsSold: number;
  totalCakesSold: number;
  totalCupcakesSold: number;
  cashEarnings: number;
  bankEarnings: number;
  popularFlavors: { flavor: string; count: number; earnings: number; itemType: string }[];
  monthlyTrends: { month: string; earnings: number; sales: number }[];
  itemTypeBreakdown: { itemType: string; count: number; earnings: number }[];
}

export interface Expense {
  id: string;
  user_id: string;
  created_at: string;
  expense_date: string;
  description: string;
  amount: number;
  payment_method: 'Cash' | 'Bank';
  category: string;
  notes?: string;
}

export interface ExpenseFilters {
  month?: string;
  year?: string;
  date?: string;
  category?: string;
  paymentMethod?: string;
}

export interface EnhancedAnalytics extends Analytics {
  totalExpenses: number;
  netIncome: number;
  cashExpenses: number;
  bankExpenses: number;
  netCashFlow: number;
  netBankFlow: number;
  expensesByCategory: { category: string; amount: number }[];
  monthlyExpenseTrends: { month: string; expenses: number; netIncome: number }[];
}