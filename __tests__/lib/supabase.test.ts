import { supabase } from '@/lib/supabase';

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('Supabase Client', () => {
  it('should create client when environment variables are provided', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    // Re-import to get the client with new env vars
    const { supabase: testSupabase } = require('@/lib/supabase');
    
    expect(testSupabase).toBeTruthy();
    expect(testSupabase.supabaseUrl).toBe('https://test.supabase.co');
  });

  it('should return null when environment variables are missing', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    // Re-import to get the client with missing env vars
    const { supabase: testSupabase } = require('@/lib/supabase');
    
    expect(testSupabase).toBeNull();
  });

  it('should return null when only URL is provided', () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    const { supabase: testSupabase } = require('@/lib/supabase');
    
    expect(testSupabase).toBeNull();
  });

  it('should return null when only anon key is provided', () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

    const { supabase: testSupabase } = require('@/lib/supabase');
    
    expect(testSupabase).toBeNull();
  });
});
