import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { TableView } from 'react-native-tableview-simple';
import { Input, Button, Loading, ErrorState, Container } from '../common'
import CapsuleCell from './CapsuleCell'
import EmptyState from './EmptyState'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useMemo, useCallback } from 'react'
import { useAuthContext } from '../../lib/AuthContext'
import { typography, colors, margins } from '../../lib/theme'
import useCapsules from '../../lib/useCapsules'

export default function MyCapsules({ navigation }) {
  const { session } = useAuthContext()
  const { getCapsules, getCapsulesLoading, getCapsulesError } = useCapsules({ session })
  const [capsules, setCapsules] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filteredCapsules = useMemo(() => {
    if (capsules.length === 0) return [];

    let filtered = capsules;

    // Filter by unlock status
    if (selectedFilter === 'Locked') {
      filtered = filtered.filter((capsule) => !capsule.unlocked);
    } else if (selectedFilter === 'Unlocked') {
      filtered = filtered.filter((capsule) => capsule.unlocked);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((capsule) =>
        capsule.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [capsules, searchQuery, selectedFilter])

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

  const filters = ['All', 'Locked', 'Unlocked']

  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <Input placeholder="Search capsule" value={searchQuery} onChangeText={setSearchQuery} testID="search-input" />
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity key={filter} onPress={() => setSelectedFilter(filter)} testID={`filter-${filter.toLowerCase()}`}>
              <Text style={[styles.filter, selectedFilter === filter && styles.selectedFilter]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Container>
      <ScrollView>
        {filteredCapsules.length > 0 ?
          <TableView style={styles.gap10}>
            {filteredCapsules.map((capsule) => (
              <CapsuleCell key={capsule.id} capsule={capsule} onPress={() => navigation.navigate('Capsule', { capsule })} />
            ))}
          </TableView>
          : <Text style={styles.noCapsulesFound}>No capsules found{searchQuery ? ` with "${searchQuery}"` : ''}</Text>}
      </ScrollView>
      <View style={styles.bottomButtonContainer}>
        <Button title="Create Capsule" onPress={() => navigation.navigate('CreateCapsule')} testID="create-capsule-button" />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: margins.md,
  },
  gap10: {
    gap: margins.sm,
  },
  filtersContainer: {
    marginTop: margins.sm,
    flexDirection: 'row',
    gap: margins.sm,
  },
  filter: {
    ...typography.button,
    backgroundColor: colors.lightGray2,
    paddingHorizontal: margins.sm,
    paddingVertical: margins.xxs,
    borderRadius: margins.md,
  },
  selectedFilter: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  bottomButtonContainer: {
    paddingHorizontal: margins.md,
    paddingBottom: margins.md,
  },
  noCapsulesFound: {
    ...typography.body,
    paddingHorizontal: margins.md,
    marginBottom: margins.md,
  },
})