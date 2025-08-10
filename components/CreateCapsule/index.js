import { useState } from 'react'
import { Text, StyleSheet, ScrollView, View } from 'react-native'
import { Container } from '../common'
import { colors, typography } from '../../lib/theme'
import IconChooser, { suggestedIcons } from './IconChooser'

const suggestedColors = [
  '#FFE182',
  '#EBBABF',
  '#345CA1',
  '#88C59F',
  '#AC2436',
];

export default function CreateCapsule() {
  const [color, setColor] = useState(suggestedColors[0])
  const [icon, setIcon] = useState(suggestedIcons[0])
  const [name, setName] = useState('')

  return (
    <ScrollView style={styles.container}>
      {/* Capsule Design */}
      <Container>
        <Text style={typography.subtitle}>Capsule Design</Text>
        <Text style={styles.description}>Choose an icon, color, and name for your capsule.</Text>
        <View style={styles.column}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Text style={typography.subtitle}>{icon}</Text>
          </View>
          <IconChooser icon={icon} setIcon={setIcon} />
        </View>
      </Container>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  column: {
    gap: 10,
    paddingTop: 10,
  },
  description: {
    ...typography.description,
    color: colors.gray,
  },
  iconContainer: {
    marginHorizontal: 'auto',
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
})