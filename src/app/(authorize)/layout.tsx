import React, { PropsWithChildren } from "react";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/client/theme-toggle";
import { Hexagon } from "lucide-react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex-1">
      <div className="min-h-screen md:flex">
        <section className="relative my-2 ml-2 flex-1 md:block">
          <Image
            src={siteConfig.images.signin.banner}
            alt="Sign In Banner"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            sizes="(max-width: 768px) 100vw"
            fill
            priority
          />
        </section>
        <section className="flex min-h-screen flex-1 flex-col justify-between p-6">
          <div className="flex justify-between">
            <div className="flex flex-row items-center">
              <Hexagon size={30} />
              <h1 className="ml-2 text-2xl">{siteConfig.name}</h1>
            </div>
            {/* Add Translations Toggle */}
            <ThemeToggle />
          </div>
          <div className="max-w-9/12 mx-auto w-full min-w-fit sm:w-3/5 md:w-[70%] lg:w-3/5 xl:w-2/4">
            {children}
          </div>

          <footer>
            <p className="text-xs">
              &copy; {siteConfig.name} {new Date().getFullYear()}. All rights reserved.
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}
