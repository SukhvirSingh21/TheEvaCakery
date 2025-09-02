import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Expense } from '@/types/Sale';
import { Calendar, DollarSign, CreditCard, Tag } from 'lucide-react-native';

interface ExpenseCardProps {
  expense: Expense;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.description}>{expense.description}</Text>
          <View style={styles.detailRow}>
            <Calendar color="#666" size={14} />
            <Text style={styles.detailText}>{formatDate(expense.expense_date)}</Text>
          </View>
        </View>
        <View style={[
          styles.paymentBadge,
          { backgroundColor: expense.payment_method === 'Cash' ? '#F44336' : '#FF9800' }
        ]}>
          <CreditCard color="white" size={12} />
          <Text style={styles.paymentText}>{expense.payment_method}</Text>
        </View>
      </View>
      
      <View style={styles.categoryRow}>
        <Tag color="#666" size={14} />
        <Text style={styles.categoryText}>{expense.category}</Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.amountRow}>
          <DollarSign color="#F44336" size={16} />
          <Text style={styles.amountLabel}>Amount:</Text>
          <Text style={styles.amountValue}>-${expense.amount.toFixed(2)}</Text>
        </View>
        
        {expense.notes && (
          <Text style={styles.notes}>{expense.notes}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  paymentText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  amountLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  notes: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});