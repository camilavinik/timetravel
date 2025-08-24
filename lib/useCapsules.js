import { useState } from 'react'
import { Alert } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { supabase } from './supabase'

export default function useCapsules({ session }) {
  const [isCreatingCapsule, setIsCreatingCapsule] = useState(false)

  const createCapsule = async ({ name, icon, color, date, mediaItems }) => {
    try {
      setIsCreatingCapsule(true)

      // Create capsule
      const { data: capsuleData, error } = await supabase
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

      if (error) throw error

      // Upload media files (if any)
      for (const mediaItem of mediaItems) {
        const isVideo = mediaItem.asset.type && mediaItem.asset.type.includes('video')
        const mediaType = isVideo ? 'video' : 'image'

        // Use the actual filename and mimeType from the asset
        const fileName = `${Date.now()}-${mediaItem.asset.fileName}`
        const filePath = `${capsuleData.id}/${fileName}`

        // Read file as base64 and upload
        const base64Data = await FileSystem.readAsStringAsync(mediaItem.asset.uri, {
          encoding: FileSystem.EncodingType.Base64,
        })

        // Upload to supabase storage
        await supabase.storage
          .from('capsule-media')
          .upload(filePath, decode(base64Data), {
            contentType: mediaItem.asset.mimeType
          })

        // Save metadata
        await supabase.from('capsule_media').insert({
          capsule_id: capsuleData.id,
          type: mediaType,
          path: filePath
        })
      }
    } catch (error) {
      console.error('Error creating capsule:', error)
      Alert.alert('Error', error.message || 'Failed to create capsule')
    } finally {
      setIsCreatingCapsule(false)
    }
  }

  return {
    createCapsule,
    isCreatingCapsule,
  }
}