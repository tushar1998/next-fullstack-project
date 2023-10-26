"use client"

import { Context, createContext, PropsWithChildren, useContext } from "react"
import { Session } from "next-auth"

export const SessionContext = createContext(null) as unknown as Context<Session>

interface PermissionProviderProps {
  session: Session
}

export const SessionStoreProvider = ({
  session,
  children,
}: PropsWithChildren<PermissionProviderProps>) => {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export function useServerSession() {
  const store = useContext(SessionContext)

  if (!store) throw new Error("Missing Session.Provider in the tree")

  return useContext(SessionContext)
}
