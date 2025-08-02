import { SafeAreaView, Text, View } from 'react-native'
import { Button } from './common'
import { supabase } from '../lib/supabase'

export default function MyCapsules() {

  return (
    <SafeAreaView>
      <Text>My Capsules</Text>
      <View>
        <Button 
          title="Logout" 
          onPress={() => supabase.auth.signOut()}
        />
      </View>
    </SafeAreaView> 
  )
}