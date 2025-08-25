import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors, typography } from '../../lib/theme'
import { Ionicons } from '@expo/vector-icons'

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

export default function MediaItem({ size, thumbnailUri, format, duration, isVideo, onRemove, onDownload }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.previewBox}>
          {thumbnailUri ? <Image source={{ uri: thumbnailUri }} style={styles.previewImage} resizeMode="cover" />
            : <View style={styles.mediaTypeBox}>
              <Ionicons name={isVideo ? 'film-outline' : 'image-outline'} size={24} color={colors.gray} />
            </View>}
        </View>
        <View>
          <View style={styles.row}>
            <Text style={styles.type}>{isVideo ? 'Video' : 'Image'}</Text>
            <Text style={styles.formatLabel}>{format}</Text>
          </View>
          <Text style={typography.label}>{humanFileSize(size)} {isVideo && ` •  ${humanDuration(duration)}`}</Text>
        </View>
      </View>
      {onRemove && <TouchableOpacity onPress={onRemove}>
        <Ionicons name="close-circle-outline" size={20} />
      </TouchableOpacity>}
      {onDownload && <TouchableOpacity onPress={onDownload}>
        <Ionicons name="download-outline" size={20} />
      </TouchableOpacity>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: 10,
    paddingRight: 20,
    borderRadius: 10,
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
  mediaTypeBox: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray2,
  },
  formatLabel: {
    ...typography.label,
    textTransform: 'uppercase',
    backgroundColor: colors.lightGray2,
    color: colors.secondary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
})