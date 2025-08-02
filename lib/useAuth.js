import { useState } from 'react'
import { Alert } from 'react-native'
import { supabase } from './supabase'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)

  const login = async ({ email, password }) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

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

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    
    if (error) Alert.alert('Logout Error', error.message)
    setLoading(false)
  }

  return {
    login,
    register,
    logout,
    loading
  }
}