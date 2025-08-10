import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native'
import { TableView } from 'react-native-tableview-simple';
import { Input, Button } from '../common'
import CapsuleCell from './CapsuleCell'
import EmptyState from './EmptyState'
import { useNavigation } from '@react-navigation/native'

const mockCapsules = [
  {
    id: 1,
    title: 'Capsule 1',
    color: '#FFD700',
    emoji: '🍎',
    unlockDate: '2025-01-01',
    imageCount: 2,
    videoCount: 1,
    messageCount: 1,
  },
  {
    id: 2,
    title: 'Capsule 2',
    color: '#008000',
    emoji: '🍌',
    unlockDate: '2025-01-01',
    imageCount: 2,
    videoCount: 2,
    messageCount: 1,
  },
  {
    id: 3,
    title: 'Capsule 3',
    color: '#000080',
    emoji: '🍇',
    unlockDate: '2025-01-01',
    imageCount: 1,
    videoCount: 3,
    messageCount: 2,
  },
]

export default function MyCapsules() {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      {mockCapsules.length === 0 ? <EmptyState /> : <>
        <Input placeholder="Search capsule" style={styles.mh20} />
        <ScrollView>
          <TableView style={styles.gap10}>
            {mockCapsules.map((capsule) => (
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