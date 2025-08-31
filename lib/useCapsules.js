import { useState, useCallback } from 'react'
import { Alert } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { supabase } from './supabase'

/**
 * Parse date string as local date
 * @param {string} dateString - Date string from database
 * @returns {Date} - Parsed date
 */
const parseLocalDate = (dateString) => {
  if (!dateString) return null

  // Handle dates with timezone
  if (dateString.includes('T')) {
    const date = new Date(dateString)

    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return new Date(year, month, day)
  }

  // Handle dates without timezone
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day) // month is 0-indexed
}

/**
 * Format date string to MM DD, YYYY
 * @param {string} dateString - Date string from database
 * @returns {string} - Formatted date string
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Invalid date'

  // Parse date as local date to avoid timezone issues
  const parsedDate = parseLocalDate(dateString)
  console.log({ parsedDate })
  if (parsedDate) {
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return 'Invalid date'
}

/**
 * Parse and sort capsules by unlock date
 * Future dates first, then past dates, both ascending
 * @param {Array} capsules - Array of capsules
 * @returns {Array} - Array of parsed and sorted capsules
 */
const parseAndSortCapsules = (capsules) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return capsules.sort((a, b) => {
    const unlockAtA = parseLocalDate(a.unlock_at);
    const unlockAtB = parseLocalDate(b.unlock_at);

    // Handle cases where dates couldn't be parsed
    if (!unlockAtA || !unlockAtB) return 0;

    const isFutureA = unlockAtA > today;
    const isFutureB = unlockAtB > today;

    if (isFutureA && !isFutureB) return -1;
    if (!isFutureA && isFutureB) return 1;

    return unlockAtB - unlockAtA;
  }).map(capsule => {
    const unlockDate = parseLocalDate(capsule.unlock_at);
    return {
      id: capsule.id,
      name: capsule.name,
      color: capsule.color,
      icon: capsule.icon,
      unlockAt: formatDate(capsule.unlock_at),
      createdAt: formatDate(capsule.created_at),
      unlocked: unlockDate && unlockDate <= today,
      daysLeftCount: unlockDate ? Math.ceil((unlockDate - today) / (1000 * 60 * 60 * 24)) || 0 : 0,
      imageCount: capsule.capsule_media?.filter(media => media.type === 'image').length || 0,
      videoCount: capsule.capsule_media?.filter(media => media.type === 'video').length || 0,
      messageCount: capsule.messages?.length || 0
    }
  })
}

/**
 * useCapsules - Custom React Hook for Time Capsule Management
 * 
 * Provides functionality for creating, retrieving, and managing time capsules
 * with Supabase backend integration. Handles media uploads, message storage,
 * and capsule content retrieval with error handling and loading states.
 * 
 * @param {Object} session - Supabase session object for user authentication
 * @returns {Object} Hook interface with createCapsule, getCapsules, getCapsuleContent and associated loading/error states
 */
export default function useCapsules({ session }) {
  const [isCreatingCapsule, setIsCreatingCapsule] = useState(false)
  const [getCapsulesLoading, setGetCapsulesLoading] = useState(false)
  const [getCapsulesError, setGetCapsulesError] = useState(null)
  const [getCapsuleContentLoading, setGetCapsuleContentLoading] = useState(false)
  const [getCapsuleContentError, setGetCapsuleContentError] = useState(null)

  const createCapsule = useCallback(async ({ name, icon, color, date, mediaItems, messages }) => {
    try {
      setIsCreatingCapsule(true)

      // Create capsule
      const { data: capsuleData, error } = await supabase
        .from('capsules')
        .insert([{
          name: name.trim(),
          icon,
          color,
          unlock_at: date.toISOString().split('T')[0],
          user_id: session.user.id,
        }])
        .select()
        .single()

      if (error) throw error

      // Upload messages (if any)
      if (messages && messages.length > 0) {
        const messageData = messages
          .filter(msg => msg.message.trim() !== '')
          .map(msg => ({
            capsule_id: capsuleData.id,
            message: msg.message.trim(),
          }))

        if (messageData.length > 0) {
          const { error: messageError } = await supabase
            .from('messages')
            .insert(messageData)

          if (messageError) {
            // Clean up capsule if message upload fails
            await supabase
              .from('capsules')
              .delete()
              .eq('id', capsuleData.id)

            throw messageError
          }
        }
      }

      // Upload media files (if any)
      for (const mediaItem of mediaItems) {
        try {
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
          const { error: storageError } = await supabase.storage
            .from('capsule-media')
            .upload(filePath, decode(base64Data), {
              contentType: mediaItem.asset.mimeType
            })

          if (storageError) throw storageError

          // Save metadata
          const { error: metadataError } = await supabase.from('capsule_media').insert({
            capsule_id: capsuleData.id,
            type: mediaType,
            path: filePath
          })

          if (metadataError) throw metadataError
        } catch (mediaError) {
          // Clean up messages and capsule if media upload failed
          await supabase
            .from('messages')
            .delete()
            .eq('capsule_id', capsuleData.id)

          await supabase
            .from('capsules')
            .delete()
            .eq('id', capsuleData.id)

          throw mediaError
        }
      }
    } catch (error) {
      console.error('Error creating capsule:', error)
      Alert.alert('Error', error.message || 'Failed to create capsule')
    } finally {
      setIsCreatingCapsule(false)
    }
  }, [session])

  const getCapsules = useCallback(async () => {
    try {
      setGetCapsulesLoading(true)
      setGetCapsulesError(null)

      const { data, error } = await supabase
        .from('capsules')
        .select(`
          id, 
          name, 
          color, 
          icon, 
          unlock_at, 
          created_at,
          capsule_media(type),
          messages(id)
        `)
        .eq('user_id', session.user.id)
        .order('unlock_at')

      if (error) throw error

      return parseAndSortCapsules(data)
    } catch (error) {
      console.error('Error fetching capsules:', error)
      setGetCapsulesError(error.message)
    } finally {
      setGetCapsulesLoading(false)
    }
  }, [session])

  const getCapsuleContent = useCallback(async (id) => {
    try {
      setGetCapsuleContentLoading(true)
      setGetCapsuleContentError(null)

      const { data, error } = await supabase
        .from('capsules')
        .select(`
          capsule_media(id, type, path),
          messages(id, message)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Get file info using signed URLs for each media item
      const mediaWithFileInfo = await Promise.all(
        data.capsule_media.map(async (media) => {
          try {
            // Download file to get size
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('capsule-media')
              .download(media.path)

            if (downloadError) throw downloadError

            // Get signed URL
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from('capsule-media')
              .createSignedUrl(media.path, 3600)

            if (signedUrlError) throw signedUrlError

            return {
              ...media,
              fileBlob: fileData,
              fileUrl: signedUrlData?.signedUrl,
              fileSize: fileData?.size,
              duration: null
            }
          } catch (error) {
            console.error('Error fetching media file info:', error)
            return {
              ...media,
              fileBlob: null,
              fileUrl: null,
              fileSize: 0,
              duration: null
            }
          }
        })
      )

      return {
        ...data,
        capsule_media: mediaWithFileInfo
      }
    } catch (error) {
      console.error('Error fetching capsule content:', error)
      setGetCapsuleContentError(error.message)
    } finally {
      setGetCapsuleContentLoading(false)
    }
  }, [session])

  return {
    createCapsule,
    isCreatingCapsule,

    getCapsules,
    getCapsulesLoading,
    getCapsulesError,

    getCapsuleContent,
    getCapsuleContentLoading,
    getCapsuleContentError,
  }
}