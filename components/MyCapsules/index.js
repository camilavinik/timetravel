import { SafeAreaView, StyleSheet, ScrollView, View, Text } from 'react-native'
import { TableView } from 'react-native-tableview-simple';
import { Input, Button, Loading, ErrorState } from '../common'
import CapsuleCell from './CapsuleCell'
import EmptyState from './EmptyState'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useMemo, useCallback } from 'react'
import { useAuthContext } from '../../lib/AuthContext'
import { typography } from '../../lib/theme'
import useCapsules from '../../lib/useCapsules'

export default function MyCapsules({ navigation }) {
  const { session } = useAuthContext()
  const { getCapsules, getCapsulesLoading, getCapsulesError } = useCapsules({ session })
  const [capsules, setCapsules] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCapsules = useMemo(() => {
    if (capsules.length === 0) return [];

    if (!searchQuery) return capsules;

    return capsules.filter((capsule) => capsule.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [capsules, searchQuery])

  const handleGetCapsules = useCallback(async () => {
    const capsules = await getCapsules()
    setCapsules(capsules)
  }, [getCapsules])

  // Refresh capsules when screen comes into focus (including initial mount)
  useFocusEffect(
    useCallback(() => {
      handleGetCapsules()
    }, [handleGetCapsules])
  )

  if (getCapsulesLoading) return <Loading />

  if (getCapsulesError) return <ErrorState error={getCapsulesError} onRetry={handleGetCapsules} />

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