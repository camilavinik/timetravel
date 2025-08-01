import { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { supabase } from './lib/supabase'
import { Auth, MyCapsules } from './components'
import { useFonts, SpaceGrotesk_300Light, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk'

const Stack = createStackNavigator()

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={Auth} />
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MyCapsules" 
        component={MyCapsules}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  const [session, setSession] = useState(null)

  // Load fonts
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular, 
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  })

  // Supabase auth state change listener from supabase docs
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => { subscription.unsubscribe() }
  }, [])

  // Do not render app until fonts are loaded
  if (!fontsLoaded) {
    return null
  }
  
  return (
    <NavigationContainer>
      {session && session.user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}
