import { View, StyleSheet, SafeAreaView } from 'react-native'
import { colors } from '../../lib/theme'

export default function Container({ children, centered, color }) {
  return (
    <SafeAreaView style={[styles.safeArea, centered && styles.flex1]}>
      <View style={[styles.wrapper, centered && styles.flex1]}>
        <View style={[styles.container, { backgroundColor: color || colors.white }]}>{children}</View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    width: '100%',
  },
})