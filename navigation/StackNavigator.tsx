import { createStackNavigator } from "@react-navigation/stack";
import Chat from "../components/chat/Chat";
import CreatePostScreen from "../screens/CreatePostScreen";
import BottomTabsNavigator from "./BottomTabsNavigator";
import { FC } from "react";

type StackParamList = {
  Home: undefined;
  CreatePostScreen: undefined;
  Chat: { requestId: number };
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
        options={{ title: "Beskeder", headerShown: true }}
      />
    </Stack.Navigator>
  );
};
