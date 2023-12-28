import type { Metadata } from "next";
import "../styles/globals.css";

import { fontsGgSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/client/auth-provider";
import ThemeProvider from "@/components/client/theme-provider";
import QueryProvider from "@/components/client/query-provider";
import Toaster from "@/components/ui/toast";
import TailwindIndicator from "@/components/server/tailwind-indicator";

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
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
