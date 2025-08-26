import React from 'react'
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native'
import { colors, typography, margins } from '../../lib/theme'
import { Ionicons } from '@expo/vector-icons'

export default function Header({ navigation, options, back }) {
  const { headerTitle, headerSubtitle, showSettingsGear } = options;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.spaceBetween}>
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
        {showSettingsGear && (
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={colors.dark} />
          </TouchableOpacity>
        )}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + margins.sm : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: margins.md,
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: margins.md,
    paddingBottom: margins.md,
    justifyContent: 'space-between',
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


