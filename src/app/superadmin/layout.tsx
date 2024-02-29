import { Hexagon } from "lucide-react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import React from "react";

import { siteConfig } from "@/config/site";

export default function SuperAdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex-1">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="mx-auto flex h-16 w-full items-center px-2 sm:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <Hexagon className="size-6" />
            <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
          </Link>
          <div className="m-2 h-5 border" />
          <span>SuperAdmin</span>
        </div>
      </header>
      <section className="mx-auto grid w-full items-center gap-6 p-4 sm:px-8">{children}</section>
    </div>
  );
}
