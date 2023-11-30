import { useContext, useEffect } from "react";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotifications";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import { AppState, AppStateStatus } from "react-native";
import * as Notifications from "expo-notifications";
import { removeAllNotificationsForUser } from "../api/api";

export const useGetNotificationConsentAndToken = () =>  {
    const { session } = useContext(SessionContext);
    useEffect(() => {
        if (session) {
        registerForPushNotificationsAsync().then(async (token) => {
            await supabase
            .from("profiles")
            .update({ expo_push_token: token })
            .eq("id", session?.user.id);
        });
        }
    }, []);
}

export const useClearNotificationsOnActiveAppState = () => {
    const { session } = useContext(SessionContext);
    const handleAppStateChange: (state: AppStateStatus) => void = (
        nextAppState
      ) => {
        if (nextAppState === "active" && session) {
          Notifications.setBadgeCountAsync(0);
          removeAllNotificationsForUser(session?.user.id);
        }
      };
      useEffect(() => {
        const subscription = AppState.addEventListener(
            "change",
            handleAppStateChange
          );
          
          return () => {
            subscription.remove();
          };
      }, []);
}
