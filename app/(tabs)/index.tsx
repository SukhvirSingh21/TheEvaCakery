import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Plus, TrendingUp, DollarSign, Calendar, CreditCard } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useSales } from '@/hooks/useSales';
import { useExpenses } from '@/hooks/useExpenses';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SaleCard } from '@/components/SaleCard';
import { ExpenseCard } from '@/components/ExpenseCard';
import { StatCard } from '@/components/StatCard';
import { FilterModal } from '@/components/FilterModal';
import { AuthScreen } from '@/components/AuthScreen';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { sales, loading: salesLoading, refreshSales } = useSales();
  const { expenses, loading: expensesLoading, refreshExpenses } = useExpenses();
  const { analytics, loading: analyticsLoading, refreshAnalytics } = useAnalytics();
  
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses'>('sales');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [salesFilters, setSalesFilters] = useState({});
  const [expenseFilters, setExpenseFilters] = useState({});



  // Show auth screen if user is not logged in
  if (!user) {
    return <AuthScreen />;
  }

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshSales(),
        refreshExpenses(),
        refreshAnalytics()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const loading = salesLoading || expensesLoading || analyticsLoading;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cake Bakery</Text>
          <Text style={styles.headerSubtitle}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Financial Overview */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Gross Income"
            value={formatCurrency(analytics?.totalEarnings || 0)}
            icon={TrendingUp}
            subtitle={`Total Revenue`}
          />
          <StatCard
            title="Net Income"
            value={formatCurrency(analytics?.netIncome || 0)}
            icon={DollarSign}
            color={analytics?.netIncome && analytics.netIncome >= 0 ? "#4CAF50" : "#F44336"}
            subtitle={`${analytics?.netIncome && analytics.netIncome >= 0 ? 'Profit' : 'Loss'} after expenses`}
          />
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Cash Flow"
            value={formatCurrency(analytics?.netCashFlow || 0)}
            icon={DollarSign}
            subtitle="Net Cash"
          />
          <StatCard
            title="Bank Flow"
            value={formatCurrency(analytics?.netBankFlow || 0)}
            icon={CreditCard}
            subtitle="Net Bank"
          />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sales' && styles.activeTab]}
            onPress={() => setActiveTab('sales')}
          >
            <Text style={[styles.tabText, activeTab === 'sales' && styles.activeTabText]}>
              Sales ({sales.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'expenses' && styles.activeTab]}
            onPress={() => setActiveTab('expenses')}
          >
            <Text style={[styles.tabText, activeTab === 'expenses' && styles.activeTabText]}>
              Expenses ({expenses.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Button */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={16} color="#6b7280" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {activeTab === 'sales' ? (
              sales.length > 0 ? (
                sales.map((sale) => (
                  <SaleCard key={sale.id} sale={sale} />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Plus size={48} color="#d1d5db" />
                  <Text style={styles.emptyStateText}>No sales yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Add your first sale to get started
                  </Text>
                </View>
              )
            ) : (
              expenses.length > 0 ? (
                expenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Plus size={48} color="#d1d5db" />
                  <Text style={styles.emptyStateText}>No expenses yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Add your first expense to track costs
                  </Text>
                </View>
              )
            )}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        type={activeTab}
        filters={activeTab === 'sales' ? salesFilters : expenseFilters}
        onApplyFilters={activeTab === 'sales' ? setSalesFilters : setExpenseFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ef4444',
    borderRadius: 8,
  },
  signOutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignSelf: 'flex-start',
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});