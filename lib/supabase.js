/**
 * Supabase Client Configuration
 * 
 * Initializes and exports the Supabase client with React Native-specific configuration.
 * Uses AsyncStorage for session persistence and enables auto token refresh for
 * seamless authentication across app sessions.
 * 
 * Based on the supabase documentation.
 * 
 * @exports {Object} supabase - Configured Supabase client instance
 */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or key')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
