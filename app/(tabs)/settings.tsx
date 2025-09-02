import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Database, CircleHelp as HelpCircle, FileText, Mail, ExternalLink, Info, Coffee, LogOut, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { AuthScreen } from '@/components/AuthScreen';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading, signOut } = useAuth();

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

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Data export feature coming soon! This will allow you to export your sales data to CSV format.',
      [{ text: 'OK' }]
    );
  };

  const handleSupport = () => {
    const subject = 'Cake Bakery Tracker - Support Request';
    const body = 'Hi! I need help with the Cake Bakery Tracker app.\n\nIssue:\n\n';
    const mailtoUrl = `mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Error', 'Could not open email client');
    });
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true,
    color = '#E91E63'
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: `${color}20` }]}>
        <Icon color={color} size={20} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <ExternalLink color="#ccc" size={16} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon={User}
            title="Account Information"
            subtitle={user.email}
            showArrow={false}
            color="#2196F3"
          />
          <SettingItem
            icon={LogOut}
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={handleSignOut}
            showArrow={false}
            color="#F44336"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <SettingItem
            icon={FileText}
            title="Export Data"
            subtitle="Export sales data to CSV"
            onPress={handleExportData}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Info</Text>
          <SettingItem
            icon={HelpCircle}
            title="Help & Support"
            subtitle="Get help with the app"
            onPress={handleSupport}
          />
          <SettingItem
            icon={Coffee}
            title="About"
            subtitle="Version 1.0.0 - Built with React Native"
            showArrow={false}
            color="#795548"
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Info color="#2196F3" size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Multi-Item Sales</Text>
              <Text style={styles.infoText}>
                You can now add multiple cakes and cupcakes to a single sale with different flavors and quantities. Each item is tracked separately for detailed analytics.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Database color="#4CAF50" size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Secure & Private</Text>
              <Text style={styles.infoText}>
                Your sales data is securely stored and only accessible to you. Each user has their own private database with full authentication protection.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  settingItem: {
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
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});