import { View, Text, StyleSheet, Image } from 'react-native'
import { colors, typography } from '../../lib/theme'

// Helper function to format file size
// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
function humanFileSize(size) {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return +((size / Math.pow(1024, i)).toFixed(2)) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

// Helper function to format duration
function humanDuration(duration) {
  if (duration == null) return '00:00'
  const totalSeconds = Math.round(duration / 1000)
  const seconds = totalSeconds % 60
  const minutes = (totalSeconds - seconds) / 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default function MediaItem({ item, onRemove }) {
  const { asset, fileInfo, thumbnailUri } = item
  const isVideo = asset.type.includes('video')
  const format = asset.uri.split('.').pop().toUpperCase()
  const duration = asset.duration

  return (
    <View style={styles.container}>
      <View style={styles.previewBox}>
        <Image source={{ uri: thumbnailUri }} style={styles.previewImage} resizeMode="cover" />
      </View>
      <View>
        <View style={styles.row}>
          <Text style={styles.type}>{asset.type}</Text>
          <Text>{format}</Text>
        </View>
        <Text style={typography.label}>{humanFileSize(fileInfo.size)} {isVideo && ` •  ${humanDuration(duration)}`}</Text>
      </View>
      {/* TODO: Add remove button */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewBox: {
    width: 50,
    height: 50,
    borderRadius: 5,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  type: {
    ...typography.body,
    textTransform: 'capitalize',
  },
})