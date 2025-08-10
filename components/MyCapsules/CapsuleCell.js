import { StyleSheet, Text, View } from 'react-native'
import { Cell } from 'react-native-tableview-simple'
import { colors, typography } from '../../lib/theme'
import { Ionicons } from '@expo/vector-icons'
import ContentBadge from './ContentBadge'

export default function CapsuleCell({ capsule }) {
  const { title, color, emoji, unlockDate, imageCount, videoCount, messageCount } = capsule;

  return (
    <Cell
      backgroundColor='transparent'
      contentContainerStyle={styles.cellContentContainer}
      cellContentView={
        <View style={styles.cellContent}>
          <View style={[styles.capsuleEmojiContainer, { backgroundColor: color }]}>
            <Text style={typography.subtitle}>{emoji}</Text>
          </View>
          <View style={styles.spaceBetween}>
            <View>
              <Text style={typography.subtitle}>{title}</Text>
              <Text style={typography.label}>Unlocks {unlockDate}</Text>
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
    marginHorizontal: 20
  },
  cellContent: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
    padding: 10,
    borderRadius: 10,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  capsuleEmojiContainer: {
    width: 70,
    height: 70,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 5,
  },
})