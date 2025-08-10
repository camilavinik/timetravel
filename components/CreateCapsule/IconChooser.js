import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, typography } from '../../lib/theme'
import Input from '../common/Input'

export const suggestedIcons = [
  '🎉',
  '💌',
  '🎁',
  '🎂',
  '🎈',
  '🎸',
  '☀️',
  '🌈',
  '🌊',
  '🌸'
]

export default function IconChooser({ icon, setIcon }) {
  const [inputValue, setInputValue] = useState('')

  const handleSelectIcon = (i) => {
    setIcon(i)
    setInputValue('')
  }

  const handleInputChange = (text) => {
    setInputValue(text)
    setIcon(text)
  }

  return (
    <>
      <Text style={typography.subtitle}>Choose Icon</Text>
      <View style={styles.iconsContainer}>
        {suggestedIcons.map((i, index) => (
          <TouchableOpacity style={[styles.icon, i === icon && styles.selectedIcon]} key={index} onPress={() => handleSelectIcon(i)}>
            <Text style={typography.subtitle}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.helperText}>Or type your own emoji or character:</Text>
      <Input
        value={inputValue}
        onChangeText={handleInputChange}
        maxLength={1}
        inputStyle={styles.centeredInput}
      />
    </>
  )
}

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  icon: {
    borderWidth: 1,
    borderColor: colors.gray,
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    outlineWidth: 1,
    outlineColor: colors.primary,
    borderColor: colors.primary,
  },
  helperText: {
    ...typography.description,
    color: colors.gray,
  },
  centeredInput: {
    textAlign: 'center',
  },
})