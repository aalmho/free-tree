import "react-native-gesture-handler";
import { supabase } from "./utils/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import "react-native-get-random-values";
import { SessionContext } from "./context/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StackNavigator } from "./navigation/StackNavigator";
import "./i18n/i18next";
import { registerForPushNotificationsAsync } from "./utils/registerForPushNotifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  const queryClient = new QueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    registerForPushNotificationsAsync().then(async (token) => {
      await supabase
        .from("profiles")
        .update({ id: session?.user.id, expo_push_token: token });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {session ? (
        <SessionContext.Provider value={{ session }}>
          <NavigationContainer>
            <QueryClientProvider client={queryClient}>
              <StackNavigator />
            </QueryClientProvider>
          </NavigationContainer>
        </SessionContext.Provider>
      ) : (
        <LoginScreen />
      )}
    </GestureHandlerRootView>
  );
}
