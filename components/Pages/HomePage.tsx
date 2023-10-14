import React from 'react';
import {Text, View, Button} from 'react-native';
import { supabase } from '../../utils/supabase';
const HomePage = () => {
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="sign out" onPress={() => supabase.auth.signOut()} />
            <Text>Open up App.tsx to start working on your appasds!</Text>
        </View>
    )
}

export default HomePage;