import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LogIn, MyCapsules, SignUp, Settings, CreateCapsule, Capsule } from './components'
import { AuthProvider, useAuthContext } from './lib/AuthContext'
import { useFonts, SpaceGrotesk_300Light, SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk'
import { Header } from './components/common'

const Stack = createStackNavigator()

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ header: (props) => <Header {...props} /> }}>
      <Stack.Screen
        name="MyCapsules"
        component={MyCapsules}
        options={{ headerTitle: 'My Capsules', headerSubtitle: 'Manage your capsules', showSettingsGear: true }}
      />
      <Stack.Screen
        name="Capsule"
        component={Capsule}
        options={{ headerTitle: 'Capsule', headerSubtitle: 'View capsule' }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerTitle: 'Settings', headerSubtitle: 'Manage your account' }}
      />
      <Stack.Screen
        name="CreateCapsule"
        component={CreateCapsule}
        options={{ headerTitle: 'Create Capsule', headerSubtitle: 'Create a new capsule' }}
      />
    </Stack.Navigator>
  )
}

function AppContent() {
  const { session, loading } = useAuthContext()

  // Load fonts
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_300Light,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  })

  // Do not render app until fonts are loaded
  if (!fontsLoaded || loading) {
    return null
  }

  return (
    <NavigationContainer>
      {session && session.user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
