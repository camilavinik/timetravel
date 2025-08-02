import React, { useState } from 'react'
import { Alert, View, StyleSheet, Image, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input, Container } from './common'
import { colors, typography } from '../lib/theme'
import { useNavigation } from '@react-navigation/native'

export default function LogIn() {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  async function register() {
    setLoading(true)
    const {
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const disabled = loading || !name || !lastName || !email || !password || !confirmPassword || password !== confirmPassword
  
  return (
    <Container>
      <View style={styles.header}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Sign up for Timetravel</Text>
        <Text style={styles.subtitle}>Create an account to start your journey</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.rowInputs}>
          <Input
            label="Name"
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder="Name"
            style={styles.flex1}
          />
          <Input
            label="Last Name"
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            placeholder="Last Name"
            style={styles.flex1}
          />
        </View>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
        <Input
          label="Confirm Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="Confirm Password"
          autoCapitalize={'none'}
          error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
        />
        <View style={styles.buttonGroup}>
          <Button title="Register" disabled={disabled} onPress={register} />
          <Button variant="ghost" title="Cancel" disabled={loading} onPress={() => navigation.goBack()} />
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    ...typography.title,
    color: colors.dark,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
  },
  container: {
    gap: 16,
  },
  buttonGroup: {
    gap: 16,
    marginTop: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
})