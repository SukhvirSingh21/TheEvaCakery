import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sale, SaleItem } from '@/types/Sale';
import { Calendar, ShoppingBag, DollarSign, CreditCard } from 'lucide-react-native';

interface SaleCardProps {
  sale: Sale;
}

export function SaleCard({ sale }: SaleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const groupItemsByType = (items: SaleItem[]) => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.item_type]) {
        acc[item.item_type] = [];
      }
      acc[item.item_type].push(item);
      return acc;
    }, {} as Record<string, SaleItem[]>);
    
    return grouped;
  };

  const items = sale.sale_items || [];
  const groupedItems = groupItemsByType(items);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.saleId}>Sale #{sale.id.slice(-8)}</Text>
          <View style={styles.detailRow}>
            <Calendar color="#666" size={14} />
            <Text style={styles.detailText}>{formatDate(sale.sale_date)}</Text>
          </View>
        </View>
        <View style={[
          styles.paymentBadge,
          { backgroundColor: sale.payment_method === 'Cash' ? '#4CAF50' : '#2196F3' }
        ]}>
          <CreditCard color="white" size={12} />
          <Text style={styles.paymentText}>{sale.payment_method}</Text>
        </View>
      </View>
      
      <View style={styles.itemsSection}>
        {Object.entries(groupedItems).map(([itemType, typeItems]) => (
          <View key={itemType} style={styles.itemTypeGroup}>
            <Text style={styles.itemTypeTitle}>{itemType}s:</Text>
            {typeItems.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemText}>
                  {item.quantity}x {item.flavor} @ ${item.price_per_item}
                </Text>
                <Text style={styles.itemSubtotal}>
                  ${item.subtotal.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <DollarSign color="#E91E63" size={16} />
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${sale.total_amount.toFixed(2)}</Text>
        </View>
        
        {sale.notes && (
          <Text style={styles.notes}>{sale.notes}</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  saleId: {
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
  itemsSection: {
    marginBottom: 12,
  },
  itemTypeGroup: {
    marginBottom: 8,
  },
  itemTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12,
    marginBottom: 2,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  totalLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  notes: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});