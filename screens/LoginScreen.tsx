import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { AppleAuth } from "../components/AppleAuth";

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Image style={{height: 150, width: 150}} source={require("../assets/icon.png")} />
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
