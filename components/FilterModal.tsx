import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X, Filter } from 'lucide-react-native';
import { CAKE_FLAVORS, PAYMENT_METHODS, EXPENSE_CATEGORIES } from '@/constants/CakeFlavors';
import { SaleFilters, ExpenseFilters } from '@/types/Sale';
import { Picker } from '@react-native-picker/picker';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: SaleFilters | ExpenseFilters;
  onApplyFilters: (filters: SaleFilters | ExpenseFilters) => void;
  filterType: 'sales' | 'expenses';
}

export function FilterModal({ visible, onClose, filters, onApplyFilters, filterType }: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<SaleFilters | ExpenseFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {};
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Sales</Text>
          <TouchableOpacity onPress={onClose}>
            <X color="#666" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time Period</Text>
            
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Year</Text>
              <Picker
                selectedValue={localFilters.year}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, year: value }))}
                style={styles.picker}
              >
                <Picker.Item label="All Years" value="" />
                {years.map(year => (
                  <Picker.Item key={year} label={year.toString()} value={year.toString()} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Month</Text>
              <Picker
                selectedValue={localFilters.month}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, month: value }))}
                style={styles.picker}
              >
                <Picker.Item label="All Months" value="" />
                {months.map(month => (
                  <Picker.Item 
                    key={month} 
                    label={new Date(2024, month - 1).toLocaleDateString('en-US', { month: 'long' })}
                    value={month.toString()} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {filterType === 'sales' ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Item Type</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={(localFilters as SaleFilters).itemType}
                    onValueChange={(value) => setLocalFilters(prev => ({ ...prev, itemType: value }))}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Types" value="" />
                    <Picker.Item label="Cakes" value="Cake" />
                    <Picker.Item label="Cupcakes" value="Cupcake" />
                  </Picker>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Flavor</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={(localFilters as SaleFilters).flavor}
                    onValueChange={(value) => setLocalFilters(prev => ({ ...prev, flavor: value }))}
                    style={styles.picker}
                  >
                    <Picker.Item label="All Flavors" value="" />
                    {CAKE_FLAVORS.map(flavor => (
                      <Picker.Item key={flavor} label={flavor} value={flavor} />
                    ))}
                  </Picker>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={(localFilters as ExpenseFilters).category}
                  onValueChange={(value) => setLocalFilters(prev => ({ ...prev, category: value }))}
                  style={styles.picker}
                >
                  <Picker.Item label="All Categories" value="" />
                  {EXPENSE_CATEGORIES.map(category => (
                    <Picker.Item key={category} label={category} value={category} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={(localFilters as any).paymentMethod}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, paymentMethod: value }))}
                style={styles.picker}
              >
                <Picker.Item label="All Payment Methods" value="" />
                {PAYMENT_METHODS.map(method => (
                  <Picker.Item key={method} label={method} value={method} />
                ))}
              </Picker>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Filter color="white" size={16} />
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  picker: {
    height: 50,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#E91E63',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});