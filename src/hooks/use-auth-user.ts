import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export const AuthUserContext = createContext<User | null>(null);
export const useAuthUser = () => useContext(AuthUserContext);
