import React, { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { SessionStoreProvider } from "@/components/client/context/session-ctx";
// import SiteFooter from "@/components/client/site-footer";
import SiteHeader from "@/components/client/site-header";

import { nextAuthOptions } from "@/lib/next-auth";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const logger = new Logger("Dashboard");
  const session = await getServerSession(nextAuthOptions);

  const user_id = session?.user?.user_id;

  const params = new URLSearchParams();

  // User is undefined redirect to sign in page
  if (!user_id) {
    logger.info("server session.user.id is not defined redirecting to signin page");

    // params.append("checkAuth", "false")
    return redirect(`/auth/signin`);
  }

  if (!session?.user?.id) {
    params.append("new", "true");

    logger.log("session?.user?.id null");

    return redirect(`/auth/signup?${params.toString()}`);
  }

  const org_user = await prisma.orgUsers.findFirst({
    where: {
      user_id: session?.user?.id,
    },
  });

  if (!org_user) {
    logger.info("org_user not found redirecting to signup page");

    params.append("new", "true");
    return redirect(`/auth/signup?${params.toString()}`);
  }

  return (
    <SessionStoreProvider session={session}>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      {/* <SiteFooter /> */}
    </SessionStoreProvider>
  );
}
