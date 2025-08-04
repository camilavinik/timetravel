import { SafeAreaView, Text, View, StyleSheet } from 'react-native'
import { Button, Container } from './common'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../lib/AuthContext'

export default function Settings() {
  const { profile } = useAuthContext()

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
          <Text>Settings</Text>
        </Container>
      </View>

      <Button
        variant="outlined"
        style={styles.button}
        title="Logout"
        onPress={() => supabase.auth.signOut()}
      />
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
    paddingVertical: 20,
  },
  button: {
    margin: 20,
  },
})