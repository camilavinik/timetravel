import React, { useState } from 'react'
import { Alert, View, StyleSheet, Image, Text } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input, Container } from './common'
import { colors, typography } from '../lib/theme'
import { useNavigation } from '@react-navigation/native'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  async function login() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <Container>
      <View style={styles.header}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text style={styles.welcomeTitle}>Welcome to Timetravel</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to continue your journey</Text>
      </View>
      <View style={styles.container}>
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
        <View style={styles.buttonGroup}>
          <Button title="Sign in" disabled={loading} onPress={login} />
          <Button variant="outlined" title="Sign up" disabled={loading} onPress={() => navigation.navigate('SignUp')} />
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
  welcomeTitle: {
    ...typography.title,
    color: colors.dark,
    marginBottom: 4,
  },
  welcomeSubtitle: {
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
})