import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native'
import { TableView } from 'react-native-tableview-simple';
import { Input, Button, Loading } from '../common'
import CapsuleCell from './CapsuleCell'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthContext } from '../../lib/AuthContext'
import { typography } from '../../lib/theme'

/**
 * Parse and sort capsules by unlock date
 * Future dates first, then past dates, both ascending
 * @param {Array} capsules - Array of capsules
 * @returns {Array} - Array of parsed and sorted capsules
 */
const parseAndSortCapsules = (capsules) => {
  const now = new Date()

  return capsules.sort((a, b) => {
    const unlockAtA = new Date(a.unlock_at);
    const unlockAtB = new Date(b.unlock_at);

    const isFutureA = unlockAtA > now;
    const isFutureB = unlockAtB > now;

    if (isFutureA && !isFutureB) return -1;
    if (!isFutureA && isFutureB) return 1;

    return unlockAtA - unlockAtB;
  }).map(capsule => {
    return {
      id: capsule.id,
      name: capsule.name,
      color: capsule.color,
      icon: capsule.icon,
      unlockAt: new Date(capsule.unlock_at).toLocaleDateString(),
      createdAt: new Date(capsule.created_at).toLocaleDateString(),
      imageCount: capsule.capsule_media?.filter(media => media.type === 'image').length || 0,
      videoCount: capsule.capsule_media?.filter(media => media.type === 'video').length || 0,
      messageCount: 0, // TODO: Count from related tables when implemented
    }
  })
}

export default function MyCapsules({ navigation }) {
  const { session } = useAuthContext()
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCapsules = useMemo(() => {
    if (capsules.length === 0) return [];

    if (!searchQuery) return capsules;

    return capsules.filter((capsule) => capsule.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [capsules, searchQuery])

  const handleGetCapsules = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('capsules')
        .select(`
          id, 
          name, 
          color, 
          icon, 
          unlock_at, 
          created_at,
          capsule_media(type)
        `)
        .eq('user_id', session.user.id)
        .order('unlock_at')

      if (error) throw error

      const parsedCapsules = parseAndSortCapsules(data)
      setCapsules(parsedCapsules)
    } catch (error) {
      console.error('Error fetching capsules:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load capsules when component mounts
  useEffect(() => {
    handleGetCapsules()
  }, [session])

  if (loading) return <Loading />

  if (error) return <ErrorState error={error} onRetry={handleGetCapsules} />

  if (capsules.length === 0) return <EmptyState />

  return (
    <SafeAreaView style={styles.container}>
      <Input placeholder="Search capsule" style={styles.mh20} value={searchQuery} onChangeText={setSearchQuery} />
      <ScrollView>
        {filteredCapsules.length > 0 ? <>
          <TableView style={styles.gap10}>
            {filteredCapsules.map((capsule) => (
              <CapsuleCell key={capsule.id} capsule={capsule} onPress={() => navigation.navigate('Capsule', { capsule })} />
            ))}
          </TableView>
        </> : <Text style={styles.noCapsulesFound}>No capsules found with "{searchQuery}"</Text>}
      </ScrollView>
      <View style={styles.bottomButtonContainer}>
        <Button title="Create Capsule" onPress={() => navigation.navigate('CreateCapsule')} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  gap10: {
    gap: 10,
  },
  mh20: {
    marginHorizontal: 20,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noCapsulesFound: {
    ...typography.body,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
})