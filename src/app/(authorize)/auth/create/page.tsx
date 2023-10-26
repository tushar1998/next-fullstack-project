import React from "react";
import { redirect } from "next/navigation";
import { Session, getServerSession } from "next-auth";

import { Logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import CreateOrgForm from "@/components/client/create-org";

export default async function CreateUserPage() {
  const logger = new Logger(CreateUserPage.name);
  const session = await getServerSession(nextAuthOptions);

  const user_id = session?.user?.user_id;

  // User not authenticated
  if (!user_id) {
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

      return;
    }

    const org_user = await prisma.orgUsers.findFirst({
      where: { user_id: session?.user?.id },
    });

    if (org_user) {
      logger.info("user has already signed up redirecting to dashboard");

      redirect("/dashboard");

      return;
    }

    return (
      userCreate && (
        <div>
          <h2 className="mb-4 text-xl">Create Organization</h2>

          <CreateOrgForm userCreate={userCreate} />
        </div>
      )
    );
  } catch (error) {
    logger.error("Prisma: Error creating user redirecting", JSON.stringify(error, null, 2));

    redirect("/");
  }
}
