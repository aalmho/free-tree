import { supabase } from "./utils/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import "react-native-get-random-values";
import { SessionContext } from "./context/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StackNavigator } from "./navigation/StackNavigator";

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
