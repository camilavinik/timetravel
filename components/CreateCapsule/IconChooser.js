import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, typography, rsz, margins } from '../../lib/theme'
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
    <View style={styles.gap}>
      <Text style={typography.subtitle}>Choose Icon</Text>
      <View style={styles.iconsContainer}>
        {suggestedIcons.map((i, index) => (
          <TouchableOpacity style={[styles.icon, i === icon && styles.selectedIcon]} key={index} onPress={() => handleSelectIcon(i)} testID={`icon-option-${i}`}>
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
        testID="custom-icon-input"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  gap: {
    gap: margins.sm,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: margins.sm,
    justifyContent: 'center',
  },
  icon: {
    borderWidth: 1,
    borderColor: colors.gray,
    width: rsz(50),
    height: rsz(50),
    borderRadius: margins.sm,
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