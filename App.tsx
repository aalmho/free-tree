import "react-native-gesture-handler";
import "react-native-get-random-values";
import "./i18n/i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StackNavigator } from "./navigation/StackNavigator";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NavigationContainerComponent from "./navigation/NavigationcontainerComponent";
import { Authentication } from "./components/Authentication";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Authentication>
        <NavigationContainerComponent>
          <QueryClientProvider client={queryClient}>
            <StackNavigator />
          </QueryClientProvider>
        </NavigationContainerComponent>
      </Authentication>
    </GestureHandlerRootView>
  );
}
