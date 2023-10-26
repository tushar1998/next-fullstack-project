import Link from "next/link";
import { getServerSession } from "next-auth";

import { siteConfig } from "@/config/site";
// import { Routes } from "@/lib/constants/routes";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";

// import CommandK from "./client/command-k";
// import NavItem from "./client/nav-item"
import { ThemeToggle } from "./theme-toggle";
import { Routes } from "@/lib/constants/routes";
import { GitHubLogoIcon, ModulzLogoIcon } from "@radix-ui/react-icons";
import { Github, Hexagon } from "lucide-react";
// import SiteNavigation from "./client/site-navigation"
// import UserAccountMenu from "./client/user-account-menu"
import { Separator } from "@/components/ui/separator";
import OrganizationSelect from "./org-select";
import UserAccountMenu from "./user-account-menu";
import SiteNavigation from "./site-navigation";
import CommandK from "./command-k";
import { cn } from "@/lib/utils";

export default async function SiteHeader() {
  const session = await getServerSession(nextAuthOptions);

  const orgUsers = await prisma.orgUsers.findMany({
    where: {
      user_id: session?.user?.id,
    },
    include: {
      org: true,
      role: true,
    },
  });

  const orgUsersOptions = orgUsers.map((orgUser) => ({
    label: orgUser.org.display_name,
    value: orgUser.org.name,
    org: orgUser.org,
    role: orgUser.role,
  }));

  const navs = siteConfig.mainNav.map(({ href, ...rest }) => {
    return {
      ...rest,
      href: `${Routes.DASHBOARD}/${session?.org?.name}`.concat(href),
    };
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-12 w-full items-center justify-normal border-b px-2 sm:h-14 sm:justify-between md:px-8">
        <div className="flex items-center">
          <Link href="/" className="items-center space-x-2 sm:flex md:mr-2">
            <Hexagon className="h-6 w-6" />
            <span className="hidden font-bold md:inline-block">{siteConfig.name}</span>
          </Link>

          <Separator orientation="vertical" className="mx-2 h-8" />
          <OrganizationSelect orgUsers={orgUsersOptions} />
        </div>

        <div className="flex w-full items-center justify-end sm:w-auto">
          <CommandK className="mr-1 sm:w-44 md:w-60 lg:w-80" />
          <div className="flex items-center justify-between gap-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "ghost",
                }),
                "hidden sm:inline-flex"
              )}
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <ThemeToggle className="hidden sm:inline-flex" />
            <UserAccountMenu />
          </div>
        </div>
      </div>

      <SiteNavigation navs={navs} />
    </header>
  );
}

/**
 *? Button indicators - to be implemented with pagination (1 of the idea)
 *  <Button
 *   variant="ghost"
 *   className="h-6 items-center rounded-full bg-muted p-1"
 *  >
 *   <Icons.rightArrow className="h-4 w-4 stroke-muted-foreground" />
 *  </Button>
 */
