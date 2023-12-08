import { supabase } from "../utils/supabase";
import { FC, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import LoginScreen from "../screens/LoginScreen";
import { SessionContext } from "../context/SessionContext";

interface AuthenticationInterface {
  children: JSX.Element;
}

export const Authentication: FC<AuthenticationInterface> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);

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
          {children}
        </SessionContext.Provider>
      ) : (
        <LoginScreen />
      )}
    </>
  );
};
