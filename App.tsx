import { supabase } from "./utils/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import "react-native-get-random-values";
import { SessionContext } from "./context/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StackNavigator } from "./navigation/StackNavigator";
import { useTranslation } from "react-i18next";
import "./i18n/i18next";
import { registerForPushNotificationsAsync } from "./utils/registerForPushNotifications";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const { t } = useTranslation();

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
        .upsert({ id: session?.user.id, expo_push_token: token });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
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
    </>
  );
}
