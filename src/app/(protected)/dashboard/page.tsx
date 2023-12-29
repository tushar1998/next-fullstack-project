import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { prisma } from "@/lib/prisma"
import { nextAuthOptions } from "@/lib/next-auth";

export default async function Dashboard() {
  const session = await getServerSession(nextAuthOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const org = await prisma.organizations.findFirst({
    where: {
      user_id: session?.user?.id,
    },
  })

  const orgUser = await prisma.orgUsers.findFirst({
    where: { user_id: session?.user?.id },
    include: { org: true },
  })

  if (org || orgUser) {
    return redirect(`/dashboard/${org?.name ?? orgUser?.org?.name}`)
  }
  return redirect("/auth/signup")
}
