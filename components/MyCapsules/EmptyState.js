import { View, Text, StyleSheet } from 'react-native'
import { colors, typography } from '../../lib/theme'
import { Button } from '../common'
import { useNavigation } from '@react-navigation/native'
import { Container } from '../common'

export default function EmptyState() {
  const navigation = useNavigation()

  return (
    <Container centered>
      <View style={styles.containerContent}>
        <Text style={typography.subtitle}>You don't have any capsules!</Text>
        <Text style={styles.body}>Create a new capsule to get started.</Text>
        <Button title="Create Capsule" style={styles.button} onPress={() => navigation.navigate('CreateCapsule')} />
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  containerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    ...typography.body,
    color: colors.gray,
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
})