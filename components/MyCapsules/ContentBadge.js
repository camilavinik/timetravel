import { View, Text, StyleSheet } from 'react-native'
import { colors, typography, margins } from '../../lib/theme'

export default function ContentBadge({ count, icon }) {
  return (
    <View style={styles.contentBadge}>
      {icon}
      <Text style={typography.badge}>{count}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  contentBadge: {
    backgroundColor: colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    gap: margins.xs,
    paddingHorizontal: margins.xs,
    paddingVertical: margins.xxs,
    borderRadius: margins.xs,
  },
})