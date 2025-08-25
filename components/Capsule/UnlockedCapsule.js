import { useState, useCallback, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native'
import { Container, Loading, ErrorState, MediaItem } from '../common'
import { typography, colors } from '../../lib/theme'
import useCapsules from '../../lib/useCapsules'
import { useAuthContext } from '../../lib/AuthContext'

export default function UnlockedCapsule({ capsule }) {
  const { session } = useAuthContext()
  const [capsuleContent, setCapsuleContent] = useState(null)
  const { getCapsuleContent, getCapsuleContentLoading, getCapsuleContentError } = useCapsules({ session })

  const handleGetCapsuleContent = useCallback(async () => {
    const capsuleContent = await getCapsuleContent(capsule.id)
    setCapsuleContent(capsuleContent)
  }, [getCapsuleContent, capsule.id])

  const handleDownload = useCallback((fileUrl) => {
    if (fileUrl) {
      Linking.openURL(fileUrl)
    }
  }, [])

  useEffect(() => {
    handleGetCapsuleContent()
  }, [handleGetCapsuleContent])

  if (getCapsuleContentLoading) return <Loading />
  if (getCapsuleContentError || !capsuleContent) return <ErrorState error={getCapsuleContentError} onRetry={handleGetCapsuleContent} />

  return (
    <ScrollView>
      <View style={styles.container}>
        <Container color={capsule.color}>
          <View style={styles.row}>
            <Text style={styles.icon}>{capsule.icon}</Text>
            <View>
              <Text style={typography.subtitle}>{capsule.name}</Text>
              <Text style={typography.description}>Created on {capsule.createdAt}</Text>
              <Text style={typography.description}>Unlocked on {capsule.unlockAt}</Text>
            </View>
          </View>
        </Container>
        {capsuleContent.messages.length > 0 && <Container>
          <View style={styles.col10}>
            <Text style={typography.subtitle}>Your Messages</Text>
            {capsuleContent.messages.map((message) => (
              <View key={message.id} style={styles.messageContainer}>
                <Text style={typography.description} key={message.id}>{message.message}</Text>
              </View>
            ))}
          </View>
        </Container>}
        {capsuleContent.capsule_media.length > 0 && <Container>
          <View style={styles.col10}>
            <Text style={typography.subtitle}>Media Galery</Text>
            {capsuleContent.capsule_media.map((item) => (
              <MediaItem
                key={item.id}
                size={item.fileSize}
                format={item.path.split('.').pop()}
                duration={item.duration}
                isVideo={item.type.includes('video')}
                onDownload={() => handleDownload(item.fileUrl)} />
            ))}
          </View>
        </Container>}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: 'column',
    gap: 20,
  },
  col10: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  messageContainer: {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  icon: {
    ...typography.title,
    color: colors.white,
    paddingHorizontal: 10,
  },
})