import { View, Text, TextInput, StyleSheet } from 'react-native'
import { colors, typography } from '../../lib/theme'

export default function Input({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  autoComplete,
  textContentType 
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        placeholderTextColor={colors.gray}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry}
        autoComplete={autoComplete}
        textContentType={textContentType}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    ...typography.inputLabel,
    color: colors.dark,
    marginBottom: 4,
  },
  input: {
    ...typography.body,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 6,
    padding: 10,
  },
})