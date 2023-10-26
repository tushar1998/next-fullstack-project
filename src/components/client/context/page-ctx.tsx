"use client"

import { Context, createContext, PropsWithChildren, useContext } from "react"

type TPageCtx = {
  permissions: Record<string, boolean>
}

export const PageCtx: Context<TPageCtx> = createContext({ permissions: {} })

interface PageProviderProps {
  permissions: Record<string, boolean>
}

export const PageProvider = ({
  permissions,
  children,
}: PropsWithChildren<PageProviderProps>) => {
  return <PageCtx.Provider value={{ permissions }}>{children}</PageCtx.Provider>
}

export const usePage = () => {
  return useContext(PageCtx)
}
