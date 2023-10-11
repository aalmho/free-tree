import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kyufkydyfccasjstefyh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dWZreWR5ZmNjYXNqc3RlZnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5MjYwMjAsImV4cCI6MjAxMjUwMjAyMH0.__mYvaDst8HD83Tgb3Hc1kWnBG5Ey3buZ1rvD1-f6i8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })