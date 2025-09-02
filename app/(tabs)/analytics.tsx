import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { TrendingUp, Award, DollarSign, ChartPie as PieChart, Filter } from 'lucide-react-native';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { StatCard } from '@/components/StatCard';
import { FilterModal } from '@/components/FilterModal';
import { AuthScreen } from '@/components/AuthScreen';
import { SaleFilters, ExpenseFilters } from '@/types/Sale';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading } = useAuth();
  const { analytics, loading, refetch } = useAnalytics();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<SaleFilters>({});

  if (authLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!analytics) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter color="#666" size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Loading analytics...</Text>
        </View>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#E91E63',
    },
  };

  const monthlyEarningsData = {
    labels: analytics.monthlyTrends.slice(-6).map(trend => 
      new Date(trend.month + '-01').toLocaleDateString('en-US', { month: 'short' })
    ),
    datasets: [{
      data: analytics.monthlyTrends.slice(-6).map(trend => trend.earnings),
    }],
  };

  const monthlySalesData = {
    labels: analytics.monthlyTrends.slice(-6).map(trend => 
      new Date(trend.month + '-01').toLocaleDateString('en-US', { month: 'short' })
    ),
    datasets: [{
      data: analytics.monthlyTrends.slice(-6).map(trend => trend.sales),
    }],
  };

  const topFlavorsData = {
    labels: analytics.popularFlavors.slice(0, 5).map(flavor => 
      `${flavor.flavor.length > 8 ? flavor.flavor.substring(0, 8) + '...' : flavor.flavor} (${flavor.itemType})`
    ),
    datasets: [{
      data: analytics.popularFlavors.slice(0, 5).map(flavor => flavor.count),
    }],
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
      >
        <View style={styles.statsSection}>
          <StatCard
            title="Gross Revenue"
            value={formatCurrency(analytics.totalEarnings)}
            icon={DollarSign}
            subtitle={`Expenses: ${formatCurrency(analytics.totalExpenses)}`}
          />
          
          <StatCard
            title="Net Income"
            value={formatCurrency(analytics.netIncome)}
            icon={TrendingUp}
            color={analytics.netIncome >= 0 ? "#4CAF50" : "#F44336"}
            subtitle={`${analytics.netIncome >= 0 ? 'Profit' : 'Loss'} after expenses`}
          />
          
          <View style={styles.row}>
            <View style={styles.halfCard}>
              <StatCard
                title="Cakes Sold"
                value={analytics.totalCakesSold}
                icon={Award}
              />
            </View>
            <View style={styles.halfCard}>
              <StatCard
                title="Cupcakes Sold"
                value={analytics.totalCupcakesSold}
                icon={Award}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfCard}>
              <StatCard
                title="Net Cash Flow"
                value={formatCurrency(analytics.netCashFlow)}
                icon={DollarSign}
                color={analytics.netCashFlow >= 0 ? "#4CAF50" : "#F44336"}
                subtitle={`${formatCurrency(analytics.cashEarnings)} - ${formatCurrency(analytics.cashExpenses)}`}
              />
            </View>
            <View style={styles.halfCard}>
              <StatCard
                title="Net Bank Flow"
                value={formatCurrency(analytics.netBankFlow)}
                icon={DollarSign}
                color={analytics.netBankFlow >= 0 ? "#2196F3" : "#F44336"}
                subtitle={`${formatCurrency(analytics.bankEarnings)} - ${formatCurrency(analytics.bankExpenses)}`}
              />
            </View>
          </View>
        </View>

        {analytics.monthlyTrends.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Monthly Earnings Trend</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={monthlyEarningsData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisPrefix="$"
              />
            </View>
          </View>
        )}

        {analytics.monthlyTrends.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Monthly Sales Volume</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={monthlySalesData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisSuffix=" items"
              />
            </View>
          </View>
        )}

        {analytics.popularFlavors.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Top 5 Popular Items</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={topFlavorsData}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisSuffix=" sold"
                showValuesOnTopOfBars
              />
            </View>
          </View>
        )}

        {analytics.expensesByCategory.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Expenses by Category</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: analytics.expensesByCategory.slice(0, 5).map(cat => 
                    cat.category.length > 8 ? cat.category.substring(0, 8) + '...' : cat.category
                  ),
                  datasets: [{
                    data: analytics.expensesByCategory.slice(0, 5).map(cat => cat.amount),
                  }],
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                yAxisPrefix="$"
                showValuesOnTopOfBars
              />
            </View>
          </View>
        )}

        {analytics.monthlyExpenseTrends.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Monthly Net Income Trend</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: analytics.monthlyExpenseTrends.slice(-6).map(trend => 
                    new Date(trend.month + '-01').toLocaleDateString('en-US', { month: 'short' })
                  ),
                  datasets: [{
                    data: analytics.monthlyExpenseTrends.slice(-6).map(trend => trend.netIncome),
                  }],
                }}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisPrefix="$"
              />
            </View>
          </View>
        )}

        <View style={styles.flavorStats}>
          <Text style={styles.sectionTitle}>Item Performance</Text>
          {analytics.popularFlavors.map((flavor, index) => (
            <View key={`${flavor.flavor}-${flavor.itemType}`} style={styles.flavorCard}>
              <View style={styles.flavorRank}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
              <View style={styles.flavorInfo}>
                <Text style={styles.flavorName}>{flavor.flavor}</Text>
                <Text style={styles.flavorStats}>
                  {flavor.itemType} • {flavor.count} sold • {formatCurrency(flavor.earnings)}
                </Text>
              </View>
              <View style={styles.flavorEarnings}>
                <Text style={styles.earningsAmount}>
                  {formatCurrency(flavor.earnings)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {analytics.itemTypeBreakdown.length > 0 && (
          <View style={styles.breakdownSection}>
            <Text style={styles.sectionTitle}>Item Type Breakdown</Text>
            {analytics.itemTypeBreakdown.map((item) => (
              <View key={item.itemType} style={styles.breakdownCard}>
                <Text style={styles.breakdownType}>{item.itemType}s</Text>
                <View style={styles.breakdownStats}>
                  <Text style={styles.breakdownCount}>{item.count} sold</Text>
                  <Text style={styles.breakdownEarnings}>
                    {formatCurrency(item.earnings)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {analytics.expensesByCategory.length > 0 && (
          <View style={styles.expenseStats}>
            <Text style={styles.sectionTitle}>Expense Categories</Text>
            {analytics.expensesByCategory.map((category, index) => (
              <View key={category.category} style={styles.categoryCard}>
                <View style={styles.categoryRank}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.category}</Text>
                  <Text style={styles.categoryStats}>
                    Total spent: {formatCurrency(category.amount)}
                  </Text>
                </View>
                <View style={styles.categoryAmount}>
                  <Text style={styles.expenseAmount}>
                    -{formatCurrency(category.amount)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={setFilters}
        filterType="sales"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
  },
  statsSection: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  flavorStats: {
    marginBottom: 24,
  },
  flavorCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flavorRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  flavorInfo: {
    flex: 1,
  },
  flavorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  flavorStats: {
    fontSize: 14,
    color: '#666',
  },
  flavorEarnings: {
    alignItems: 'flex-end',
  },
  earningsAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expenseStats: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryStats: {
    fontSize: 14,
    color: '#666',
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
  breakdownSection: {
    marginBottom: 24,
  },
  breakdownCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  breakdownStats: {
    alignItems: 'flex-end',
  },
  breakdownCount: {
    fontSize: 14,
    color: '#666',
  },
  breakdownEarnings: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});