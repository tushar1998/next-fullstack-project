import Link from "next/link";
import { getServerSession } from "next-auth";

import { PageProps } from "@/types/page";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { nextAuthOptions } from "@/lib/next-auth";

export default async function OrganizationPage({ params }: PageProps) {
  const session = await getServerSession(nextAuthOptions);

  const org = await prisma.organizations.findUnique({
    where: { name: params?.orgId },
  });

  if (!org) {
    throw new Error(`Organization name '${params?.orgId}' does not exists`);
  }

  return (
    <section className="mx-auto grid w-full items-center gap-4 p-4 sm:px-8">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-2xl font-extrabold leading-tight md:text-3xl">
          Welcome {session?.user?.name},
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Accessible and customizable components that you can copy and paste into your apps. Free.
          Open Source. And Next.js 13 Ready.
        </p>
      </div>
      <div className="flex flex-wrap gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
    </section>
  );
}
