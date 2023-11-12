import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { AppleAuth } from "../components/AppleAuth";

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 100 }}>🎄</Text>
      <Text style={{ fontSize: 20 }}>Find eller giv et juletræ</Text>
      <AppleAuth />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
});

export default LoginScreen;
