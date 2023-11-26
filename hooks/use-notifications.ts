import { useContext, useEffect } from "react";
import { registerForPushNotificationsAsync } from "../utils/registerForPushNotifications";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";

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
