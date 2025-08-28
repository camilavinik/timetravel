import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { colors, typography, margins } from '../../lib/theme'

const styles = StyleSheet.create({
  buttonContained: {
    padding: margins.sm,
    backgroundColor: colors.primary,
    borderWidth: margins.xxs,
    borderColor: colors.primary,
    borderRadius: margins.xs,
    alignItems: 'center',
  },
  buttonOutlined: {
    padding: margins.sm,
    backgroundColor: 'transparent',
    borderWidth: margins.xxs,
    borderColor: colors.primary,
    borderRadius: margins.xs,
    alignItems: 'center',
  },
  buttonGhost: {
    padding: margins.sm,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
  },
  small: {
    padding: margins.xxs,
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

export default function Button({ title, onPress, loading, disabled, variant = 'contained', size = 'medium', style, testID }) {
  return (
    <TouchableOpacity style={[buttonVariants[variant], disabled && styles.disabled, size === 'small' && styles.small, style]} onPress={onPress} disabled={disabled || loading} testID={testID}>
      <Text style={textVariants[variant]}>{title}</Text>
    </TouchableOpacity>
  )
}