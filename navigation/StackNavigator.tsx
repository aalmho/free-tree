import { createStackNavigator } from "@react-navigation/stack";
import Chat from "../components/chat/Chat";
import CreatePostScreen from "../screens/CreatePostScreen";
import BottomTabsNavigator from "./BottomTabsNavigator";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Profile } from "../api/api";
import { useGetNotificationConsentAndToken } from "../hooks/use-notifications";

export type ChatParams = { requestId: number; recipientProfile: Profile };

export type StackParamList = {
  Home: undefined;
  CreatePostScreen: undefined;
  Chat: ChatParams;
};

export const StackNavigator: FC = () => {
  const Stack = createStackNavigator<StackParamList>();
  const { t } = useTranslation();

  useGetNotificationConsentAndToken();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={BottomTabsNavigator} />
      <Stack.Screen
        options={{
          title: t("cpsTitle"),
          headerShown: true,
          headerBackTitle: t("back"),
        }}
        name="CreatePostScreen"
        component={CreatePostScreen}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: true, headerBackTitle: t("back") }}
      />
    </Stack.Navigator>
  );
};
