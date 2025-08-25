import React, { useState } from 'react'
import { View, StyleSheet, Image, Text } from 'react-native'
import { Button, Input, Container } from './common'
import { colors, typography, rsz, margins } from '../lib/theme'
import { useNavigation } from '@react-navigation/native'
import { useAuthContext } from '../lib/AuthContext'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()
  const { login, loading } = useAuthContext()

  const handleLogin = () => login({ email, password })

  return (
    <Container centered>
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
          <Button title="Sign in" disabled={loading} onPress={handleLogin} />
          <Button variant="outlined" title="Sign up" disabled={loading} onPress={() => navigation.navigate('SignUp')} />
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: margins.lg,
  },
  logo: {
    width: rsz(80),
    height: rsz(80),
    marginBottom: margins.md,
  },
  welcomeTitle: {
    ...typography.title,
    color: colors.dark,
    marginBottom: margins.xs,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.gray,
  },
  container: {
    gap: margins.md,
  },
  buttonGroup: {
    gap: margins.md,
    marginTop: margins.sm,
  },
})