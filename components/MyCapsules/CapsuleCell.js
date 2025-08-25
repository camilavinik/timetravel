import { StyleSheet, Text, View } from 'react-native'
import { Cell } from 'react-native-tableview-simple'
import { colors, typography, margins, rsz } from '../../lib/theme'
import { Ionicons } from '@expo/vector-icons'
import ContentBadge from './ContentBadge'

export default function CapsuleCell({ capsule, onPress }) {
  const { name, color, icon, unlockAt, imageCount, videoCount, messageCount, unlocked, daysLeftCount } = capsule;

  return (
    <Cell
      onPress={onPress}
      backgroundColor='transparent'
      highlightUnderlayColor='transparent'
      contentContainerStyle={styles.cellContentContainer}
      cellContentView={
        <View style={styles.cellContent}>
          <View style={[styles.capsuleEmojiContainer, { backgroundColor: color }]}>
            <Text style={typography.subtitle}>{icon}</Text>
          </View>
          <View style={styles.spaceBetween}>
            <View>
              <Text style={typography.subtitle}>{name}</Text>
              <View style={styles.badgesContainer}>
                <Text style={typography.label}>{unlocked ? 'Unlocked on' : 'Locked until'} {unlockAt}</Text>
                {!unlocked && <Text style={styles.daysLeft}>{daysLeftCount === 1 ? 'TOMORROW' : `${daysLeftCount} DAYS`}</Text>}
              </View>
            </View>
            <View style={styles.badgesContainer}>
              <ContentBadge count={imageCount} icon={<Ionicons name="image-outline" size={12} />} />
              <ContentBadge count={videoCount} icon={<Ionicons name="film-outline" size={12} />} />
              <ContentBadge count={messageCount} icon={<Ionicons name="mail-outline" size={12} />} />
            </View>
          </View>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  cellContentContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    marginHorizontal: margins.md,
  },
  cellContent: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'row',
    gap: margins.sm,
    alignItems: 'stretch',
    padding: margins.sm,
    borderRadius: margins.sm,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  capsuleEmojiContainer: {
    width: rsz(70),
    height: rsz(70),
    borderRadius: margins.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: margins.xs,
    alignItems: 'center',
  },
  daysLeft: {
    ...typography.badgeSmall,
    paddingHorizontal: margins.xs,
    paddingVertical: margins.xxs,
    backgroundColor: colors.primary,
    borderRadius: margins.xs,
    color: colors.white,
  },
})