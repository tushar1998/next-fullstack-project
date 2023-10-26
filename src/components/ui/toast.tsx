"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  const { theme } = useTheme();

  return <SonnerToaster richColors theme={theme as "light" | "dark"} closeButton />;
}
