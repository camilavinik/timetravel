import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native'
import { TableView } from 'react-native-tableview-simple';
import { Input, Button, Loading } from '../common'
import CapsuleCell from './CapsuleCell'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthContext } from '../../lib/AuthContext'

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
  }).map(capsule => ({
    id: capsule.id,
    name: capsule.name,
    color: capsule.color,
    icon: capsule.icon,
    unlockAt: new Date(capsule.unlock_at).toLocaleDateString(),
    imageCount: 0, // TODO: Count from related tables when implemented
    videoCount: 0, // TODO: Count from related tables when implemented
    messageCount: 0, // TODO: Count from related tables when implemented
  }))
}

export default function MyCapsules() {
  const navigation = useNavigation()
  const { session } = useAuthContext()
  const [capsules, setCapsules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleGetCapsules = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('capsules')
        .select('id, name, color, icon, unlock_at')
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

  return (
    <SafeAreaView style={styles.container}>
      {capsules.length === 0 ? <EmptyState /> : <>
        <Input placeholder="Search capsule" style={styles.mh20} />
        <ScrollView>
          <TableView style={styles.gap10}>
            {capsules.map((capsule) => (
              <CapsuleCell key={capsule.id} capsule={capsule} />
            ))}
          </TableView>
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <Button title="Create Capsule" onPress={() => navigation.navigate('CreateCapsule')} />
        </View>
      </>}
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
})