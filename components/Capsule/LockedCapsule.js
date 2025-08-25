import { View, Text, StyleSheet } from 'react-native'
import { Container } from '../common'
import { typography, colors } from '../../lib/theme'

export default function LockedCapsule({ capsule }) {
  return <Container centered>
    <View style={styles.containerContent}>
      <Text style={typography.subtitle}>{capsule.name}</Text>
      <Text style={styles.body}>This capsule is locked until</Text>
      <Text style={styles.body}>{capsule.unlockAt}</Text>
    </View>
  </Container>
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
})