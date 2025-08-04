import { SafeAreaView, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button } from './common'

export default function MyCapsules() {
  const navigation = useNavigation()

  return (
    <SafeAreaView>
      <Text>My Capsules</Text>
      <Button
        title="Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </SafeAreaView>
  )
}