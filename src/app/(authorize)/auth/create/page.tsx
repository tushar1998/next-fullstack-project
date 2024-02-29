import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import React from "react";

import CreateOrgForm from "@/components/client/create-org";
import { Logger } from "@/lib/logger";
import { nextAuthOptions } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

export default async function CreateUserPage() {
  const logger = new Logger(CreateUserPage.name);
  const session = await getServerSession(nextAuthOptions);

  const userId = session?.user?.user_id;

  // User not authenticated
  if (!userId) {
    logger.log("user_id is undefined redirect to signin");
    redirect("/auth/signin");
  }

  const userCreate: Session["user"] = session?.user;

  const params = new URLSearchParams();

  try {
    if (!session?.user?.id) {
      params.append("new", "true");

      logger.log("session?.user?.id null");

      redirect(`/auth/signup${params.toString()}`);
    }

    const orgUser = await prisma.orgUsers.findFirst({
      where: { user_id: session?.user?.id },
    });

    if (orgUser) {
      logger.info("user has already signed up redirecting to dashboard");

      redirect("/dashboard");
    }

    if (userCreate) {
      return (
        <div>
          <h2 className="mb-4 text-xl">Create Organization</h2>

          <CreateOrgForm userCreate={userCreate} />
        </div>
      );
    }
  } catch (error) {
    logger.error("Prisma: Error creating user redirecting", JSON.stringify(error, null, 2));

    redirect("/");
  }
}
