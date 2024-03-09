import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Routes } from "@/lib/constants/routes";
import { nextAuthOptions } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

async function OrganizationPage() {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const org = await prisma.organizations.findFirst({
    where: {
      user_id: session?.user?.id,
    },
  });

  const orgUser = await prisma.orgUsers.findFirst({
    where: { user_id: session?.user?.id },
    include: { org: true },
  });

  if (org || orgUser) {
    return redirect(`${Routes.ORGANIZATION}/${org?.name ?? orgUser?.org?.name}${Routes.HOME}`);
  }
  return redirect("/auth/signup");
}

export default OrganizationPage;
