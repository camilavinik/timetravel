import { View, Text, TextInput, StyleSheet } from 'react-native'
import { colors, typography, margins, rsz } from '../../lib/theme'

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  maxLength,
  secureTextEntry = false,
  autoComplete,
  textContentType,
  style,
  inputStyle,
  error,
  multiline = false,
}) {
  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.errorBorder, inputStyle, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry}
        autoComplete={autoComplete}
        textContentType={textContentType}
        maxLength={maxLength}
        multiline={multiline}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    ...typography.inputLabel,
    color: colors.dark,
    marginBottom: margins.xs,
  },
  input: {
    ...typography.body,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: margins.xs,
    padding: margins.sm,
  },
  multilineInput: {
    height: rsz(100),
  },
  errorBorder: {
    borderColor: colors.error,
  },
  error: {
    position: 'absolute',
    bottom: rsz(-15),
    right: 0,
    color: colors.error,
    ...typography.error,
  },
})