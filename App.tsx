import { StatusBar } from 'expo-status-bar';
import { supabase } from './utils/supabase';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabsNavigator from './navigation/BottomTabsNavigator';
import LoginPage from './screens/LoginPage';
import 'react-native-get-random-values'

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  },[])

  return (
    <>
      {session ? 
      <NavigationContainer>
        <BottomTabsNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
      :
      <LoginPage />}
      
    </>
  )
}
