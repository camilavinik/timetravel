import { useState } from 'react'
import { Text, StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native'
import { Container } from '../common'
import { colors, typography } from '../../lib/theme'
import IconChooser, { suggestedIcons } from './IconChooser'
import ColorChooser, { suggestedColors } from './ColorChooser'
import { Input, Button, MediaItem } from '../common'
import { randomUUID } from 'expo-crypto'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as VideoThumbnails from 'expo-video-thumbnails'
import DateTimePicker from '@react-native-community/datetimepicker'
import { supabase } from '../../lib/supabase'
import { useAuthContext } from '../../lib/AuthContext'

export default function CreateCapsule({ navigation }) {
  const { session } = useAuthContext()
  const [color, setColor] = useState(suggestedColors[0])
  const [icon, setIcon] = useState(suggestedIcons[0])
  const [name, setName] = useState('')
  const [messages, setMessages] = useState([])
  const [mediaItems, setMediaItems] = useState([])
  const [date, setDate] = useState(new Date())
  const [isCreating, setIsCreating] = useState(false)

  const addMessage = () => {
    setMessages([...messages, { id: randomUUID(), message: '' }])
  }

  const updateMessage = (id, message) => {
    setMessages(messages.map(m => m.id === id ? { ...m, message } : m))
  }

  const deleteMessage = (id) => {
    setMessages(messages.filter(m => m.id !== id))
  }

  const addMedia = async () => {
    try {
      // Request permission to access the media library
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!libraryPermission.granted) {
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        quality: 1,
      })

      // If the user cancels or no assets are selected, exit
      if (result.canceled || !result.assets || result.assets.length === 0) return

      // Add each asset to the media items array with the file info
      result.assets.forEach(async (asset) => {
        const fileInfo = await FileSystem.getInfoAsync(asset.uri)
        const isVideo = asset.type && asset.type.includes('video')

        let thumbnailUri = asset.uri
        if (isVideo) {
          const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, { time: 1000 })
          thumbnailUri = uri
        }

        setMediaItems((prev) => [
          ...prev,
          {
            id: randomUUID(),
            fileInfo,
            asset,
            thumbnailUri,
          },
        ])
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to add media.')
    }
  }

  const removeMediaItem = (id) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id))
  }

  const createCapsule = async () => {
    try {
      setIsCreating(true)
      // Insert capsule into Supabase
      const { error } = await supabase
        .from('capsules')
        .insert([{
          name: name.trim(),
          icon,
          color,
          unlock_at: date.toISOString(),
          user_id: session.user.id,
        }])
        .select()
        .single()

      if (error) throw error;

      // Redirct to home page (MyCapsules)
      navigation.navigate('MyCapsules')

    } catch (error) {
      console.error('Error creating capsule:', error)
      Alert.alert('Error', error.message || 'Failed to create capsule')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Capsule Design */}
        <Container>
          <Text style={typography.subtitle}>Capsule Design</Text>
          <Text style={styles.description}>Choose an icon, color, and name for your capsule.</Text>
          <View style={styles.column}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
              <Text style={typography.subtitle}>{icon}</Text>
            </View>
            <IconChooser icon={icon} setIcon={setIcon} />
            <ColorChooser color={color} setColor={setColor} />
            <View style={styles.gap10}>
              <Text style={typography.subtitle}>Capsule Name</Text>
              <Input value={name} onChangeText={setName} />
            </View>
          </View>
        </Container>

        {/* Your Messages */}
        <Container>
          <View style={styles.spaceBetween}>
            <View>
              <Text style={typography.subtitle}>Your Messages</Text>
              <Text style={styles.description}>Add one or more messages.</Text>
            </View>
            <Button title={<Ionicons name="add-outline" size={24} />} onPress={addMessage} size="small" />
          </View>
          {messages.length > 0 && <View style={styles.column}>
            {messages.map((message, index) => (
              <View key={message.id} style={styles.relative}>
                <Input label={`Message ${index + 1}`} placeholder="Write your message here..." multiline value={message.message} onChangeText={text => updateMessage(message.id, text)} />
                <TouchableOpacity onPress={() => deleteMessage(message.id)} style={styles.messageDeleteIcon}>
                  <Ionicons name="close-circle-outline" size={20} color={colors.gray} />
                </TouchableOpacity>
              </View>
            ))}
          </View>}
        </Container>

        {/* Add Media */}
        <Container>
          <View style={styles.spaceBetween}>
            <View>
              <Text style={typography.subtitle}>Add Media</Text>
              <Text style={styles.description}>Upload photos, videos, or both.</Text>
            </View>
            <Button title={<Ionicons name="add-outline" size={24} />} onPress={addMedia} size="small" />
          </View>

          {mediaItems.length > 0 && (
            <View style={[styles.column, styles.gap10]}>
              {mediaItems.map((item) => (
                <MediaItem key={item.id} item={item} onRemove={() => removeMediaItem(item.id)} />
              ))}
            </View>
          )}
        </Container>

        {/* Unlock Date */}
        <Container>
          <Text style={typography.subtitle}>Unlock Date</Text>
          <Text style={styles.description}>When should this capsule open?</Text>
          <DateTimePicker
            value={date}
            mode="date"
            display="compact"
            minimumDate={new Date()}
            onChange={(_, selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate)
              }
            }}
            style={styles.datePicker}
          />
        </Container>

        {/* Create Button */}
        <Container>
          <Button
            title={isCreating ? 'Creating Capsule...' : 'Create Capsule'}
            onPress={createCapsule}
            disabled={isCreating || name.trim() === '' || icon === '' || color === ''}
          />
        </Container>
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
  column: {
    gap: 20,
    paddingTop: 10,
  },
  gap10: {
    gap: 10,
  },
  relative: {
    position: 'relative',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  description: {
    ...typography.description,
    color: colors.gray,
  },
  iconContainer: {
    marginHorizontal: 'auto',
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  messageDeleteIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  datePicker: {
    width: '100%',
    height: 120,
    marginTop: 10,
    marginLeft: -10,
  },
})