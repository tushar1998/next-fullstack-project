"use client";

import type { Context, PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";

type TPageCtx = {
  permissions: Record<string, boolean>;
};

export const PageCtx: Context<TPageCtx> = createContext({ permissions: {} });

interface PageProviderProps {
  permissions: Record<string, boolean>;
}

export const PageProvider = ({ permissions, children }: PropsWithChildren<PageProviderProps>) => {
  const value = useMemo(
    () => ({
      permissions,
    }),
    [permissions]
  );

  return <PageCtx.Provider value={value}>{children}</PageCtx.Provider>;
};

export const usePage = () => {
  return useContext(PageCtx);
};
