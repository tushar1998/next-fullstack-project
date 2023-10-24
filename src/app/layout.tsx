import type { Metadata } from "next";
import "../styles/globals.css";

import { fontsGgSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import AuthProvider from "@/components/client/providers/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "Untitled UI",
    template: `%s - Untitled UI`,
  },
  description: "Simple Management app using nextjs app",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
