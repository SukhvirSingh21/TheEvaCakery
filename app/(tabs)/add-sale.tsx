import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Save, Plus, Trash2, Calculator } from 'lucide-react-native';
import { CAKE_FLAVORS, PAYMENT_METHODS } from '@/constants/CakeFlavors';
import { useSales } from '@/hooks/useSales';
import { useAuth } from '@/hooks/useAuth';
import { AuthScreen } from '@/components/AuthScreen';

interface SaleItem {
  id: string;
  item_type: 'Cake' | 'Cupcake';
  flavor: string;
  quantity: string;
  price_per_item: string;
}

export default function AddSaleScreen() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading } = useAuth();
  const { addSale } = useSales();
  
  const [formData, setFormData] = useState({
    sale_date: new Date().toISOString().split('T')[0],
    payment_method: 'Cash' as 'Cash' | 'Bank',
    notes: '',
  });
  
  const [items, setItems] = useState<SaleItem[]>([
    {
      id: '1',
      item_type: 'Cake',
      flavor: '',
      quantity: '',
      price_per_item: '',
    }
  ]);
  
  const [loading, setLoading] = useState(false);

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

  const addItem = () => {
    const newItem: SaleItem = {
      id: Date.now().toString(),
      item_type: 'Cake',
      flavor: '',
      quantity: '',
      price_per_item: '',
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price_per_item) || 0;
      return total + (quantity * price);
    }, 0);
  };

  const validateForm = () => {
    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return false;
    }

    for (const item of items) {
      if (!item.flavor) {
        Alert.alert('Error', 'Please select a flavor for all items');
        return false;
      }
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        Alert.alert('Error', 'Please enter valid quantities for all items');
        return false;
      }
      if (!item.price_per_item || parseFloat(item.price_per_item) <= 0) {
        Alert.alert('Error', 'Please enter valid prices for all items');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const saleItems = items.map(item => ({
        item_type: item.item_type,
        flavor: item.flavor,
        quantity: parseInt(item.quantity),
        price_per_item: parseFloat(item.price_per_item),
      }));

      await addSale({
        sale_date: formData.sale_date,
        payment_method: formData.payment_method,
        notes: formData.notes || undefined,
        items: saleItems,
      });

      // Reset form
      setFormData({
        sale_date: new Date().toISOString().split('T')[0],
        payment_method: 'Cash',
        notes: '',
      });
      setItems([{
        id: '1',
        item_type: 'Cake',
        flavor: '',
        quantity: '',
        price_per_item: '',
      }]);

      Alert.alert('Success', 'Sale recorded successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to record sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Add New Sale</Text>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sale Date</Text>
            <TextInput
              style={styles.input}
              value={formData.sale_date}
              onChangeText={(value) => setFormData(prev => ({ ...prev, sale_date: value }))}
              placeholder="YYYY-MM-DD"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Items</Text>
              <TouchableOpacity style={styles.addButton} onPress={addItem}>
                <Plus color="white" size={16} />
                <Text style={styles.addButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>

            {items.map((item, index) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>Item {index + 1}</Text>
                  {items.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Trash2 color="#F44336" size={16} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Type</Text>
                  <View style={styles.typeButtons}>
                    {['Cake', 'Cupcake'].map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeButton,
                          item.item_type === type && styles.typeButtonActive
                        ]}
                        onPress={() => updateItem(item.id, 'item_type', type as 'Cake' | 'Cupcake')}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          item.item_type === type && styles.typeButtonTextActive
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Flavor *</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={item.flavor}
                      onValueChange={(value) => updateItem(item.id, 'flavor', value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select a flavor..." value="" />
                      {CAKE_FLAVORS.map(flavor => (
                        <Picker.Item key={flavor} label={flavor} value={flavor} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>Quantity *</Text>
                    <TextInput
                      style={styles.input}
                      value={item.quantity}
                      onChangeText={(value) => updateItem(item.id, 'quantity', value)}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>Price Each *</Text>
                    <TextInput
                      style={styles.input}
                      value={item.price_per_item}
                      onChangeText={(value) => updateItem(item.id, 'price_per_item', value)}
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <View style={styles.subtotalContainer}>
                  <Text style={styles.subtotalLabel}>Subtotal:</Text>
                  <Text style={styles.subtotalAmount}>
                    ${((parseFloat(item.quantity) || 0) * (parseFloat(item.price_per_item) || 0)).toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Calculator color="#E91E63" size={20} />
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.paymentMethods}>
              {PAYMENT_METHODS.map(method => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentButton,
                    formData.payment_method === method && styles.paymentButtonActive
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, payment_method: method }))}
                >
                  <Text style={[
                    styles.paymentButtonText,
                    formData.payment_method === method && styles.paymentButtonTextActive
                  ]}>
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={formData.notes}
              onChangeText={(value) => setFormData(prev => ({ ...prev, notes: value }))}
              placeholder="Add any additional notes..."
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Save color="white" size={20} />
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : 'Record Sale'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#E91E63',
    backgroundColor: '#E91E63',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  subtotalLabel: {
    fontSize: 14,
    color: '#666',
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  paymentMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  paymentButtonActive: {
    borderColor: '#E91E63',
    backgroundColor: '#E91E63',
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  paymentButtonTextActive: {
    color: 'white',
  },
  notesInput: {
    height: 80,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#E91E63',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});