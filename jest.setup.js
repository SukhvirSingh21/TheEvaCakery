// Set up global variables for React Native
global.__DEV__ = true;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  Link: ({ children, ...props }) => children,
  Stack: {
    Screen: ({ children }) => children,
  },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Plus: 'Plus',
  Save: 'Save',
  Trash2: 'Trash2',
  Calculator: 'Calculator',
  DollarSign: 'DollarSign',
  Calendar: 'Calendar',
  CreditCard: 'CreditCard',
  TrendingUp: 'TrendingUp',
  Filter: 'Filter',
  CircleHelp: 'CircleHelp',
  FileText: 'FileText',
  Mail: 'Mail',
  ExternalLink: 'ExternalLink',
  Info: 'Info',
  Coffee: 'Coffee',
  LogOut: 'LogOut',
  User: 'User',
  Database: 'Database',
}));

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => ({
  Picker: 'Picker',
}));

// Mock React Native components that might cause issues
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
    Linking: {
      openURL: jest.fn(),
    },
  };
});

// Global test timeout
jest.setTimeout(10000);
