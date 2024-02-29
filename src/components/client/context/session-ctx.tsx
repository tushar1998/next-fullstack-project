"use client";

import type { Session } from "next-auth";
import type { Context, PropsWithChildren } from "react";
import { createContext, useContext } from "react";

export const SessionContext = createContext(null) as unknown as Context<Session>;

interface PermissionProviderProps {
  session: Session;
}

export const SessionStoreProvider = ({
  session,
  children,
}: PropsWithChildren<PermissionProviderProps>) => {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

export function useServerSession() {
  const store = useContext(SessionContext);

  if (!store) throw new Error("Missing Session.Provider in the tree");

  return useContext(SessionContext);
}
