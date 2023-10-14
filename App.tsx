import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AppleAuth } from './components/AppleAuth';
import { supabase } from './utils/supabase';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabsNavigator from './components/BottomTabsNavigator';
import LoginPage from './components/Pages/LoginPage';

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
