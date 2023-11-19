import { createStackNavigator } from "@react-navigation/stack";
import Chat from "../components/chat/Chat";
import CreatePostScreen from "../screens/CreatePostScreen";
import BottomTabsNavigator from "./BottomTabsNavigator";
import { FC } from "react";

export type ChatParams = { requestId: number; otherPersonFirstName: string };

type StackParamList = {
  Home: undefined;
  CreatePostScreen: undefined;
  Chat: ChatParams;
};

export const StackNavigator: FC = () => {
  const Stack = createStackNavigator<StackParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={BottomTabsNavigator} />
      <Stack.Screen
        options={{ title: "Create tree", headerShown: true }}
        name="CreatePostScreen"
        component={CreatePostScreen}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};
