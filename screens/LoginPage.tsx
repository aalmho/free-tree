import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppleAuth } from '../components/AppleAuth';

const LoginPage = () => {
    return(
        <View style={styles.container}>
            <AppleAuth />
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

export default LoginPage;