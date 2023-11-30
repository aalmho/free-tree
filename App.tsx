import "react-native-gesture-handler";
import "react-native-get-random-values";
import { supabase } from "./utils/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { LinkingOptions, NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import { SessionContext } from "./context/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StackNavigator, StackParamList } from "./navigation/StackNavigator";
import "./i18n/i18next";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppState } from "react-native";
import * as Linking from "expo-linking";
import type { AppStateStatus } from "react-native";
import { removeAllNotificationsForUser } from "./api/api";
import NavigationContainerComponent from "./navigation/NavigationcontainerComponent";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  const queryClient = new QueryClient();

  const onAppStateChange = (status: AppStateStatus) => {
    if (status === "active" && session) {
      Notifications.setBadgeCountAsync(0);
      removeAllNotificationsForUser(session?.user.id);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {session ? (
        <SessionContext.Provider value={{ session }}>
          <NavigationContainerComponent>
            <QueryClientProvider client={queryClient}>
              <StackNavigator />
            </QueryClientProvider>
          </NavigationContainerComponent>
        </SessionContext.Provider>
      ) : (
        <LoginScreen />
      )}
    </GestureHandlerRootView>
  );
}
