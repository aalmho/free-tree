import React, { useRef, FC } from "react";
import { Text, TouchableOpacity, Animated, View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";
import { deleteUserData } from "../api/api";
import { useTranslation } from "react-i18next";

interface SignOutDropdownProps {
  userId: string;
}

export const SignOutDropdown: FC<SignOutDropdownProps> = ({ userId }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  fadeIn();

  const onSignOut = () => {
    supabase.auth.signOut();
  };

  const onDeleteProfile = () => {
    return Alert.alert(t("deleteAccountTitle"), t("deleteAccountMessage"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("continue"),
        onPress: () =>
          deleteUserData(userId).then(() => supabase.auth.signOut()),
      },
    ]);
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        opacity: fadeAnim,
        zIndex: 1,
      }}
    >
      <View style={{ gap: 20 }}>
        <TouchableOpacity onPress={onSignOut}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="log-out-outline" size={16} />
            <Text style={{ fontSize: 16 }}>Log ud</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeleteProfile}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="trash-outline" size={16} color="red" />
            <Text style={{ fontSize: 16, color: "red", fontWeight: "600" }}>
              Slet konto
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
