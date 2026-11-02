import { createContext, useContext } from "react";

/** Resolved by the backend (my_access) on every session load. */
export type Access = "admin" | "staff" | "guest";
export const AccessContext = createContext<Access>("staff");
export const useAccess = () => useContext(AccessContext);
