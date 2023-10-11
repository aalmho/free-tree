import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AppleAuth } from './components/AppleAuth';
import { supabase } from './utils/supabase';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';

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
    <View style={styles.container}>
      {session ? 
      <>
        <Button title="sign out" onPress={() => supabase.auth.signOut()} />
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
        </>
      :
      <AppleAuth />}
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
