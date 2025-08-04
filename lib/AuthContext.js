import React, { createContext, useContext, useState, useEffect } from 'react'
import { AppState, Alert } from 'react-native'
import { supabase } from './supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // AppState listener for Supabase auto-refresh, fromsupabase documentation
  useEffect(() => {
    const handleAppStateChange = (state) => {
      if (state === 'active') {
        supabase.auth.startAutoRefresh()
      } else {
        supabase.auth.stopAutoRefresh()
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription?.remove()
  }, [])

  // Supabase auth state change listener, from supabase documentation
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => { subscription.unsubscribe() }
  }, [])

  // Get profile from Supabase when session changes
  useEffect(() => {
    if (session) {
      getProfile()
    } else setProfile(null)
  }, [session])

  // Get profile information from supabase for the current user
  const getProfile = async () => {
    try {
      setLoading(true)

      if (!session?.user) throw new Error('No user on the session!')

      const { data, error } = await supabase
        .from('profiles')
        .select(`first_name, last_name, email, created_at`)
        .eq('auth_id', session.user.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Register a new user in supabase and create a profile for them
  const register = async ({ email, password, firstName, lastName }) => {
    setLoading(true)

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    })

    if (signUpError) {
      console.error('Signup error:', signUpError)
      Alert.alert('Signup Error', signUpError.message)
      setLoading(false)
      return { error: signUpError }
    }

    const user = signUpData.user

    const { error: profileError } = await supabase.from('profiles').insert({
      auth_id: user.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
    })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      supabase.auth.deleteUser(user.id) // delete user from auth as registration failed
      Alert.alert('Error creating profile:', profileError.message)
      setLoading(false)
      return { error: profileError }
    }

    setLoading(false)
  }

  // Logout the current user
  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()

    if (error) Alert.alert('Logout Error', error.message)
    setLoading(false)
  }

  // Login the current user
  const login = async ({ email, password }) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ session, profile, loading, register, logout, login }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}