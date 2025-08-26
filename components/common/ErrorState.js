import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, margins } from '../../lib/theme'
import { Button, Container } from '.'

export default function ErrorState({ error, onRetry }) {
  return (
    <Container centered>
      <View style={styles.containerContent}>
        <Text style={typography.subtitle}>Oops! Something went wrong.</Text>
        <Text style={styles.body}>{error}</Text>
        {onRetry && <Button title="Try Again" style={styles.button} onPress={onRetry} />}
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
  },
  button: {
    marginTop: margins.md,
    width: '100%',
  },
})