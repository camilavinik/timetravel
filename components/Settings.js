import React, { useState } from 'react'

import { SafeAreaView, Text, View, StyleSheet, ScrollView } from 'react-native'
import { Button, Container, Input, ErrorState } from './common'
import { useAuthContext } from '../lib/AuthContext'
import { typography, margins } from '../lib/theme'

export default function Settings({ navigation }) {
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

  if (!profile) return <ErrorState error="Error loading profile" />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.settingsContainer}>
          <Container>
            <Text style={typography.title}>{profile.first_name} {profile.last_name}</Text>
            <Text style={typography.description}>{profile.email}</Text>
            <Text style={typography.description}>
              {new Date(profile.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</Text>
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
              disabled={isSubmitting || (!confirmPassword && !currentPassword) || newPassword !== confirmPassword}
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
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: margins.md,
    justifyContent: 'space-between',
  },
  settingsContainer: {
    flex: 1,
    gap: margins.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: margins.md,
  },
  input: {
    marginBottom: margins.md,
  },
  updateButton: {
    marginTop: margins.sm,
  },
})