import { View, StyleSheet, SafeAreaView } from 'react-native'
import { colors } from '../../lib/theme'

export default function Container({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.container}>{children}</View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    width: '100%',
    maxWidth: 400, // Optional: limit max width on larger screens
  },
})