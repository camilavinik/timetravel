import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Container } from '../common'
import { typography } from '../../lib/theme'

export default function Capsule({ route }) {
  const { capsule } = route.params

  return (
    <ScrollView>
      <View style={styles.container}>
        <Container>
          <Text style={typography.subtitle}>{capsule.name}</Text>
          <Text style={typography.body}>Created on {capsule.createdAt}</Text>
          <Text style={typography.body}>Unlocked on {capsule.unlockAt}</Text>
        </Container>
        <Container>
          <Text style={typography.subtitle}>Your Messages</Text>
          {/* TODO: Add messages */}
          <Text style={typography.subtitle}>Media Galery</Text>
          {/* TODO: Add media */}
        </Container>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: 'column',
    gap: 20,
  },
})