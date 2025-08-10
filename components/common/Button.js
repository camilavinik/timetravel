import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { colors, typography } from '../../lib/theme'

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
  buttonGhost: {
    padding: 10,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
  },
  small: {
    padding: 2,
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
  disabled: {
    opacity: 0.4,
  },
})

const buttonVariants = {
  contained: styles.buttonContained,
  outlined: styles.buttonOutlined,
  ghost: styles.buttonGhost,
}

const textVariants = {
  contained: styles.textContained,
  outlined: styles.textOutlined,
  ghost: styles.textOutlined,
}

export default function Button({ title, onPress, loading, disabled, variant = 'contained', size = 'medium', style }) {
  return (
    <TouchableOpacity style={[buttonVariants[variant], disabled && styles.disabled, size === 'small' && styles.small, style]} onPress={onPress} disabled={disabled || loading}>
      <Text style={textVariants[variant]}>{title}</Text>
    </TouchableOpacity>
  )
}