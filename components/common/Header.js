import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, typography } from '../../lib/theme'
import { Ionicons } from '@expo/vector-icons'

export default function Header({ navigation, options, back }) {
  const { headerTitle, headerSubtitle } = options;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {back && (
          <TouchableOpacity onPress={navigation.goBack}>
            <Ionicons name="arrow-back" size={24} color={colors.dark} />
          </TouchableOpacity>
        )}
        <View>
          <Text numberOfLines={1} style={styles.title}>{headerTitle}</Text>
          {headerSubtitle && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {headerSubtitle}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  title: {
    ...typography.title,
    color: colors.dark,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
  },
})


