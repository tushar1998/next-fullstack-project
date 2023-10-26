"use server"

import { Logger } from "@/lib/logger"
import { prisma, TOrganizationUsers } from "@/lib/prisma"

export const findOrgUsers = async (
  orgId: string
): Promise<TOrganizationUsers[]> => {
  const logger = new Logger(findOrgUsers.name)
  try {
    const org = await prisma.organizations.findUnique({
      where: { name: orgId },
      select: { id: true },
    })

    if (!org) {
      throw new Error(`Organization with name ${orgId} not found`)
    }

    const { id } = org

    const orgUsers = (await prisma.orgUsers.findMany({
      where: { org_id: id },
      include: { user: true, role: true },
    })) as TOrganizationUsers[]

    return orgUsers
  } catch (error) {
    logger.error("Failed to fetch member", JSON.stringify(error, null, 2))

    throw error
  }
}

export const findOrgUserWithEmail = async (email: string, org_id?: string) => {
  if (!org_id) {
    return false
  }

  const user = await prisma.users.findUnique({ where: { email } })

  if (!user) {
    return false
  }

  const orgUser = await prisma.orgUsers.findFirst({
    where: {
      org_id,
      user_id: user.id,
    },
  })

  return orgUser
}
