import "react-native-gesture-handler";
import "react-native-get-random-values";
import { supabase } from "./utils/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import LoginScreen from "./screens/LoginScreen";
import { SessionContext } from "./context/SessionContext";
import { QueryClient, focusManager } from "@tanstack/react-query";
import { StackNavigator } from "./navigation/StackNavigator";
import "./i18n/i18next";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NavigationContainerComponent from "./navigation/NavigationcontainerComponent";
import { AppState, AppStateStatus } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
      },
    },
  });

  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
  });

  const onAppStateChange = (status: AppStateStatus) => {
    focusManager.setFocused(status === "active");
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
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{ persister: asyncStoragePersister }}
            >
              <StackNavigator />
            </PersistQueryClientProvider>
          </NavigationContainerComponent>
        </SessionContext.Provider>
      ) : (
        <LoginScreen />
      )}
    </GestureHandlerRootView>
  );
}
