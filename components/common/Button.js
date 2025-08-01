import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { colors, typography } from '../../lib/theme'

export default function Button({ title, onPress, loading, disabled, variant = 'container', style }) {
  const buttonStyle = variant === 'container' ? styles.buttonContained : styles.buttonOutlined
  const textStyle = variant === 'container' ? styles.textContained : styles.textOutlined

  return (
    <TouchableOpacity style={[buttonStyle, style]} onPress={onPress} disabled={disabled || loading}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonContained: {
    padding: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonOutlined: {
    padding: 10,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    alignItems: 'center',
  },
  textContained: {
    color: colors.white,
    ...typography.button,
    textAlign: 'center',
  },
  textOutlined: {
    color: colors.primary,
    ...typography.button,
    textAlign: 'center',
  },
})