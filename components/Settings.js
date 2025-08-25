import React, { useState } from 'react'

import { SafeAreaView, Text, View, StyleSheet } from 'react-native'
import { Button, Container, Input } from './common'
import { useAuthContext } from '../lib/AuthContext'
import { typography } from '../lib/theme'

export default function Settings() {
  const { profile, logout, changePassword } = useAuthContext()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChangePassword = async () => {
    try {
      setIsSubmitting(true)
      const { error } = await changePassword({ currentPassword, newPassword })
      if (!error) {
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!profile) return null; // TODO: add error messages

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.settingsContainer}>
        <Container>
          <Text>{profile.first_name} {profile.last_name}</Text>
          <Text>{profile.email}</Text>
          <Text>{profile.created_at}</Text>
        </Container>
        <Container>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <Input
            label="Current password"
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            style={styles.input}
          />
          <Input
            label="New password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoComplete="password-new"
            textContentType="newPassword"
            style={styles.input}
          />
          <Input
            label="Confirm new password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="password-new"
            textContentType="newPassword"
            style={styles.input}
            error={confirmPassword && newPassword !== confirmPassword && 'Passwords do not match'}
          />
          <Button
            title="Update password"
            loading={isSubmitting}
            onPress={handleChangePassword}
            disabled={isSubmitting || (confirmPassword && newPassword !== confirmPassword)}
            style={styles.updateButton}
          />
        </Container>
      </View>

      <Container>
        <Button
          variant="outlined"
          title="Logout"
          onPress={logout}
        />
      </Container>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  settingsContainer: {
    flex: 1,
    gap: 20,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: 14,
  },
  input: {
    marginBottom: 18,
  },
  updateButton: {
    marginTop: 8,
  },
})