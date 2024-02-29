import "../styles/globals.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import AuthProvider from "@/components/client/auth-provider";
import QueryProvider from "@/components/client/query-provider";
import ThemeProvider from "@/components/client/theme-provider";
import TailwindIndicator from "@/components/server/tailwind-indicator";
import Toaster from "@/components/ui/toast";
import { fontsGgSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Untitled UI",
    template: `%s - Untitled UI`,
  },
  description: "Simple Management app using nextjs app",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen bg-background font-sans antialiased", fontsGgSans.variable)}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryProvider>
              <div className="relative mx-auto flex min-h-screen w-full max-w-[1920px] flex-col overflow-auto">
                {children}
              </div>
            </QueryProvider>
          </ThemeProvider>
          <Toaster />
          <TailwindIndicator />
        </AuthProvider>
      </body>
    </html>
  );
}
