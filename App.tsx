import { supabase } from "./utils/supabase";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabsNavigator from "./navigation/BottomTabsNavigator";
import LoginScreen from "./screens/LoginScreen";
import "react-native-get-random-values";
import { SessionContext } from "./context/SessionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createStackNavigator } from "@react-navigation/stack";
import CreatePostScreen from "./screens/CreatePostScreen";
import Chat from "./components/chat/Chat";

export default function App() {

  type StackParamList = {
    Home: undefined,
    CreatePostScreen: undefined,
      Chat: { requestId: number }; 
    };

  const [session, setSession] = useState<Session | null>(null);
  const Stack = createStackNavigator<StackParamList>();

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
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={BottomTabsNavigator} />
                <Stack.Screen
                  options={{ title: "Create tree", headerShown: true }}
                  name="CreatePostScreen"
                  component={CreatePostScreen}
                />
                <Stack.Screen name="Chat" component={Chat} options={{ title: "Beskeder", headerShown: true }} />
              </Stack.Navigator>
            </QueryClientProvider>
          </NavigationContainer>
        </SessionContext.Provider>
      ) : (
        <LoginScreen />
      )}
    </>
  );
}
