import { Session } from "@supabase/supabase-js";
import { createContext } from "react";

interface SessionContextProps {
    session: Session | null;
}

const contextValue = {
    session: null
}

export const SessionContext = createContext<SessionContextProps>(contextValue);