import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, typography, rsz, margins } from '../../lib/theme'

export const suggestedColors = [
  '#FFFAA0',
  '#CAFFBF',
  '#ADD0B3',
  '#9BF6FF',
  '#A0C4FF',
  '#B4A9F8',
  '#FFC6FF',
  '#FEC7DD',
  '#FFADAD',
  '#FFD6A5',
];

export default function ColorChooser({ color, setColor }) {
  return (
    <View style={styles.gap}>
      <Text style={typography.subtitle}>Choose Color</Text>
      <View style={styles.iconsContainer}>
        {suggestedColors.map((c, index) => (
          <TouchableOpacity style={[styles.colorbox, { backgroundColor: c }, c === color && styles.selectedColor]} key={index} onPress={() => setColor(c)}/>
        ))}
      </View>
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
  colorbox: {
    borderWidth: 1,
    borderColor: colors.gray,
    width: rsz(50),
    height: rsz(50),
    borderRadius: margins.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    outlineWidth: 1,
    outlineColor: colors.primary,
    borderColor: colors.primary,
  },
  centeredInput: {
    textAlign: 'center',
  },
})